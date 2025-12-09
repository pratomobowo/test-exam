
import fs from 'fs';

const jsonPath = './src/data/questions.json';
const mdPath = './question-exam.md';
const outputPath = './src/data/questions.json';

const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const mdData = fs.readFileSync(mdPath, 'utf8');

// 1. Build Answer Map from JSON (ID -> Correct Letter)
const answerMap = {};
jsonData.forEach(q => {
    answerMap[q.id] = q.answer;
});

// 2. Parse Markdown
const mdLines = mdData.split('\n');
const questions = [];
let currentBlock = null;

// Helper to process a block
function processBlock(block) {
    if (!block) return;

    // Join lines
    const fullText = block.lines.join(' ').trim();

    // Regex for ID
    const idMatch = fullText.match(/^(\d+)\.\s+(.*)/);
    if (!idMatch) return;

    const id = parseInt(idMatch[1]);
    let remainingText = idMatch[2];

    // Extract Options
    // We look for " A. ", " B. ", " C. ", " D. "
    // But sometimes they are at the start of the remaining text (if ID was "1. A. ...") - unlikely here.
    // Also " A. " might be present in text. We assume the LAST matching pattern of options.

    // Strategy: Find " D. " then look back for C, B, A.
    const idxD = remainingText.lastIndexOf(' D. ');
    if (idxD === -1) {
        // Fallback: maybe no space? "D."
        console.warn(`[WARN] Could not find option D for ID ${id}`);
        // Push as is with empty options (should shouldn't happen based on file review)
        return;
    }

    const textD = remainingText.substring(idxD + 4).trim();
    let beforeD = remainingText.substring(0, idxD);

    const idxC = beforeD.lastIndexOf(' C. ');
    const textC = beforeD.substring(idxC + 4).trim();
    let beforeC = beforeD.substring(0, idxC);

    const idxB = beforeC.lastIndexOf(' B. ');
    const textB = beforeC.substring(idxB + 4).trim();
    let beforeB = beforeC.substring(0, idxB);

    const idxA = beforeB.lastIndexOf(' A. ');
    const textA = beforeB.substring(idxA + 4).trim();
    const questionText = beforeB.substring(0, idxA).trim();

    // Correct Answer
    const correctLetter = answerMap[id];

    const options = [
        { label: 'A', text: textA, isCorrect: correctLetter === 'A' },
        { label: 'B', text: textB, isCorrect: correctLetter === 'B' },
        { label: 'C', text: textC, isCorrect: correctLetter === 'C' },
        { label: 'D', text: textD, isCorrect: correctLetter === 'D' }
    ];

    questions.push({
        id: id,
        question: questionText,
        options: options,
        answer: correctLetter || null
    });
}

// Loop lines to build blocks
// A block starts with "^Number." where Number == nextExpectedID
let nextID = 1;

mdLines.forEach(line => {
    const match = line.match(/^(\d+)\./);
    if (match) {
        const id = parseInt(match[1]);
        if (id === nextID) {
            // Start of new question
            if (currentBlock) {
                processBlock(currentBlock);
            }
            currentBlock = { id: id, lines: [line] };
            nextID++;
        } else {
            // Continuation of current block (or sub-list like "1. Risk treatment")
            if (currentBlock) {
                currentBlock.lines.push(line);
            }
        }
    } else {
        if (currentBlock) {
            currentBlock.lines.push(line);
        }
    }
});

// Process last block
if (currentBlock) {
    processBlock(currentBlock);
}

console.log(`Merged ${questions.length} questions.`);

// 3. Save
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
console.log(`Saved merged data to ${outputPath}`);
