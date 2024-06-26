const { emailQueue } = require('../tasks/emailProcessor');
const { analyzeEmailContent, generateReply } = require('./openaiService');
const nodemailer = require('nodemailer');

async function processEmails(emails) {
    for (const email of emails) {
        const content = email.snippet; // Example, adjust as needed
        const analysis = await analyzeEmailContent(content);
        const reply = await generateReply(analysis);

        // Send reply
        await sendEmail(email.from, reply);
    }
}

async function sendEmail(recipient, content) {
    // Create a Nodemailer transporter using your email provider's SMTP settings
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'Automated Reply',
        text: content,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { processEmails };
