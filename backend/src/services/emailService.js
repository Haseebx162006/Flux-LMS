const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "https://developers.google.com/oauthplayground";
const EMAIL_USER = process.env.EMAIL_USER;

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
 * Sends an email using the Gmail REST API (over HTTPS Port 443).
 * This completely avoids SMTP port blocks (465/587) on servers like Render.
 */
const sendEmailViaGmailApi = async (to, subject, html) => {
    try {
        if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !EMAIL_USER) {
            console.warn("⚠️ Gmail API credentials missing in .env. Email dispatch simulated.");
            console.log(`📧 [Simulated Email] To: ${to} | Subject: ${subject}`);
            return { id: "simulated-email-id" };
        }

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
        const rawMessage = makeBody(to, `CampuzLift <${EMAIL_USER}>`, subject, html);
        
        // Gmail API raw message must be web-safe base64 encoded
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
        console.log("Email sent successfully via Gmail API:", response.data.id);
        return response.data;
    } catch (error) {
        console.error("Error sending email via Gmail API:", error);
        throw new Error("Failed to send email");
    }
};

/**
 * Sends an OTP email using Gmail REST API.
 */
const sendOtpEmail = async (to, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="color: #4CAF50; margin: 0; font-size: 24px;">CampuzLift</h1>
            </div>
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">
                Thank you for choosing CampuzLift. Please use the following One-Time Password (OTP) to verify your account:
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 12px 25px; background-color: #f9f9f9; border: 1px dashed #4CAF50; border-radius: 5px; color: #4CAF50; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 14px; color: #777; line-height: 1.5;">
                This OTP is valid for 5 minutes. If you did not request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center; margin: 0;">
                This is an automated email. Please do not reply directly to this message.
            </p>
        </div>
    `;
    return sendEmailViaGmailApi(to, "CampuzLift OTP Verification", html);
};

const sendPasswordResetEmail = async (to, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="color: #0066FF; margin: 0; font-size: 24px;">CampuzLift</h1>
            </div>
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">
                We received a request to reset the password for your CampuzLift account. Please use the following 6-digit verification code (OTP) on the reset password screen:
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 12px 25px; background-color: #f9f9f9; border: 1px dashed #0066FF; border-radius: 5px; color: #0066FF; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 14px; color: #777; line-height: 1.5;">
                This password reset code is valid for 5 minutes. If you did not request this, please ignore this email and your password will remain unchanged.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center; margin: 0;">
                This is an automated email. Please do not reply directly to this message.
            </p>
        </div>
    `;
    return sendEmailViaGmailApi(to, "CampuzLift Password Reset Code", html);
};

module.exports = {
    sendOtpEmail,
    sendPasswordResetEmail
};