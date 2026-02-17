
import nodemailer from 'nodemailer';

import fs from 'fs';
import path from 'path';

const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    if (!process.env.EMAIL_HOST) {
        const logMessage = `
[${new Date().toISOString()}] MOCK EMAIL
To: ${options.email}
Subject: ${options.subject}
Body: ${options.message}
---------------------------------------------------
`;
        console.log(logMessage);

        // Also write to a file for easier access
        try {
            const logPath = path.join(process.cwd(), 'otp-logs.txt');
            fs.appendFileSync(logPath, logMessage);
        } catch (err) {
            console.error('Failed to write to otp-logs.txt', err);
        }
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Econote'} <${process.env.FROM_EMAIL || 'noreply@econote.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
