const nodemailer = require("nodemailer");

const getFrontendUrl = () => {
  const url = String(process.env.FRONTEND_URL || "http://localhost:5173")
    .trim()
    .replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/.test(url)) {
    console.error(
      "FRONTEND_URL is not set to your deployed frontend URL - reset links will point to localhost."
    );
  }

  return url;
};

const APP_NAME = process.env.APP_NAME || "InfraCrackNet";
const BRAND_COLOR = process.env.EMAIL_BRAND_COLOR || "#1d4ed8";
const RESET_EXPIRY_MINUTES = 15;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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
  const resetUrl = `${getFrontendUrl()}/reset-password/${encodeURIComponent(token)}`;
  const subject = `Reset your ${APP_NAME} password`;
  const greeting = name ? `Hello ${name},` : "Hello,";

  const text = [
    greeting,
    "",
    `We received a request to reset your ${APP_NAME} password.`,
    `Open this link to choose a new password (valid for ${RESET_EXPIRY_MINUTES} minutes):`,
    resetUrl,
    "",
    "If you did not request this, you can safely ignore this email.",
    "",
    `- The ${APP_NAME} Team`,
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="background:${BRAND_COLOR};padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold;">
                ${escapeHtml(APP_NAME)}
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:#111827;font-size:15px;line-height:1.6;">
                <p style="margin:0 0 12px;">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 20px;">We received a request to reset your password. Click the button below to choose a new one.</p>
                <p style="margin:0 0 24px;text-align:center;">
                  <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;border-radius:6px;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;font-weight:bold;">Reset Password</a>
                </p>
                <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Button not working? Copy and paste this link into your browser:</p>
                <p style="margin:0 0 20px;font-size:13px;word-break:break-all;"><a href="${resetUrl}" style="color:${BRAND_COLOR};">${resetUrl}</a></p>
                <p style="margin:0;font-size:13px;color:#6b7280;">This link expires in ${RESET_EXPIRY_MINUTES} minutes. If you did not request a password reset, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center;">
                &copy; ${new Date().getFullYear()} ${escapeHtml(APP_NAME)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return sendEmail({ to, subject, text, html });
};

// admin invitation email to add a new user to the system
const sendInvitationEmail = async ({
  to,
  role,
  token,
  invitedByName,
  validDays,
}) => {
  const inviteUrl = `${getFrontendUrl()}/accept-invitation/${encodeURIComponent(token)}`;

  const inviter = invitedByName || "The administrator";
  const subject = `You're invited to join ${APP_NAME} as ${role}`;

  const text = [
    "Hello,",
    "",
    `${inviter} has invited you to join ${APP_NAME} as ${role}.`,
    `Open this link to accept or decline (valid for ${validDays} days):`,
    inviteUrl,
    "",
    "If you were not expecting this invitation, you can safely ignore this email.",
    "",
    `- The ${APP_NAME} Team`,
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="background:${BRAND_COLOR};padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold;">
                ${escapeHtml(APP_NAME)}
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:#111827;font-size:15px;line-height:1.6;">
                <p style="margin:0 0 12px;">Hello,</p>
                <p style="margin:0 0 20px;">${escapeHtml(inviter)} has invited you to join ${escapeHtml(APP_NAME)} as <strong>${escapeHtml(role)}</strong>.</p>
                <p style="margin:0 0 24px;text-align:center;">
                  <a href="${inviteUrl}" style="display:inline-block;padding:12px 28px;border-radius:6px;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;font-weight:bold;">View Invitation</a>
                </p>
                <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Button not working? Copy and paste this link into your browser:</p>
                <p style="margin:0 0 20px;font-size:13px;word-break:break-all;"><a href="${inviteUrl}" style="color:${BRAND_COLOR};">${inviteUrl}</a></p>
                <p style="margin:0;font-size:13px;color:#6b7280;">This invitation is valid for ${validDays} days. If you were not expecting it, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center;">
                &copy; ${new Date().getFullYear()} ${escapeHtml(APP_NAME)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return sendEmail({ to, subject, text, html });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendInvitationEmail,
};
