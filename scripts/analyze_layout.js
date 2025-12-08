
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const htmlPath = '../Certified Ethical Hacker_CEHv13_Mock Questions (1).html';
const html = fs.readFileSync(path.resolve(htmlPath), 'utf8');
const $ = cheerio.load(html);

const buckets = {};

$('.pdf24_01').each((i, el) => {
    const style = $(el).attr('style') || '';
    const leftMatch = style.match(/left:([\d.]+)em/);
    if (leftMatch) {
        const left = parseFloat(leftMatch[1]);
        const key = Math.floor(left);
        const text = $(el).text().trim().substring(0, 50); // Sample
        if (!buckets[key]) buckets[key] = [];
        if (buckets[key].length < 5) buckets[key].push(text);
    }
});

console.log(JSON.stringify(buckets, null, 2));
