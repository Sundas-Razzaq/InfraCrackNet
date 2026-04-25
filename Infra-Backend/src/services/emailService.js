const nodemailer = require("nodemailer");

const getFrontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

const getMailerConfig = () => {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT) || 587;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !user || !pass) {
        throw new Error("Email service is not configured");
    }

    return {
        host,
        port,
        secure: process.env.EMAIL_SECURE === "true" || port === 465,
        auth: {
            user,
            pass,
        },
    };
};

const getFromAddress = () =>
    process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@infracracknet.local";

const createTransporter = () => nodemailer.createTransport(getMailerConfig());

const sendEmail = async ({ to, subject, text, html }) => {
    const transporter = createTransporter();

    return transporter.sendMail({
        from: getFromAddress(),
        to,
        subject,
        text,
        html,
    });
};

const sendPasswordResetEmail = async ({ to, name, token }) => {
    const resetUrl = new URL(`/reset-password/${token}`, getFrontendUrl()).toString();
    const subject = "Reset your password";
    const greeting = name ? `Hello ${name},` : "Hello,";
    const text = `${greeting}\n\nYou requested a password reset. Use the link below to set a new password:\n${resetUrl}\n\nThis link expires in 15 minutes.`;
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <p>${greeting}</p>
            <p>You requested a password reset. Use the button below to set a new password.</p>
            <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;border-radius:6px;background:#111827;color:#ffffff;text-decoration:none;">Reset Password</a></p>
            <p>If the button does not work, copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link expires in 15 minutes.</p>
        </div>
    `;

    return sendEmail({
        to,
        subject,
        text,
        html,
    });
};

module.exports = {
    sendEmail,
    sendPasswordResetEmail,
};
