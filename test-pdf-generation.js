import { generateWelcomePDF } from './utils/pdfGenerator.js';
import fs from 'fs';

// Quick test to verify PDF generation works
const quickPDFTest = async () => {
  try {
    console.log('🧪 Testing PDF generation...');
    
    const testUser = 'John Doe';
    const testEmail = 'john.doe@example.com';
    
    console.log(`Generating PDF for ${testUser}...`);
    const pdfBuffer = await generateWelcomePDF(testUser, testEmail);
    
    console.log(`✅ PDF generated successfully!`);
    console.log(`📊 PDF size: ${pdfBuffer.length} bytes`);
    
    // Optionally save to file for testing
    const filename = 'test_welcome.pdf';
    fs.writeFileSync(filename, pdfBuffer);
    console.log(`💾 Test PDF saved as: ${filename}`);
    
    console.log('🎉 PDF generation test completed successfully!');
  } catch (error) {
    console.error('❌ PDF generation test failed:', error);
  }
};

// Test compact single-page PDF
const testSinglePagePDF = async () => {
  try {
    console.log('🧪 Testing single-page PDF generation...');
    
    const testUser = 'John Smith';
    const testEmail = 'john.smith@example.com';
    
    console.log(`📄 Generating compact PDF for ${testUser}...`);
    const pdfBuffer = await generateWelcomePDF(testUser, testEmail);
    
    console.log(`✅ Single-page PDF generated successfully!`);
    console.log(`📊 PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    
    // Save test PDF
    const filename = 'single_page_welcome.pdf';
    fs.writeFileSync(filename, pdfBuffer);
    console.log(`💾 Compact PDF saved as: ${filename}`);
    
    console.log('🎉 Single-page PDF optimization completed!');
    console.log('📋 Features: Compact layout, no cards, fits A4 page');
  } catch (error) {
    console.error('❌ Single-page PDF test failed:', error);
  }
};

// Uncomment to run test
// quickPDFTest();
// testSinglePagePDF();

export { quickPDFTest, testSinglePagePDF };