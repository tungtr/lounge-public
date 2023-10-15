// Essentials
import nodemailer, { smtpTransport } from 'nodemailer';

const mailOptions = ({
  type,
  to,
  url
}: {
  type: string,
  to: string,
  url: string
}) => {
  let subject = 'Lounge | ';
  let html = `
    <div>You've created your account successfully!</div>
    <div>Click <a style='text-decoration: underline; color: #6D3CF8;' href=${url}>here</a> to activate your account.</div>
  `;
  switch (type) {
    case 'forgot-password':
      subject += 'Reset password';
      html = `
        <div>You've just requested a password reset</div>
        <div>Click <a style='text-decoration: underline; color: #6D3CF8;' href=${url}>here</a> to reset your password.</div>
      `
      break;
    default:
      subject += 'Account verification';
  }

  return {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };
};

export const sendMail = async ({
  type,
  to,
  url
}: {
  type: string,
  to: string,
  url: string
}) => {
  const transporter = nodemailer.createTransport(smtpTransport({
    name: 'lounge-tungtr.vercel.app',
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  }));

  const result = await transporter.sendMail(mailOptions({ type, to, url }));
  return result;
};