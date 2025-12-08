
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const htmlPath = '../Certified Ethical Hacker_CEHv13_Mock Questions (1).html';
const outputPath = './src/data/questions.json';

const html = fs.readFileSync(path.resolve(htmlPath), 'utf8');
const $ = cheerio.load(html);

const questions = [];
let currentQuestion = null;

// The PDF conversion seems to position elements absolutely. 
// We rely on the "top" style to sort elements vertically to reconstruct flow.
const elements = [];


$('.pdf24_02').each((pageIndex, pageEl) => {
    const pageElements = [];

    $(pageEl).find('.pdf24_01').each((i, el) => {
        const style = $(el).attr('style') || '';
        const topMatch = style.match(/top:([\d.]+)em/);
        const leftMatch = style.match(/left:([\d.]+)em/);

        if (topMatch) {
            const top = parseFloat(topMatch[1]);
            const left = leftMatch ? parseFloat(leftMatch[1]) : 0;

            // Filter out Right-side headers/footers (Copyright info)
            // Instead of spatial filtering, we will rely on text content filtering later
            // if (left > 25) return; 

            // Store the raw HTML of the element to check for red color later
            // Check for red color indicating correct answer
            // Classes identified: pdf24_16, pdf24_25, pdf24_42, pdf24_54, pdf24_73, pdf24_89, pdf24_127
            const redClasses = ['pdf24_16', 'pdf24_25', 'pdf24_42', 'pdf24_54', 'pdf24_73', 'pdf24_89', 'pdf24_127'];
            const $spans = $(el).find('span');
            let isRed = false;
            let text = '';

            // Also check the div style itself
            if (style.includes('color: #FF0000') || style.includes('color:#FF0000')) {
                isRed = true;
            }

            $spans.each((j, span) => {
                const spanClass = $(span).attr('class') || '';
                const spanStyle = $(span).attr('style') || '';
                const spanText = $(span).text();
                text += spanText;

                if (redClasses.some(cls => spanClass.includes(cls)) ||
                    spanStyle.includes('#FF0000') ||
                    spanStyle.includes('color: #FF0000')) {
                    isRed = true;
                }
            });

            text = text.trim().replace(/\s+/g, ' ');

            if (text) {
                const elementHtml = $(el).html();
                pageElements.push({ top, left, text, html: elementHtml, isCorrect: isRed });
            }
        }
    });

    // Sort elements within the page
    pageElements.sort((a, b) => {
        const topDiff = a.top - b.top;
        if (Math.abs(topDiff) < 0.5) { // Same line tolerance
            return a.left - b.left;
        }
        return topDiff;
    });

    elements.push(...pageElements);
});


// Parse sorted elements
// Heuristic:
// Questions start with a number followed by a dot (e.g., "27. ") or "27."
// Options start with a letter followed by a dot (e.g., "A. ") or "A."

const questionRegex = /^\d+\.\s*/;
const optionRegex = /^[A-D]\.\s*/;

let processingType = null; // 'question' or 'option'
let currentOptionLabel = null;

elements.forEach((el) => {
    const text = el.text;

    // Ignore page numbers or headers/footers if they appear standard
    if (text.match(/^Page\s\|\s\d+/) ||
        text.includes('Ethical Hacking and Countermeasures') ||
        text.includes('Exam 312-50') ||
        text.includes('All Rights Reserved') ||
        text.includes('Copyright © by') ||
        text.trim() === 'Mock Questions'
    ) {
        return;
    }

    if (questionRegex.test(text)) {
        const idMatch = text.match(/^(\d+)/);
        const newId = parseInt(idMatch[1]);

        // Check if this is likely a list item (e.g., "1. Step one") instead of a new question
        // If the number is smaller than the current question ID (and not the first question), treat as text
        if (currentQuestion && newId < currentQuestion.id) {
            if (processingType === 'question') {
                currentQuestion.question += ' ' + text;
            } else if (processingType === 'option') {
                const opt = currentQuestion.options[currentQuestion.options.length - 1];
                if (opt) {
                    opt.text += ' ' + text;
                    if (el.isCorrect) {
                        opt.isCorrect = true;
                        currentQuestion.answer = opt.label;
                    }
                }
            }
        } else {
            // Save previous question if exists
            if (currentQuestion) {
                questions.push(currentQuestion);
            }

            // Start new question
            currentQuestion = {
                id: newId,
                question: text.replace(/^\d+\.\s*/, ''),
                options: [],
                answer: null // We'll store the letter of the correct answer
            };
            processingType = 'question';
            currentOptionLabel = null;
        }

    } else if (optionRegex.test(text)) {
        if (!currentQuestion) return;

        const labelMatch = text.match(/^([A-D])/);
        const label = labelMatch[1];
        const content = text.replace(/^[A-D]\.\s*/, '');

        currentQuestion.options.push({
            label: label,
            text: content,
            isCorrect: el.isCorrect
        });

        if (el.isCorrect) {
            currentQuestion.answer = label;
        }

        processingType = 'option';
        currentOptionLabel = label;

    } else {
        // Continuation of previous text
        if (currentQuestion) {
            if (processingType === 'question') {
                currentQuestion.question += ' ' + text;
            } else if (processingType === 'option') {
                // Find method to append to last option
                const opt = currentQuestion.options[currentQuestion.options.length - 1];
                if (opt) {
                    opt.text += ' ' + text;
                    // If any part of the option line is red, mark it correct (though usually the label "A." is red)
                    if (el.isCorrect) {
                        opt.isCorrect = true;
                        currentQuestion.answer = opt.label;
                    }
                }
            }
        }
    }
});

// Push last question
if (currentQuestion) {
    questions.push(currentQuestion);
}

// Deduplicate questions based on ID
const uniqueQuestions = [];
const seenIds = new Set();
for (const q of questions) {
    if (!seenIds.has(q.id)) {
        uniqueQuestions.push(q);
        seenIds.add(q.id);
    }
}

// Final cleanup: Ensure one correct answer per question if possible, or leave as is.
console.log(`Extracted ${uniqueQuestions.length} unique questions.`);

fs.writeFileSync(outputPath, JSON.stringify(uniqueQuestions, null, 2));
console.log(`Saved to ${outputPath}`);
