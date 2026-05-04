const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./db');
const calculations = require('./services/calculations');
const pdfGenerator = require('./services/pdfGenerator');
const googleDrive = require('./services/googleDrive');
const emailService = require('./services/emailService');
const authRouter = require('./auth');
const multer = require('multer');
const { generateDynamicPlans } = require('./services/aiGenerator');

// Keep images injected in memory immediately for OpenAI
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/reports', express.static(path.join(__dirname, '../reports')));
app.use('/', authRouter);

// Initialize services
googleDrive.authenticate();
emailService.authenticate();

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Fitness Report API is running' });
});

// Client Submission Endpoint
app.post('/api/submit', upload.single('photo'), async (req, res) => {
    try {
        const { name, age, weight, height, gender, goal, activityLevel, injuries, email } = req.body;
        const photo = req.file;

        // 1. Calculations
        const bmi = calculations.calculateBMI(weight, height);
        const bmr = calculations.calculateBMR(weight, height, age, gender);
        const tdee = calculations.calculateTDEE(bmr, activityLevel);
        const { calories, macros } = calculations.calculateMacros(tdee, goal);

        const fullData = {
            ...req.body,
            bmi, bmr, tdee, macros: { calories, macros }
        };

        let aiPlans = { bodyFat: 'N/A', mealPlan: null, trainingPlan: null };
        try {
            console.log('Generating Neural Protocol with OpenAI...');
            aiPlans = await generateDynamicPlans(fullData, photo);
            console.log('AI Protocol Generated!');
        } catch (aiErr) {
            console.error('AI generation failed, falling back to static formats:', aiErr.message);
        }

        fullData.aiPlans = aiPlans;

        // 2. Generate PDF
        const pdfBuffer = await pdfGenerator.generateReport(fullData);

        // 3. Save to Google Drive (with local fallback)
        const driveResult = await googleDrive.uploadReport(name, pdfBuffer);

        // 4. Send Email
        let emailSent = false;
        try {
            if (email) {
                await emailService.sendReport(email, name, pdfBuffer);
                emailSent = true;
            }
        } catch (err) {
            console.error('Failed to send email:', err.message);
        }

        // 5. Save to Database
        const sql = `
      INSERT INTO submissions (name, age, weight, height, gender, goal, activity_level, injuries, email, bmi, bmr, tdee, report_url, ai_plans, macros)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        db.run(sql, [
            name, age, weight, height, gender, goal, activityLevel, injuries, email,
            bmi, bmr, tdee, driveResult.webViewLink || 'local',
            JSON.stringify(aiPlans), JSON.stringify({ calories, macros })
        ], function (err) {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ success: false, error: 'Failed to save submission' });
            }

            res.status(201).json({
                success: true,
                submissionId: this.lastID,
                calculations: { bmi, bmr, tdee, calories, macros },
                reportUrl: driveResult.webViewLink,
                emailSent
            });
        });

    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all submissions (Admin Dashboard)
app.get('/api/submissions', (req, res) => {
    db.all('SELECT * FROM submissions ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(rows);
    });
});

// Client Portal API: Fetch Client Context
app.get('/api/client/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM submissions WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (!row) return res.status(404).json({ success: false, error: 'Client protocol not found' });
        
        let aiPlans = { bodyFat: 'N/A', mealPlan: null, trainingPlan: null };
        if (row.ai_plans) {
            try { aiPlans = JSON.parse(row.ai_plans); } catch(e) {}
        }
        let macros = {};
        if (row.macros) {
            try { macros = JSON.parse(row.macros); } catch(e) {}
        }

        res.json({ success: true, data: { ...row, aiPlans, macros } });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
