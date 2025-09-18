import puppeteer from 'puppeteer';
import { getBookingReceiptHTML } from './bookingReceiptTemplate.js';

export async function generateBookingReceipt({ booking, car, user, filePath }) {
  console.log('📄 Starting PDF generation...');
  console.log('Booking ID:', booking._id);
  console.log('User:', user.name);
  console.log('Car:', car.brand, car.model);
  console.log('File path:', filePath);
  
  try {
    const html = getBookingReceiptHTML({ booking, car, user });
    console.log('✅ HTML template generated');
    
    const browser = await puppeteer.launch({ headless: true });
    console.log('✅ Browser launched');
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    console.log('✅ HTML content loaded');
    
    await page.pdf({ path: filePath, format: 'A4', printBackground: true });
    console.log('✅ PDF generated successfully at:', filePath);
    
    await browser.close();
    console.log('✅ Browser closed');
    
    return filePath;
  } catch (error) {
    console.error('❌ PDF generation failed:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}
