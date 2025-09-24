import { sendEmailWithAttachment } from './utils/sendEmail.js';
import { generateBookingReceipt } from './utils/generateBookingReceipt.js';
import path from 'path';
import fs from 'fs';

// Test production email functionality
const testProductionEmail = async () => {
  try {
    console.log('🧪 Testing Production Email & PDF Generation...');
    
    // Ensure receipts directory exists
    const receiptsDir = path.join(process.cwd(), 'receipts');
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
      console.log('✅ Created receipts directory:', receiptsDir);
    }
    
    // Mock booking data for testing
    const mockBooking = {
      _id: 'test-booking-123',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      totalAmount: 5000,
      status: 'confirmed',
      paymentStatus: 'completed',
      pickupLocation: 'Patna',
      dropLocation: 'Gaya'
    };
    
    const mockCar = {
      brand: 'Toyota',
      model: 'Innova Crysta',
      pricePerDay: 2500,
      category: 'SUV'
    };
    
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com' // Change this to your email for testing
    };
    
    const testFilePath = path.join(receiptsDir, `test-receipt-${Date.now()}.pdf`);
    
    console.log('📄 Generating test PDF...');
    await generateBookingReceipt({ 
      booking: mockBooking, 
      car: mockCar, 
      user: mockUser, 
      filePath: testFilePath 
    });
    
    console.log('📧 Sending test email...');
    await sendEmailWithAttachment({
      to: mockUser.email,
      subject: 'Royal Car Booking Receipt (TEST)',
      text: `Dear ${mockUser.name},\n\nThis is a test email for production verification.\n\nThank you for choosing Royal Cars!`,
      attachmentPath: testFilePath
    });
    
    console.log('✅ Production email test completed successfully!');
    console.log('📎 PDF generated and email sent with attachment');
    
    // Cleanup test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('🧹 Test file cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Production email test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Test environment variables
const testEnvironment = () => {
  console.log('🔍 Environment Variables Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET');
  console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? 'SET' : 'NOT SET');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
  
  const emailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const emailPass = process.env.GMAIL_PASS || process.env.EMAIL_PASS;
  
  if (emailUser && emailPass) {
    console.log('✅ Email credentials available');
    return true;
  } else {
    console.log('❌ Email credentials missing');
    return false;
  }
};

// Run tests
const runProductionTests = async () => {
  console.log('🚀 Starting Production Diagnostics...\n');
  
  // Test environment
  const envOk = testEnvironment();
  
  if (envOk) {
    console.log('\n📧 Testing email functionality...');
    await testProductionEmail();
  } else {
    console.log('❌ Cannot test email - credentials missing');
  }
  
  console.log('\n🏁 Production diagnostics completed!');
};

// Uncomment to run tests
// runProductionTests();

export { testProductionEmail, testEnvironment, runProductionTests };