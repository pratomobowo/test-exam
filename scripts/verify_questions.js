
import fs from 'fs';
import path from 'path';

// Paths
const jsonPath = './src/data/questions.json';
const mdPath = './question-exam.md';

// Read files
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const mdData = fs.readFileSync(mdPath, 'utf8');

// Parse Markdown
// Regex to find "Number. QuestionText" lines.
// Note: In the md file, questions seem to form a block.
// We'll look for lines starting with "\d+\." and capture the text.
const mdQuestions = [];
const lines = mdData.split('\n');
let currentMdQuestion = null;

lines.forEach(line => {
    const match = line.match(/^(\d+)\.\s+(.*)/);
    if (match) {
        // pattern: "1. Question text..."
        const id = parseInt(match[1]);
        let text = match[2];

        // Only accept if it matches the next expected ID
        // This avoids capturing "1. Step one" inside other questions
        if (currentMdQuestion === null) {
            if (id === 1) {
                currentMdQuestion = 1;
                mdQuestions.push({ id, text: match[2], original: line });
            }
        } else {
            if (id === currentMdQuestion + 1) {
                currentMdQuestion = id;
                mdQuestions.push({ id, text: match[2], original: line });
            }
        }

        // Sometimes text in MD might continue or contain options slightly differently
        // We'll just take the first line found as the main identifier for verification

        // Remove options if they are on the same line (e.g. "....? A. Opt1 B. Opt2")
        // A simple heuristic: split by " A. " if distinct enough, but question text usually ends with ? or .

        // For comparison, we'll normalize: lowercase, remove punctuation/spaces
    }
});

console.log(`Markdown loaded: ${mdQuestions.length} questions.`);
console.log(`JSON loaded: ${jsonData.length} questions.`);

// Compare
let errors = [];
let warnings = [];

// 1. Check Count
if (jsonData.length !== mdQuestions.length) {
    errors.push(`Count mismatch: JSON has ${jsonData.length}, MD has ${mdQuestions.length}`);
}

// 2. Check Order and Content
// We assume both should be sorted by ID 1..125
// Sort both just in case
jsonData.sort((a, b) => a.id - b.id);
mdQuestions.sort((a, b) => a.id - b.id);

const maxCount = Math.min(jsonData.length, mdQuestions.length);

for (let i = 0; i < maxCount; i++) {
    const jsonQ = jsonData[i];
    const mdQ = mdQuestions[i];

    // Check ID
    if (jsonQ.id !== mdQ.id) {
        errors.push(`Order Mismatch at index ${i}: JSON ID ${jsonQ.id} vs MD ID ${mdQ.id}`);
        continue;
    }

    // Check Content Similarity
    // Normalize: Remove all non-alphanumeric, lowercase
    const normJson = jsonQ.question.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normMd = mdQ.text.toLowerCase().replace(/[^a-z0-9]/g, '');

    // The MD text usually contains the options if they are on the same line, 
    // while JSON strictly has the question.
    // So distinct check: does MD text START with meaningful chunk of JSON text?
    // Or does Json text appear in MD text?

    // Actually, looking at the MD file (Step 36):
    // "1. Which of the following ... ? A. ... B. ..."
    // The Question ends at '?' usually.

    // We will check if the first 20 characters match (to skip minor formatting diffs)
    const sigJson = normJson.substring(0, 30);
    const sigMd = normMd.substring(0, 30);

    if (sigJson !== sigMd) {
        // Fallback: maybe md line includes the ID "1. " which we parsed out.
        // Let's print the mismatch for user to see.
        warnings.push(`\n[ID ${jsonQ.id}] Content mismatch possible:`);
        warnings.push(`  JSON: ${jsonQ.question.substring(0, 100)}...`);
        warnings.push(`  MD  : ${mdQ.text.substring(0, 100)}...`);
    } else {
        // Good match
    }
}

if (errors.length === 0 && warnings.length === 0) {
    console.log("\n✅ SUCCESS: All questions match in order and content (based on initial text check).");
} else {
    console.log("\n⚠️  ISSUES FOUND:");
    errors.forEach(e => console.error(`  [ERROR] ${e}`));
    if (warnings.length > 0) {
        console.log(`  [WARNING] ${warnings.length} potential content mismatch(es). (Showing first 5)`);
        warnings.slice(0, 15).forEach(w => console.log(w));
    }
}
