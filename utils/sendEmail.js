import nodemailer from 'nodemailer';
import fs from 'fs';

export async function sendEmailWithAttachment({ to, subject, text, attachmentPath }) {
  try {
    console.log('📧 Email configuration check:');
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '***[SET]***' : '❌ NOT SET');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***[SET]***' : '❌ NOT SET');
    console.log('Recipient:', to);
    console.log('Attachment path:', attachmentPath);
    
    // Use fallback email credentials
    const emailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
    const emailPass = process.env.GMAIL_PASS || process.env.EMAIL_PASS;
    
    if (!emailUser || !emailPass) {
      throw new Error('Email credentials not configured. Check GMAIL_USER/EMAIL_USER and GMAIL_PASS/EMAIL_PASS environment variables.');
    }
    
    // Check if attachment file exists
    if (!fs.existsSync(attachmentPath)) {
      throw new Error(`Attachment file does not exist: ${attachmentPath}`);
    }
    console.log('✅ Attachment file exists');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    console.log('📤 Verifying transporter connection...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully');

    const mailOptions = {
      from: emailUser,
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
