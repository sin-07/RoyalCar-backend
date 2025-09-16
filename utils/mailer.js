import nodemailer from "nodemailer";
import { generateWelcomeHTML, generateWelcomePDF } from "./pdfGenerator.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
};

export const sendOtpMail = async (to, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `Royal Cars <${process.env.GMAIL_USER}>`,
    to,
    subject: "🔐 Royal Cars - Your OTP Verification Code",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <title>Royal Cars OTP Verification</title>
        <style>
            /* Reset styles */
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; }
            table { border-collapse: collapse; }
            
            /* Base styles */
            .email-wrapper {
                width: 100% !important;
                margin: 0;
                padding: 0;
                background-color: #f6f3ff;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            }
            
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
            }
            
            /* Mobile-first responsive styles */
            @media only screen and (max-width: 640px) {
                .email-container { 
                    width: 100% !important; 
                    max-width: 100% !important; 
                    margin: 0 !important;
                }
                .outer-padding { padding: 10px !important; }
                .container { 
                    width: 100% !important; 
                    border-radius: 12px !important;
                    margin: 0 !important;
                }
                .header-padding { padding: 30px 20px !important; }
                .content-padding { padding: 25px 20px !important; }
                .logo-text { font-size: 26px !important; }
                .subtitle-text { font-size: 12px !important; }
                .main-heading { font-size: 24px !important; }
                .otp-container { padding: 20px 15px !important; margin: 20px 0 !important; }
                .otp-code { 
                    font-size: 32px !important; 
                    letter-spacing: 4px !important;
                    padding: 20px 10px !important;
                }
                .instructions-padding { padding: 15px !important; }
                .security-padding { padding: 12px !important; margin: 15px 0 !important; }
                .footer-padding { padding: 20px !important; }
            }
            
            @media only screen and (max-width: 480px) {
                .logo-text { font-size: 22px !important; }
                .main-heading { font-size: 20px !important; }
                .otp-code { 
                    font-size: 28px !important; 
                    letter-spacing: 3px !important;
                }
            }
        </style>
    </head>
    <body style="margin:0;padding:0;width:100%;background:#f6f3ff;">
        <div class="email-wrapper">
            <div class="outer-padding" style="padding:20px;">
                <div class="email-container">
                    <div class="container" style="background:white;border-radius:20px;box-shadow:0 20px 60px rgba(124,58,237,0.15);overflow:hidden;margin:0 auto;">
                        
                        <!-- Header -->
                        <div class="header-padding" style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 100%);padding:40px 30px;text-align:center;">
                            <div class="logo-text" style="color:white;font-size:32px;font-weight:bold;margin-bottom:8px;">🚗 Royal Cars</div>
                            <div class="subtitle-text" style="color:rgba(255,255,255,0.9);font-size:14px;font-weight:500;letter-spacing:1px;">PREMIUM CAR RENTAL SERVICE</div>
                        </div>

                        <!-- Content -->
                        <div class="content-padding" style="padding:40px 30px;">
                            <div style="text-align:center;margin-bottom:30px;">
                                <div style="width:80px;height:80px;background:linear-gradient(135deg,#f6f3ff,#e0e7ff);border-radius:50%;margin:0 auto 20px;display:inline-flex;align-items:center;justify-content:center;border:3px solid #7c3aed;">
                                    <div style="font-size:32px;">🔐</div>
                                </div>
                                <h1 class="main-heading" style="color:#1a1a1a;font-size:32px;font-weight:700;margin:0 0 10px 0;">Verification Required</h1>
                                <p style="color:#666;font-size:16px;margin:0;line-height:1.5;">Please verify your email address to complete your Royal Cars registration</p>
                            </div>

                            <!-- OTP Section -->
                            <div class="otp-container" style="background:linear-gradient(135deg,#f6f3ff,#faf5ff);border:2px solid #e0e7ff;border-radius:16px;padding:30px;text-align:center;margin:30px 0;">
                                <p style="color:#7c3aed;font-size:16px;font-weight:600;margin:0 0 20px 0;">Your verification code is:</p>
                                <div class="otp-code" style="font-size:48px;font-weight:800;color:#7c3aed;letter-spacing:8px;margin:20px 0;padding:25px;background:white;border-radius:12px;border:2px dashed #7c3aed;font-family:monospace,Courier,monospace;word-break:break-all;overflow-wrap:break-word;">${otp}</div>
                                <div style="background:linear-gradient(90deg,#fbbf24,#f59e0b);color:white;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;display:inline-block;margin-top:15px;">
                                    ⏰ Valid for 10 minutes only
                                </div>
                            </div>

                            <!-- Instructions -->
                            <div class="instructions-padding" style="background:#f8fafc;border-left:4px solid #7c3aed;padding:20px;border-radius:8px;margin:30px 0;">
                                <h3 style="color:#7c3aed;margin:0 0 15px 0;font-size:16px;font-weight:600;">📋 Next Steps:</h3>
                                <ol style="color:#4a5568;margin:0;padding-left:20px;line-height:1.8;">
                                    <li>Return to the Royal Cars registration page</li>
                                    <li>Enter the 6-digit code shown above</li>
                                    <li>Complete your account setup</li>
                                </ol>
                            </div>

                            <!-- Security Notice -->
                            <div class="security-padding" style="border:1px solid #fecaca;background:#fef2f2;border-radius:8px;padding:15px;margin:20px 0;">
                                <div style="display:block;text-align:left;">
                                    <div style="color:#dc2626;margin-bottom:10px;font-size:18px;text-align:center;">⚠️</div>
                                    <div>
                                        <p style="color:#dc2626;font-weight:600;margin:0 0 5px 0;font-size:14px;text-align:center;">Security Notice</p>
                                        <p style="color:#7f1d1d;margin:0;font-size:13px;line-height:1.4;text-align:center;">If you didn't request this verification code, please ignore this email. Never share your OTP with anyone.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="footer-padding" style="background:#f8fafc;padding:30px;text-align:center;border-top:1px solid #e2e8f0;">
                            <div style="color:#7c3aed;font-weight:600;margin-bottom:15px;">Royal Cars Team</div>
                            <div style="color:#64748b;font-size:13px;line-height:1.6;">
                                Premium Car Rental Service<br>
                                📧 support@royalcars.com | 📞 +91 9876543210<br>
                                🌐 www.royalcars.com
                            </div>
                            <div style="margin-top:20px;padding-top:15px;border-top:1px solid #e2e8f0;">
                                <p style="color:#94a3b8;font-size:11px;margin:0;">© 2025 Royal Cars. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (to, userName) => {
  const transporter = createTransporter();

  try {
    // Generate PDF attachment
    console.log(`Generating welcome PDF for ${userName}...`);
    const pdfBuffer = await generateWelcomePDF(userName, to);
    console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);

    const mailOptions = {
      from: `Royal Cars <${process.env.GMAIL_USER}>`,
      to,
      subject: "🎉 Welcome to Royal Cars - Your Journey Begins Here!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f6f3ff;">
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 32px; font-weight: bold; color: #7c3aed; margin-bottom: 10px;">🚗 Royal Cars</div>
              <div style="color: #666; font-size: 14px;">PREMIUM CAR RENTAL SERVICE</div>
            </div>
            
            <h2 style="color: #7c3aed; text-align: center; margin-bottom: 20px;">🎉 Welcome to the Royal Cars Family!</h2>
            
            <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
              We are absolutely thrilled to welcome you to Royal Cars! Your email has been successfully verified, and you're now part of our exclusive community.
            </p>
            
            
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #333; margin-bottom: 20px;">Ready to start your royal journey?</p>
              <div style="background: #7c3aed; color: white; padding: 15px 25px; border-radius: 8px; display: inline-block; font-weight: bold;">
                🚗 Your Premium Car Rental Experience Awaits!
              </div>
            </div>
            
            <div style="border-top: 1px solid #e0e7ff; padding-top: 20px; text-align: center; color: #666; font-size: 13px;">
              <p><strong>Royal Cars Team</strong></p>
              <p>📧 support@royalcars.com | 📞 +91 9876543210</p>
              <p style="margin-top: 15px; font-style: italic;">"Where Every Journey is Royal"</p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Royal_Cars_Welcome_${userName.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email with PDF attachment sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending welcome email with PDF:", error);
    throw error;
  }
};
