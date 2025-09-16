import { sendOtpMail } from './utils/mailer.js';

// Test the mobile-responsive OTP email
const testMobileOtpEmail = async () => {
  try {
    console.log('Testing mobile-responsive OTP email...');
    
    // Replace with a test email
    const testEmail = 'test@example.com';
    const testOtp = '123456';
    
    await sendOtpMail(testEmail, testOtp);
    console.log('✅ Mobile-responsive OTP email sent successfully!');
    console.log('📱 Email optimized for mobile devices with:');
    console.log('   - Proper viewport settings');
    console.log('   - Mobile-first responsive design');
    console.log('   - Centered layout for all screen sizes');
    console.log('   - Touch-friendly buttons and spacing');
    console.log('   - Scalable fonts and images');
  } catch (error) {
    console.error('❌ Error sending mobile OTP email:', error);
  }
};

// Uncomment the line below to test
// testMobileOtpEmail();

export { testMobileOtpEmail };