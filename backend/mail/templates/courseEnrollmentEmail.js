exports.courseEnrollmentEmail = (courseName, name) => {
    return `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Welcome to ${courseName}!</title>
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
              background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
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
  
          .course-icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 25px;
              box-shadow: 0 8px 20px rgba(106, 17, 203, 0.3);
          }
  
          .course-icon i {
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
              background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              font-weight: 600;
          }
  
          .cta-container {
              margin: 30px 0;
              text-align: center;
          }
  
          .cta-button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
              color: white;
              text-decoration: none;
              border-radius: 50px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 
                  0 4px 15px rgba(106, 17, 203, 0.4),
                  0 2px 0 rgba(255, 255, 255, 0.2) inset;
              transition: all 0.3s ease;
              transform: translateY(0);
          }
  
          .cta-button:hover {
              transform: translateY(-3px);
              box-shadow: 
                  0 7px 20px rgba(106, 17, 203, 0.5),
                  0 2px 0 rgba(255, 255, 255, 0.2) inset;
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
  
          .course-details {
              background: #f8f9fa;
              border-radius: 12px;
              padding: 20px;
              margin: 25px 0;
              border-left: 4px solid #6a11cb;
          }
  
          .course-title {
              font-weight: 600;
              font-size: 18px;
              margin-bottom: 10px;
              color: #2c3e50;
          }
  
          .welcome-message {
              font-size: 18px;
              margin-bottom: 30px;
              color: #2c3e50;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-card">
              <div class="header">
                  <div class="course-icon">
                      <i>🎓</i>
                  </div>
                  <h1>Welcome to <span class="highlight">${courseName}</span>!</h1>
              </div>
              
              <div class="content">
                  <p class="welcome-message">Dear ${name},</p>
                  
                  <div class="course-details">
                      <div class="course-title">You're officially enrolled in:</div>
                      <strong>${courseName}</strong>
                  </div>
                  
                  <p>We're thrilled to have you join this learning journey! Your dedication to expanding your knowledge is inspiring, and we're here to support you every step of the way.</p>
                  
                  <p>Get ready to dive into exciting content, engage with fellow learners, and acquire valuable skills that will help you achieve your goals.</p>
                  
                  <div class="divider"></div>
                  
                  <div class="cta-container">
                      <a href="http://localhost:5173/dashboard/enrolled-courses" class="cta-button">Access Your Course Now</a>
                  </div>
                  
                  <p>If you have any questions or need assistance, our support team is always ready to help you make the most of your learning experience.</p>
              </div>
              
              <div class="footer">
                  <p>Happy Learning!<br>The StudyNotion Team</p>
                  <p>Need help? Contact us at <a href="temp.everyplace040703@gmail.com" class="support-link">temp.everyplace040703@gmail.com</a></p>
              </div>
          </div>
      </div>
  </body>
  </html>`;
  };