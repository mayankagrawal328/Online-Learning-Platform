exports.courseComplication = (course, name) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Certificate of Achievement</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Playfair Display', serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .certificate-container {
            position: relative;
            width: 850px;
            height: 650px;
        }

        .certificate {
            width: 100%;
            height: 100%;
            padding: 60px;
            border: 25px solid transparent;
            background: linear-gradient(#fffaf0, #fffaf0) padding-box,
                        linear-gradient(135deg, #8b4513 0%, #5d2e0c 100%) border-box;
            text-align: center;
            position: relative;
            box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.3);
        }

        .certificate::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 1px dashed #8b4513;
            pointer-events: none;
            opacity: 0.3;
        }

        .certificate::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="10" y="50" font-family="Playfair Display" font-size="10" fill="%238b4513" opacity="0.05">CERTIFICATE</text></svg>');
            opacity: 0.1;
            pointer-events: none;
        }

        h1 {
            font-size: 48px;
            color: #8b4513;
            margin-bottom: 30px;
            letter-spacing: 5px;
            font-weight: 700;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
        }

        h2 {
            font-size: 42px;
            color: #333;
            margin: 30px 0;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .divider {
            width: 60%;
            height: 2px;
            background: linear-gradient(to right, transparent, #8b4513, transparent);
            margin: 30px auto;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .description {
            font-style: italic;
            color: #555;
            line-height: 1.8;
            margin: 40px 80px;
            font-size: 18px;
            text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
        }

        .signatures {
            display: flex;
            justify-content: space-around;
            margin-top: 60px;
        }

        .signature {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .signature-name {
            font-weight: bold;
            margin-top: 10px;
            color: #333;
            font-size: 18px;
        }

        .signature-line {
            width: 180px;
            height: 2px;
            background: linear-gradient(to right, transparent, #000, transparent);
            margin-top: 20px;
        }

        .seal {
            position: absolute;
            top: 30px;
            right: 30px;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, #8b4513 0%, #5d2e0c 100%);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: gold;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            transform: rotate(15deg);
        }

        .corner {
            position: absolute;
            width: 80px;
            height: 80px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M100,0 L0,0 L0,100 C20,80 40,100 60,80 C80,60 100,80 100,100 Z" fill="%238b4513" opacity="0.2"/></svg>');
            background-size: cover;
        }

        .corner-tl { top: 0; left: 0; transform: rotate(0deg); }
        .corner-tr { top: 0; right: 0; transform: rotate(90deg); }
        .corner-bl { bottom: 0; left: 0; transform: rotate(270deg); }
        .corner-br { bottom: 0; right: 0; transform: rotate(180deg); }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="certificate">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
            
            <div class="seal">OFFICIAL<br>SEAL</div>
            
            <h1>CERTIFICATE<br>of Achievement</h1>
            
            <p style="font-size: 20px; color: #666;">This Certificate is Proudly Presented To</p>
            
            <div class="divider"></div>
            
            <h2>${name}</h2>
            
            <p class="description">
                For successfully completing the ${course} course with outstanding achievement and exceptional performance. 
                This recognition is awarded for demonstrating excellence, dedication, and commitment to learning.
            </p>
            
            <div class="divider"></div>
            
            <div class="signatures">
                <div class="signature">
                    <div class="signature-line"></div>
                    <p class="signature-name">Samira Hadid</p>
                    <p style="color: #777; margin-top: 5px;">Director</p>
                </div>
                <div class="signature">
                    <div class="signature-line"></div>
                    <p class="signature-name">Benjamin Shah</p>
                    <p style="color: #777; margin-top: 5px;">Principal</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}