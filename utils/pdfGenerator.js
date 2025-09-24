import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateWelcomeHTML = (userName, userEmail) => {
  const htmlContent = `
        <!DOCTYPE html>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Royal Cars Welcome Package</title>
  <style>
    /* Force A4 size */
    @page {
      size: A4;
      margin: 10mm;
    }

    body {
      margin: 0;
      padding: 16px 24px;
      font-family: "Segoe UI", Arial, sans-serif;
      color: #222;
      font-size: 12px; /* Reduced to fit all in A4 */
      line-height: 1.4;
      background: linear-gradient(135deg, #ede9fe, #faf5ff, #ffffff);
      -webkit-print-color-adjust: exact;
    }

    h1 {
      font-size: 20px;
      color: #6d28d9;
      text-align: center;
      margin-bottom: 4px;
    }

    h2 {
      font-size: 14px;
      color: #7c3aed;
      margin-top: 14px;
      margin-bottom: 4px;
      border-bottom: 1px solid #e9d5ff;
      padding-bottom: 2px;
    }

    h3 {
      font-size: 13px;
      color: #7c3aed;
      margin-bottom: 2px;
    }

    .subtitle {
      text-align: center;
      font-size: 11px;
      color: #555;
      margin-bottom: 10px;
    }

    .section {
      margin-bottom: 12px;
    }

    ul, ol {
      margin: 4px 0 4px 16px;
      padding: 0;
    }

    li {
      margin-bottom: 2px;
    }

    .footer {
      text-align: center;
      font-size: 11px;
      color: #444;
      margin-top: 14px;
    }

    .signature {
      font-style: italic;
      color: #6d28d9;
      margin-top: 8px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>🚗 Royal Cars</h1>
  <div class="subtitle">Premium Car Rental Service</div>

  <div class="section" style="text-align:center;">
    <strong>Welcome to the Royal Cars Family!</strong>
  </div>

  <div class="section" style="text-align:center;">
    Dear <strong>${userName}</strong> (<em>${userEmail}</em>)<br>
    Your email has been successfully verified!
  </div>

  <div class="section">
    <h2>🌟 Why Choose Royal Cars?</h2>
    <p>Memorable journeys with luxury cars, excellent service, and transparent pricing.</p>
  </div>

  <div class="section">
    <h2>🎁 Welcome Benefits</h2>
    <ul>
      <li>Priority booking access</li>
      <li>Exclusive discounts on 1st three rentals</li>
      <li>Special member promotions</li>
    </ul>
  </div>

  <div class="section">
    <h2>✨ Royal Benefits Include</h2>
    <ul>
      <li>Luxury fleet from top brands</li>
      <li>24/7 Support team</li>
      <li>Instant online booking</li>
      <li>Transparent pricing</li>
      <li>Safety-checked vehicles</li>
      <li>Sedans, SUVs, Hybrids & Sports cars</li>
    </ul>
  </div>

  <div class="section">
    <h2>📋 Getting Started</h2>
    <ol>
      <li>Visit our website/app</li>
      <li>Browse our vehicle fleet</li>
      <li>Select dates & book</li>
      <li>Enjoy your royal drive</li>
    </ol>
  </div>

  <div class="section">
    <h2>🔐 Your Account</h2>
    <ul>
      <li><strong>Email:</strong> ${userEmail}</li>
      <li><strong>Status:</strong> Verified ✅</li>
      <li><strong>Membership:</strong> Royal Member</li>
      <li><strong>Join Date:</strong> ${new Date().toLocaleDateString()}</li>
    </ul>
  </div>

  <div class="section">
    <h2>📞 Contact & Support</h2>
    <ul>
      <li>🌐 www.royalcars.com</li>
      <li>📱 Mobile app available</li>
      <li>📞 +91 9876543210</li>
      <li>✉️ support@royalcars.com</li>
    </ul>
  </div>

  <div class="footer">
    <div class="signature">
      Thank you for choosing Royal Cars.<br>
      <strong>The Royal Cars Team</strong> - "Where Every Journey is Royal"
    </div>
    <div style="margin-top: 6px;">
      © 2025 Royal Cars. All rights reserved. | Generated for ${userName}
    </div>
  </div>
</body>
</html>


    `;

  return htmlContent;
};

// Simple text-based welcome message for email
export const generateWelcomeMessage = (userName, userEmail) => {
  return `
🌟 Welcome to Royal Cars, ${userName}! 🌟

Dear ${userName},

We are absolutely thrilled to welcome you to Royal Cars! Your email (${userEmail}) has been successfully verified, and you're now part of our exclusive community of discerning travelers who appreciate luxury, comfort, and reliability.

🚗 What makes Royal Cars special?
We don't just rent cars – we create memorable journeys. Every vehicle in our fleet is meticulously maintained, and every interaction is designed to exceed your expectations.

✨ Your Royal Benefits:
✓ Premium Fleet: Luxury vehicles from top brands, all under 2 years old
✓ 24/7 Support: Our dedicated team is always here to assist you
✓ Instant Booking: Reserve your perfect ride in just a few clicks
✓ Transparent Pricing: No hidden fees, just honest, upfront costs
✓ Safety First: All vehicles undergo rigorous safety inspections

🎁 Special Welcome Offer:
As a new member, you'll receive priority booking access and exclusive discounts on your first three rentals. Keep an eye on your inbox for special promotions crafted just for you!

📱 Ready to Start Your Journey?
• Download our app or visit our website
• Call us at: +91 9876543210
• Email us at: support@royalcars.com

Thank you for choosing Royal Cars. We're honored to be part of your journey and can't wait to serve you with excellence that defines the Royal experience.

With warm regards and excitement for your upcoming adventures,
The Royal Cars Team
"Where Every Journey is Royal"

---
This email was sent to ${userEmail} because you recently created an account with Royal Cars.
  `;
};

// Generate actual PDF file using Puppeteer
export const generateWelcomePDF = async (userName, userEmail) => {
  let browser;
  try {
    // Launch browser with production-compatible settings
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu"
      ],
    });

    const page = await browser.newPage();

    // Get HTML content
    const htmlContent = generateWelcomeHTML(userName, userEmail);

    // Set content and wait for it to load
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF with single page optimization
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15px",
        right: "15px",
        bottom: "15px",
        left: "15px",
      },
      preferCSSPageSize: true,
      scale: 0.9, // Slightly reduce size to fit more content
      displayHeaderFooter: false,
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
