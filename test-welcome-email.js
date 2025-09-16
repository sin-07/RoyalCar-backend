import { sendWelcomeEmail } from './utils/mailer.js';

// Test the welcome email functionality with PDF attachment
const testWelcomeEmail = async () => {
  try {
    console.log('Testing welcome email with PDF attachment...');
    
    // Replace with a test email
    const testEmail = 'test@example.com';
    const testName = 'John Doe';
    
    console.log('📧 Generating PDF and sending welcome email...');
    await sendWelcomeEmail(testEmail, testName);
    console.log('✅ Welcome email with PDF attachment sent successfully!');
    console.log('📎 PDF attached with Royal Cars welcome package');
  } catch (error) {
    console.error('❌ Error sending welcome email with PDF:', error);
  }
};

// Uncomment the line below to test
// testWelcomeEmail();

export { testWelcomeEmail };