
import nodemailer from 'nodemailer';

const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    // Use a test account or real SMTP service
    // For dev, let's use a mock or try to use a real one if env vars exist

    // NOTE: For production, use SendGrid, Mailgun, or AWS SES

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: Number(process.env.EMAIL_PORT) || 587,
        auth: {
            user: process.env.EMAIL_USER || 'ethereal_user',
            pass: process.env.EMAIL_PASS || 'ethereal_pass',
        },
    });

    // If no real creds, just log it
    if (!process.env.EMAIL_HOST) {
        console.log('---------------------------------------------------');
        console.log(`[MOCK EMAIL] To: ${options.email}`);
        console.log(`[MOCK EMAIL] Subject: ${options.subject}`);
        console.log(`[MOCK EMAIL] Body: ${options.message}`);
        console.log('---------------------------------------------------');
        return;
    }

    const message = {
        from: `${process.env.FROM_NAME || 'CollegeNotes'} <${process.env.FROM_EMAIL || 'noreply@collegenotes.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
