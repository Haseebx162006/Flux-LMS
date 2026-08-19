const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Load local .env if present
const localEnvPath = path.join(__dirname, "../../../.env");
const backendEnvPath = path.join(__dirname, "../../.env");
if (fs.existsSync(backendEnvPath)) {
    require("dotenv").config({ path: backendEnvPath });
} else if (fs.existsSync(localEnvPath)) {
    require("dotenv").config({ path: localEnvPath });
} else {
    require("dotenv").config();
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "https://developers.google.com/oauthplayground";
const SENDER_EMAIL = process.env.EMAIL_USER || process.env.MAIL_USER || "haseebahmad0160@gmail.com";

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
 * Sends a real email directly via the official Google Gmail REST API OAuth2.
 */
const sendEmail = async (to, subject, html, otpCode = "") => {
    if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN) {
        try {
            const OAuth2 = google.auth.OAuth2;
            const oauth2Client = new OAuth2(
                GOOGLE_CLIENT_ID,
                GOOGLE_CLIENT_SECRET,
                GOOGLE_REDIRECT_URI
            );

            oauth2Client.setCredentials({
                refresh_token: GOOGLE_REFRESH_TOKEN
            });

            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
            const rawMessage = makeBody(to, `FLUX LMS <${SENDER_EMAIL}>`, subject, html);
            
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

            console.log(`✉️ Real Email delivered to: ${to} | Gmail API Message ID: ${response.data.id}`);
            return { success: true, messageId: response.data.id };
        } catch (apiError) {
            console.error("⚠️ Gmail API Delivery Error:", apiError?.message || apiError);
        }
    }

    // Secondary Fallback: Nodemailer SMTP
    const EMAIL_PASS = (process.env.EMAIL_PASS || process.env.MAIL_PASS || "").replace(/\s+/g, '');
    if (EMAIL_PASS && SENDER_EMAIL) {
        try {
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.gmail.com",
                port: Number(process.env.SMTP_PORT) || 465,
                secure: true,
                auth: {
                    user: SENDER_EMAIL,
                    pass: EMAIL_PASS
                },
                tls: { rejectUnauthorized: false }
            });

            const info = await transporter.sendMail({
                from: `"FLUX LMS" <${SENDER_EMAIL}>`,
                to,
                subject,
                html
            });

            console.log(`✉️ Real Email delivered via SMTP fallback to: ${to} | ID: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (smtpErr) {
            console.error("⚠️ SMTP fallback notice:", smtpErr?.message || smtpErr);
        }
    }

    return { success: false };
};

/**
 * Sends an OTP account verification email.
 */
const sendOtpEmail = async (to, otp) => {
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 32px 24px; border: 1px solid #e0ded9; border-radius: 20px; background-color: #f5f4f0;">
            <div style="text-align: center; border-bottom: 2px solid #dedcd7; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="color: #f85e00; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">FLUX LMS</h1>
                <p style="color: #5a5955; margin: 6px 0 0 0; font-size: 12px; font-weight: 600;">Learning Skills That Stick • LMS 2.0</p>
            </div>
            
            <p style="font-size: 16px; color: #121212; font-weight: 700; margin-bottom: 8px;">Account Verification</p>
            <p style="font-size: 14px; color: #444; line-height: 1.6; margin-top: 0;">
                Welcome to FLUX LMS! Please use the following 6-digit One-Time Password (OTP) to verify your email address and activate your account:
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
                <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; padding: 16px 36px; background-color: #121212; border: 2px dashed #f85e00; border-radius: 16px; color: #f85e00; display: inline-block;">
                    ${otp}
                </span>
            </div>
            
            <p style="font-size: 13px; color: #666; line-height: 1.5;">
                ⏱️ This verification code is valid for <strong>10 minutes</strong>. If you did not create an account on FLUX LMS, please disregard this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #dedcd7; margin: 28px 0 16px 0;" />
            <p style="font-size: 11px; color: #888; text-align: center; margin: 0;">
                © 2026 FLUX LMS Platform • Automated Security Verification
            </p>
        </div>
    `;
    return sendEmail(to, "Your FLUX LMS Account Verification Code", html, otp);
};

/**
 * Sends a Password Reset Code email.
 */
const sendPasswordResetEmail = async (to, otp) => {
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 32px 24px; border: 1px solid #e0ded9; border-radius: 20px; background-color: #f5f4f0;">
            <div style="text-align: center; border-bottom: 2px solid #dedcd7; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="color: #f85e00; margin: 0; font-size: 28px; font-weight: 900;">FLUX LMS</h1>
            </div>
            
            <p style="font-size: 16px; color: #121212; font-weight: 700; margin-bottom: 8px;">Password Reset Code</p>
            <p style="font-size: 14px; color: #444; line-height: 1.6; margin-top: 0;">
                We received a request to reset your password. Use the following 6-digit verification code to choose a new password:
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
                <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; padding: 16px 36px; background-color: #121212; border: 2px dashed #f85e00; border-radius: 16px; color: #f85e00; display: inline-block;">
                    ${otp}
                </span>
            </div>
            
            <p style="font-size: 13px; color: #666; line-height: 1.5;">
                ⏱️ This code will expire in <strong>10 minutes</strong>.
            </p>
            
            <hr style="border: none; border-top: 1px solid #dedcd7; margin: 28px 0 16px 0;" />
            <p style="font-size: 11px; color: #888; text-align: center; margin: 0;">
                © 2026 FLUX LMS Platform
            </p>
        </div>
    `;
    return sendEmail(to, "FLUX LMS Password Reset Verification Code", html, otp);
};

module.exports = {
    sendOtpEmail,
    sendPasswordResetEmail
};