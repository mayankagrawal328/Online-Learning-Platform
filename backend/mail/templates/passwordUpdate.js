exports.passwordUpdated = (email, name) => {
    return `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Password Updated Successfully</title>
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          body {
              background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
              font-family: 'Poppins', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
          }
  
          .email-container {
              max-width: 600px;
              margin: 30px auto;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 
                  0 10px 30px rgba(0, 0, 0, 0.1),
                  0 0 0 1px rgba(255, 255, 255, 0.3) inset;
              transform-style: preserve-3d;
              perspective: 1000px;
          }
  
          .email-card {
              background: white;
              padding: 0;
              position: relative;
              transform: translateZ(20px);
              transition: transform 0.3s ease;
          }
  
          .email-card:before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 8px;
              background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
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
  
          .security-icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 25px;
              box-shadow: 0 8px 20px rgba(17, 153, 142, 0.3);
          }
  
          .security-icon i {
              color: white;
              font-size: 36px;
          }
  
          h1 {
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 10px;
              color: #2c3e50;
          }
  
          .content {
              padding: 30px 40px;
          }
  
          p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
          }
  
          .highlight {
              background: linear-gradient(120deg, #11998e 0%, #38ef7d 100%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              font-weight: 600;
          }
  
          .security-alert {
              background: #fff8f8;
              border-radius: 12px;
              padding: 20px;
              margin: 25px 0;
              border-left: 4px solid #ff4b4b;
              box-shadow: 0 4px 12px rgba(255, 75, 75, 0.1);
          }
  
          .alert-title {
              font-weight: 600;
              font-size: 18px;
              margin-bottom: 10px;
              color: #ff4b4b;
          }
  
          .account-details {
              background: #f8f9fa;
              border-radius: 12px;
              padding: 20px;
              margin: 25px 0;
              border-left: 4px solid #11998e;
          }
  
          .detail-title {
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 10px;
              color: #2c3e50;
          }
  
          .detail-value {
              font-family: 'Courier New', monospace;
              background: rgba(0, 0, 0, 0.05);
              padding: 8px 12px;
              border-radius: 6px;
              display: inline-block;
              margin: 5px 0;
          }
  
          .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
              margin: 30px 0;
          }
  
          .footer {
              padding: 20px 40px;
              background: #f8f9fa;
              text-align: center;
              font-size: 14px;
              color: #7f8c8d;
              border-top: 1px solid rgba(0, 0, 0, 0.05);
          }
  
          .support-link {
              color: #3498db;
              text-decoration: none;
              font-weight: 500;
          }
  
          .timestamp {
              font-size: 14px;
              color: #95a5a6;
              text-align: center;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-card">
              <div class="header">
                  <div class="security-icon">
                      <i>🔒</i>
                  </div>
                  <h1>Password <span class="highlight">Updated</span></h1>
              </div>
              
              <div class="content">
                  <p>Dear ${name},</p>
                  
                  <div class="account-details">
                      <div class="detail-title">Your account credentials were updated:</div>
                      <div class="detail-value">${email}</div>
                  </div>
                  
                  <p>Your StudyNotion account password was successfully changed. You can now log in with your new password.</p>
                  
                  <div class="security-alert">
                      <div class="alert-title">Security Notice</div>
                      <p>If you didn't make this change, please <strong>contact us immediately</strong> at <a href="mailto:temp.everyplace040703@gmail.com" class="support-link">temp.everyplace040703@gmail.com</a> as your account may be compromised.</p>
                  </div>
                  
                  <div class="divider"></div>
                  
                  <p>For your security, we recommend:</p>
                  <ul style="text-align: left; padding-left: 20px;">
                      <li>Using a unique password you don't use elsewhere</li>
                      <li>Enabling two-factor authentication</li>
                      <li>Regularly updating your password</li>
                  </ul>
                  
                  <div class="timestamp">
                      This action was completed on ${new Date().toLocaleString()}
                  </div>
              </div>
              
              <div class="footer">
                  <p>Stay secure!<br>The StudyNotion Security Team</p>
                  <p>Need help? Contact us at <a href="mailto:temp.everyplace040703@gmail.com" class="support-link">temp.everyplace040703@gmail.com</a></p>
              </div>
          </div>
      </div>
  </body>
  </html>`;
  };