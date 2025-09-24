import puppeteer from 'puppeteer';
import { getBookingReceiptHTML } from './bookingReceiptTemplate.js';
import fs from 'fs';
import path from 'path';

export async function generateBookingReceipt({ booking, car, user, filePath }) {
  console.log('📄 Starting PDF generation...');
  console.log('Booking ID:', booking._id);
  console.log('User:', user.name);
  console.log('Car:', car.brand, car.model);
  console.log('File path:', filePath);
  
  try {
    // Ensure receipts directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('✅ Receipts directory created:', dir);
    }
    
    const html = getBookingReceiptHTML({ booking, car, user });
    console.log('✅ HTML template generated');
    
    // Production-compatible puppeteer launch options
    const browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    console.log('✅ Browser launched with production config');
    
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
