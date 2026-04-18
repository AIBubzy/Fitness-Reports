const nodemailer = require('nodemailer');

/**
 * Email Service
 */
class EmailService {
    constructor() {
        this.transporter = null;
    }

    async authenticate() {
        // For production, use SendGrid or a real SMTP server
        // For development, we can use Ethereal or a placeholder
        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
                port: process.env.EMAIL_PORT || 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            console.log('Email service initialized');
        } catch (error) {
            console.error('Email service initialization failed:', error.message);
        }
    }

    async sendReport(clientEmail, clientName, pdfBuffer) {
        if (!this.transporter) {
            await this.authenticate();
        }

        const mailOptions = {
            from: `"PT Flow Pro" <${process.env.EMAIL_USER || 'no-reply@ptflow.pro'}>`,
            to: clientEmail,
            subject: `Your Personalized Fitness Report - ${clientName}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); padding: 30px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 24px;">PT FLOW PRO</h1>
            <p style="margin: 10px 0 0; opacity: 0.8;">Your Journey to Peak Performance Starts Here</p>
          </div>
          <div style="padding: 30px;">
            <h2>Hello ${clientName},</h2>
            <p>Congratulations on taking the first step towards your fitness goals! Our system has generated a comprehensive report based on your assessment.</p>
            <p>Your report includes:</p>
            <ul>
              <li>Detailed Metabolic Analysis (BMI, BMR, TDEE)</li>
              <li>Customized Nutrition Targets</li>
              <li>Personalized Training Recommendations</li>
            </ul>
            <p>Please find your report attached to this email.</p>
            <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-left: 4px solid #bc13fe;">
              <p style="margin: 0; font-weight: bold;">Next Steps:</p>
              <p style="margin: 5px 0 0;">Review your plan and reach out to your trainer if you have any questions. Let's get to work!</p>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
            &copy; 2026 PT Flow Pro Automation System. All rights reserved.
          </div>
        </div>
      `,
            attachments: [
                {
                    filename: `${clientName}_Fitness_Report.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error.message);
            throw error;
        }
    }
}

module.exports = new EmailService();
