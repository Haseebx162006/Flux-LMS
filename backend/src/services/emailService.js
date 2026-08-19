const nodemailer = require("nodemailer");

/**
 * Sends an email using SMTP (Gmail, Brevo, SendGrid, Mailgun, or custom SMTP) or Google OAuth2.
 */
const sendEmail = async (to, subject, html, otpCode = "") => {
    const EMAIL_USER = process.env.EMAIL_USER || process.env.MAIL_USER || process.env.SMTP_USER || "haseebahmad0160@gmail.com";
    const EMAIL_PASS = (process.env.EMAIL_PASS || process.env.MAIL_PASS || process.env.SMTP_PASS || "").replace(/\s+/g, '');
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;

    // 1. Primary Method: SMTP Transporter (Gmail App Password / Custom SMTP)
    if (EMAIL_USER && EMAIL_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: SMTP_PORT,
                secure: SMTP_PORT === 465,
                auth: {
                    user: EMAIL_USER,
                    pass: EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const info = await transporter.sendMail({
                from: `"FLUX LMS" <${EMAIL_USER}>`,
                to,
                subject,
                html
            });

            console.log(`✉️ Email successfully delivered via SMTP to ${to} | Message ID: ${info.messageId}`);
            return { success: true, messageId: info.messageId, otp: otpCode };
        } catch (smtpErr) {
            console.warn("⚠️ SMTP dispatch notice:", smtpErr?.message || smtpErr);
        }
    } else {
        console.warn("ℹ️ SMTP credentials (EMAIL_USER / MAIL_PASS) not fully set in environment.");
    }

    // 2. Secondary Method: Google OAuth2 Transporter (if configured)
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

    if (CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN && EMAIL_USER) {
        try {
            const oauthTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: EMAIL_USER,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN
                }
            });

            const info = await oauthTransporter.sendMail({
                from: `"FLUX LMS" <${EMAIL_USER}>`,
                to,
                subject,
                html
            });

            console.log(`✉️ Email successfully delivered via Google OAuth2 to ${to} | Message ID: ${info.messageId}`);
            return { success: true, messageId: info.messageId, otp: otpCode };
        } catch (oauthErr) {
            console.warn("⚠️ Google OAuth2 dispatch notice:", oauthErr?.message || oauthErr);
        }
    }

    // 3. Terminal & Diagnostic Logger
    console.log(`\n======================================================`);
    console.log(`📧 [FLUX LMS VERIFICATION DISPATCH]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    if (otpCode) {
        console.log(`🔑 OTP CODE: >>> ${otpCode} <<<`);
    }
    console.log(`======================================================\n`);

    return { success: false, id: "logged-otp-fallback", otp: otpCode };
};

/**
 * Sends an OTP account verification email.
 */
const sendOtpEmail = async (to, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0ded9; border-radius: 16px; background-color: #f5f4f0;">
            <div style="text-align: center; border-bottom: 2px solid #dedcd7; padding-bottom: 12px; margin-bottom: 24px;">
                <h1 style="color: #f85e00; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">FLUX LMS</h1>
                <p style="color: #5a5955; margin: 4px 0 0 0; font-size: 12px;">Next-Gen Fullstack Learning Platform</p>
            </div>
            <p style="font-size: 15px; color: #121212; font-weight: bold;">Hello,</p>
            <p style="font-size: 14px; color: #444; line-height: 1.6;">
                Thank you for joining FLUX LMS! Please use the following One-Time Password (OTP) code to verify your email address and activate your account:
            </p>
            <div style="text-align: center; margin: 28px 0;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 14px 28px; background-color: #121212; border: 2px dashed #f85e00; border-radius: 12px; color: #f85e00; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 13px; color: #666; line-height: 1.5;">
                ⏱️ This verification code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #dedcd7; margin: 24px 0;" />
            <p style="font-size: 11px; color: #888; text-align: center; margin: 0;">
                © 2026 FLUX LMS • Automated Security Delivery
            </p>
        </div>
    `;
    return sendEmail(to, "FLUX LMS Account Verification OTP", html, otp);
};

/**
 * Sends a Password Reset Code email.
 */
const sendPasswordResetEmail = async (to, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0ded9; border-radius: 16px; background-color: #f5f4f0;">
            <div style="text-align: center; border-bottom: 2px solid #dedcd7; padding-bottom: 12px; margin-bottom: 24px;">
                <h1 style="color: #f85e00; margin: 0; font-size: 26px; font-weight: 800;">FLUX LMS</h1>
            </div>
            <p style="font-size: 15px; color: #121212; font-weight: bold;">Password Reset Request</p>
            <p style="font-size: 14px; color: #444; line-height: 1.6;">
                We received a request to reset the password for your FLUX LMS account. Use the following 6-digit code to proceed:
            </p>
            <div style="text-align: center; margin: 28px 0;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 14px 28px; background-color: #121212; border: 2px dashed #f85e00; border-radius: 12px; color: #f85e00; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 13px; color: #666; line-height: 1.5;">
                ⏱️ This code expires in 10 minutes. If you did not request this password reset, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #dedcd7; margin: 24px 0;" />
            <p style="font-size: 11px; color: #888; text-align: center; margin: 0;">
                © 2026 FLUX LMS
            </p>
        </div>
    `;
    return sendEmail(to, "FLUX LMS Password Reset Code", html, otp);
};

module.exports = {
    sendOtpEmail,
    sendPasswordResetEmail
};