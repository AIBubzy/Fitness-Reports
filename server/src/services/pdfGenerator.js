const { jsPDF } = require('jspdf');
require('jspdf-autotable');

/**
 * Generate PDF fitness report
 * @param {Object} data - Client data and calculations
 * @returns {Buffer} PDF buffer
 */
const generateReport = async (data) => {
    const doc = new jsPDF();
    const { name, age, weight, height, gender, goal, activity_level, bmi, bmr, tdee, macros } = data;

    // Header
    doc.setFillColor(15, 12, 41); // Dark blue background
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('PT FLOW PRO - FITNESS REPORT', 105, 25, { align: 'center' });

    // Client Info Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Client Profile', 20, 50);
    doc.setLineWidth(0.5);
    doc.line(20, 52, 190, 52);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const profileInfo = [
        [`Name: ${name}`, `Age: ${age}`],
        [`Weight: ${weight} kg`, `Height: ${height} cm`],
        [`Gender: ${gender}`, `Goal: ${goal.replace('_', ' ').toUpperCase()}`]
    ];

    doc.autoTable({
        startY: 55,
        head: [],
        body: profileInfo,
        theme: 'plain',
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 85 }, 1: { cellWidth: 85 } }
    });

    // Calculations Section
    const calcY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.text('Metabolic Analysis', 20, calcY);
    doc.line(20, calcY + 2, 190, calcY + 2);

    const stats = [
        ['Metric', 'Value', 'Assessment'],
        ['BMI', `${bmi}`, getBMIAssessment(bmi)],
        ['BMR', `${bmr} kcal`, 'Basal energy needs at rest'],
        ['TDEE', `${tdee} kcal`, 'Total daily energy expenditure'],
        ['Target Calories', `${macros.calories} kcal`, `Specific to ${goal.replace('_', ' ')} goals`]
    ];

    doc.autoTable({
        startY: calcY + 5,
        head: [stats[0]],
        body: stats.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [60, 43, 99], textColor: [255, 255, 255] }
    });

    // Nutrition Section
    const nutritionY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.text('Nutrition Targets', 20, nutritionY);
    doc.line(20, nutritionY + 2, 190, nutritionY + 2);

    const macroData = [
        ['Macro', 'Daily Amount', 'Calorie Breakdown'],
        ['Protein', `${macros.macros.protein}g`, `${macros.macros.protein * 4} kcal`],
        ['Carbohydrates', `${macros.macros.carbs}g`, `${macros.macros.carbs * 4} kcal`],
        ['Fats', `${macros.macros.fats}g`, `${macros.macros.fats * 9} kcal`]
    ];

    doc.autoTable({
        startY: nutritionY + 5,
        head: [macroData[0]],
        body: macroData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [0, 242, 255], textColor: [0, 0, 0] }
    });

    // Training Advice
    const adviceY = doc.lastAutoTable.finalY + 15;
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Personalized Training Recommendations', 20, 20);
    doc.line(20, 22, 190, 22);

    const recommendations = getRecommendations(goal, bmi);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let textY = 30;
    recommendations.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, 170);
        doc.text(lines, 20, textY);
        textY += (lines.length * 7);
    });

    // Footer on each page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount} | PT FLOW PRO - Confidential Client Report`, 105, 285, { align: 'center' });
    }

    return Buffer.from(doc.output('arraybuffer'));
};

const getBMIAssessment = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Healthy Weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
};

const getRecommendations = (goal, bmi) => {
    const common = [
        "Prioritize hydration: Aim for 3-4 liters of water daily.",
        "Quality sleep: 7-9 hours of restorative sleep for hormone balance.",
        "Consistency over perfection: Stick to the plan 80% of the time."
    ];

    const goalSpecific = {
        'weight_loss': [
            "Focus on a calorie deficit and high protein intake to preserve lean mass.",
            "Incorporate 3-4 sessions of low-intensity steady state (LISS) cardio weekly.",
            "Resistance training 3 times a week to stimulate metabolic rate."
        ],
        'muscle_gain': [
            "Slight calorie surplus is necessary for muscle synthesis.",
            "Prioritize compound movements (squats, deadlifts, presses).",
            "Progressive overload: Aim to increase weight or reps every 2 weeks."
        ],
        'performance': [
            "Periodization: Focus on skill refinement and power output.",
            "Timing: Consume 30-50g carbs 1-2 hours before intense sessions.",
            "Strategic recovery: Active recovery days and mobility work."
        ],
        'general': [
            "Balanced diet with whole foods focus.",
            "150 minutes of moderate activity per week.",
            "Variety: Mix resistance, aerobic, and flexibility training."
        ]
    };

    return [...(goalSpecific[goal] || goalSpecific['general']), ...common];
};

module.exports = { generateReport };
