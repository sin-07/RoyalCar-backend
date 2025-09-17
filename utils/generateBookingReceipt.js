import puppeteer from 'puppeteer';
import { getBookingReceiptHTML } from './bookingReceiptTemplate.js';

export async function generateBookingReceipt({ booking, car, user, filePath }) {
  const html = getBookingReceiptHTML({ booking, car, user });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: filePath, format: 'A4', printBackground: true });
  await browser.close();
  return filePath;
}
