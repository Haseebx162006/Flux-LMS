const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "https://developers.google.com/oauthplayground";
const EMAIL_USER = process.env.EMAIL_USER || process.env.MAIL_USER;
const EMAIL_PASS = (process.env.EMAIL_PASS || process.env.MAIL_PASS || "").replace(/\s+/g, '');

/**
 * Encodes an HTML message to base64 format compliant with the Gmail API.
 */
const makeBody = (to, from, subject, html) => {
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        `To: ${to}`,
        `From: ${from}`,
        `Subject: ${utf8Subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(html).toString('base64')
    ];
    return messageParts.join('\r\n');
};

/**
 * Sends an email using Gmail SMTP App Password or Gmail REST API OAuth2.
 */
const sendEmail = async (to, subject, html, otpCode = "") => {
    // 1. Primary Method: Nodemailer SMTP with Gmail App Password (super fast & reliable)
    if (EMAIL_USER && EMAIL_PASS) {
        try {
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: EMAIL_USER,
                    pass: EMAIL_PASS
                }
            });

            const info = await transporter.sendMail({
                from: `"FLUX LMS" <${EMAIL_USER}>`,
                to,
                subject,
                html
            });

            console.log("✉️ Real Email delivered via Gmail SMTP to:", to, "| Message ID:", info.messageId);
            return info;
        } catch (smtpErr) {
            console.warn("⚠️ SMTP Nodemailer dispatch failed:", smtpErr?.message || smtpErr);
        }
    }

    // 2. Secondary Method: Gmail REST API with OAuth2
    if (CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN && EMAIL_USER) {
        try {
            const { google } = require("googleapis");
            const OAuth2 = google.auth.OAuth2;
            const oauth2Client = new OAuth2(
                CLIENT_ID,
                CLIENT_SECRET,
                REDIRECT_URI
            );
            oauth2Client.setCredentials({
                refresh_token: REFRESH_TOKEN
            });

            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
            const rawMessage = makeBody(to, `FLUX LMS <${EMAIL_USER}>`, subject, html);
            
            const encodedMessage = Buffer.from(rawMessage)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            const response = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage
                }
            });
            console.log("✉️ Real Email delivered via Gmail API to:", to, "| Message ID:", response.data.id);
            return response.data;
        } catch (gmailApiErr) {
            console.warn("⚠️ Gmail API dispatch failed (OAuth refresh token invalid/expired):", gmailApiErr?.message || gmailApiErr);
        }
    }

    // 3. Development Fallback: Terminal logger
    console.log(`\n======================================================`);
    console.log(`📧 [EMAIL VERIFICATION DISPATCH]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    if (otpCode) {
        console.log(`🔑 VERIFICATION OTP CODE: >>> ${otpCode} <<<`);
    }
    console.log(`======================================================\n`);

    return { id: "logged-otp-fallback" };
};

/**
 * Sends an OTP email.
 */
const sendOtpEmail = async (to, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="color: #f85e00; margin: 0; font-size: 24px;">FLUX LMS</h1>
            </div>
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">
                Thank you for choosing FLUX LMS. Please use the following One-Time Password (OTP) to verify your account:
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 12px 25px; background-color: #121212; border: 1px dashed #f85e00; border-radius: 8px; color: #f85e00; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 14px; color: #777; line-height: 1.5;">
                This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center; margin: 0;">
                This is an automated email from FLUX LMS. Please do not reply directly to this message.
            </p>
        </div>
    `;
    return sendEmail(to, "FLUX LMS Account Verification OTP", html, otp);
};

const sendPasswordResetEmail = async (to, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="color: #f85e00; margin: 0; font-size: 24px;">FLUX LMS</h1>
            </div>
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">
                We received a request to reset the password for your FLUX LMS account. Please use the following 6-digit verification code:
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 12px 25px; background-color: #121212; border: 1px dashed #f85e00; border-radius: 8px; color: #f85e00; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 14px; color: #777; line-height: 1.5;">
                This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center; margin: 0;">
                This is an automated email from FLUX LMS. Please do not reply directly to this message.
            </p>
        </div>
    `;
    return sendEmail(to, "FLUX LMS Password Reset Code", html, otp);
};

module.exports = {
    sendOtpEmail,
    sendPasswordResetEmail
};