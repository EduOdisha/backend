import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'EduOdisha'} <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
    to: email,
    subject,
    html,
    text: text || html?.replace(/<[^>]*>/g, ''),
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};