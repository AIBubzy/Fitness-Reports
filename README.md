# PT Fitness Report Automation System

A professional, futuristic web-based system for personal trainers to automate client assessments and report generation.

## Features
- **Futuristic UI**: Modern social media-inspired design with vibrant gradients and glassmorphism.
- **Metabolic Analysis**: Automated BMI, BMR, and TDEE calculations.
- **PDF Generation**: Comprehensive reports with nutrition targets and training advice.
- **Cloud Storage**: Automatic upload to Google Drive.
- **Email Delivery**: Instant report delivery to clients.
- **Admin Dashboard**: Feed-style view of all client submissions.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Better-SQLite3.
- **Services**: jsPDF, Nodemailer, Google Drive API.

## Setup Instructions

### 1. Backend Configuration
1. Navigate to the `server` directory.
2. Copy `.env.example` to `.env`.
3. Fill in your Google Drive and Email credentials.
4. Run `npm install` (if not already done).

### 2. Frontend Configuration
1. Navigate to the `client` directory.
2. Run `npm install` (if not already done).

### 3. Running the Application
1. Start the backend: `npm run dev` in the `server` directory.
2. Start the frontend: `npm run dev` in the `client` directory.
3. Open `http://localhost:5173` in your browser.

## Credentials Setup
- **Google Drive**: You'll need to create a project in the [Google Cloud Console](https://console.cloud.google.com/), enable the Drive API, and set up OAuth2 credentials.
- **Email**: For testing, you can use [Ethereal Email](https://ethereal.email/) credentials. For production, use a service like SendGrid or Gmail SMTP.
