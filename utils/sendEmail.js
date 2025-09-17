import nodemailer from 'nodemailer';
import fs from 'fs';

export async function sendEmailWithAttachment({ to, subject, text, attachmentPath }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: 'RoyalCar-Booking-Receipt.pdf',
        path: attachmentPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
