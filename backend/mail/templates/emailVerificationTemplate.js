const otpTemplate = (otp, name) => {
    return `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Your Secure Verification Code | StudyNotion</title>
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          :root {
              --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              --secondary-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          
          body {
              background: var(--secondary-gradient);
              font-family: 'Poppins', sans-serif;
              line-height: 1.6;
              color: #4a4a4a;
              margin: 0;
              padding: 0;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
          }
  
          .email-card {
              max-width: 600px;
              margin: 30px;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 
                  0 10px 30px rgba(0, 0, 0, 0.15),
                  0 0 0 1px rgba(255, 255, 255, 0.3) inset;
              transform-style: preserve-3d;
              perspective: 1000px;
              position: relative;
          }
  
          .email-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 8px;
              background: var(--primary-gradient);
          }
  
          .header {
              padding: 40px 40px 20px;
              text-align: center;
              background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
              border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          }
  
          .logo {
              height: 60px;
              margin-bottom: 20px;
              filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          }
  
          .verification-icon {
              width: 80px;
              height: 80px;
              background: var(--primary-gradient);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 25px;
              box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
              animation: pulse 2s infinite;
          }
  
          @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
          }
  
          h1 {
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 10px;
              color: #2c3e50;
              text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.05);
          }
  
          .content {
              padding: 30px 40px;
          }
  
          p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
              color: #4a5568;
          }
  
          .otp-container {
              margin: 40px 0;
              text-align: center;
              perspective: 1000px;
          }
  
          .otp-code {
              display: inline-block;
              padding: 18px 35px;
              font-size: 32px;
              font-weight: 700;
              color: #2c3e50;
              background: #f0f4f8;
              border-radius: 12px;
              letter-spacing: 8px;
              box-shadow: 
                  0 5px 15px rgba(0, 0, 0, 0.1),
                  0 0 0 1px rgba(0, 0, 0, 0.05) inset;
              transform: rotateX(10deg);
              transition: all 0.3s ease;
              font-family: 'Courier New', monospace;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border: 1px dashed rgba(102, 126, 234, 0.3);
          }
  
          .otp-code:hover {
              transform: rotateX(10deg) scale(1.03);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
  
          .security-note {
              font-size: 14px;
              color: #718096;
              background: #f8fafc;
              padding: 20px;
              border-radius: 12px;
              border-left: 4px solid #667eea;
              margin: 30px 0;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          }
  
          .security-title {
              font-weight: 600;
              color: #2c3e50;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 8px;
          }
  
          .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
              margin: 30px 0;
          }
  
          .footer {
              padding: 20px 40px;
              text-align: center;
              font-size: 14px;
              color: #7f8c8d;
              background: #f8f9fa;
              border-top: 1px solid rgba(0, 0, 0, 0.05);
          }
  
          .support-link {
              color: #667eea;
              text-decoration: none;
              font-weight: 500;
          }
  
          .timestamp {
              font-size: 13px;
              color: #95a5a6;
              text-align: center;
              margin-top: 20px;
          }
  
          .greeting {
              font-size: 18px;
              color: #4a5568;
              margin-bottom: 25px;
          }
  
          .validity {
              display: inline-block;
              margin-top: 15px;
              padding: 8px 15px;
              background: rgba(102, 126, 234, 0.1);
              color: #667eea;
              border-radius: 50px;
              font-size: 14px;
              font-weight: 500;
          }
      </style>
  </head>
  <body>
      <div class="email-card">
          <div class="header">
              <div class="verification-icon">
                  <span style="font-size: 36px;">✉️</span>
              </div>
              <h1>Secure Verification Code</h1>
              <p>For your account security</p>
          </div>
          
          <div class="content">
              <p class="greeting">Hello ${name},</p>
              <p>We've received a request to verify your email address. Please use the following One-Time Password (OTP) to complete your verification:</p>
              
              <div class="otp-container">
                  <div class="otp-code">${otp}</div>
                  <div class="validity">Valid for 3 minutes</div>
              </div>
              
              <div class="security-note">
                  <div class="security-title">
                      <span>🔒 Security Notice</span>
                  </div>
                  <p>For your protection:</p>
                  <ul style="margin: 10px 0 0 20px; padding-left: 5px;">
                      <li>Never share this code with anyone</li>
                      <li>StudyNotion will never ask for your OTP</li>
                      <li>This code expires after use</li>
                  </ul>
              </div>
              
              <div class="divider"></div>
              
              <p>If you didn't request this verification, please secure your account by changing your password immediately and contact our support team.</p>
              
              <div class="timestamp">
                  Request received: ${new Date().toLocaleString()}
              </div>
          </div>
          
          <div class="footer">
              <p>Need help? Contact us at <a href="mailto:temp.everyplace040703@gmail.com" class="support-link">temp.everyplace040703@gmail.com</a></p>
              <p>© ${new Date().getFullYear()} StudyNotion. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>`;
  };
  
  module.exports = otpTemplate;