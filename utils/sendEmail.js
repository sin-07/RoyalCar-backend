import nodemailer from 'nodemailer';
import fs from 'fs';

export async function sendEmailWithAttachment({ to, subject, text, attachmentPath }) {
  try {
    console.log('📧 Email configuration check:');
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '***[SET]***' : '❌ NOT SET');
    console.log('Recipient:', to);
    console.log('Attachment path:', attachmentPath);
    
    // Check if attachment file exists
    if (!fs.existsSync(attachmentPath)) {
      throw new Error(`Attachment file does not exist: ${attachmentPath}`);
    }
    console.log('✅ Attachment file exists');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    console.log('📤 Verifying transporter connection...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully');

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

    console.log('📬 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}
