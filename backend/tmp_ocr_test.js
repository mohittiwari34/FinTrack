const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const uploadDir = 'c:\\Users\\Mohit kumar\\Desktop\\Expense-Tracker\\backend\\uploads';
const files = fs.readdirSync(uploadDir).filter(f => !f.endsWith('.pdf'));

if (files.length === 0) {
    console.log("No images found in uploads directory");
    process.exit(0);
}

// Get the latest file
const latestFile = files.map(f => ({ name: f, time: fs.statSync(path.join(uploadDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time)[0].name;

const imagePath = path.join(uploadDir, latestFile);
console.log(`Testing OCR on: ${latestFile}`);

Tesseract.recognize(imagePath, 'eng').then(({ data: { text } }) => {
    console.log("=== EXTRACTED TEXT ===");
    console.log(text);
    console.log("======================");
    
    let amount = '';
    const amountRegex = /(?:Rs\.?|INR|₹|F|\$)?\s*([\d,]+\.\d{2})/g;
    const matches = [];
    let match;
    while ((match = amountRegex.exec(text)) !== null) {
        matches.push(match[1]);
    }
    console.log("Amount matches:", matches);
    if (matches && matches.length > 0) {
        const amounts = matches.map(m => parseFloat(m.replace(/,/g, '')));
        amount = Math.max(...amounts).toFixed(2);
        console.log("Max amount:", amount);
    }

    let date = '';
    const dateRegex1 = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/;
    const dateRegex2 = /(\d{1,2})\s*[-/\.]\s*([a-zA-Z]{3,})\s*[-/\.]\s*(\d{2,4})/;
    
    let dateMatch = text.match(dateRegex1);
    if (dateMatch) {
        console.log("Date matches (Format 1):", dateMatch[0]);
    } else {
        dateMatch = text.match(dateRegex2);
        if (dateMatch) {
            console.log("Date matches (Format 2):", dateMatch[0]);
        } else {
            console.log("No Date found");
        }
    }
});
