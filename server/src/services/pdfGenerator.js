const { jsPDF } = require('jspdf');
require('jspdf-autotable');

const getBMIAssessment = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Healthy Weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
};

const getMealPlan = (goal) => {
    if (goal === 'muscle_gain' || goal === 'performance') {
        return [
            ['1', '3 Whole Eggs + 2 Whites\n+ 2 Slices Toast', 'Greek Yogurt (200g)\n+ 1 Banana', 'Chicken Breast (200g)\n+ Rice (200g cooked)', 'Protein Shake (2 scoops)\n+ 50g Oats', 'Steak (200g) + Sweet\nPotato (250g)'],
            ['2', 'Oatmeal (100g) + Whey\n+ Handful Berries', 'Apple + Peanut Butter\n(2 tbsp)', 'Turkey Wrap (150g core meat)\n+ Cheese + Veggies', 'Cottage Cheese (200g)\n+ Pineapple', 'Salmon (200g) + Quinoa\n(150g) + Asparagus'],
            ['3', 'Pancakes (Protein blend)\n+ Syrup + 2 slices Bacon', 'Handful of Mixed Nuts\n(50g)', 'Leftover Pasta/Rice Bowl\nwith Chicken (200g)', 'Protein Smoothie\n(Milk, Banana, Whey)', 'Spaghetti Bolognese\n(200g Lean Beef)'],
            ['4', '3 Whole Eggs + 2 Whites\n+ 2 Slices Toast', 'Greek Yogurt (200g)\n+ 1 Banana', 'Chicken Breast (200g)\n+ Rice (200g cooked)', 'Protein Shake (2 scoops)\n+ 50g Oats', 'Steak (200g) + Sweet\nPotato (250g)'],
            ['5', 'Oatmeal (100g) + Whey\n+ Handful Berries', 'Apple + Peanut Butter\n(2 tbsp)', 'Turkey Wrap (150g meat)\n+ Cheese + Veggies', 'Cottage Cheese (200g)\n+ Pineapple', 'Salmon (200g) + Quinoa\n(150g) + Asparagus'],
            ['6', 'Pancakes (Protein blend)\n+ Syrup + 2 slices Bacon', 'Handful of Mixed Nuts\n(50g)', 'Leftover Pasta/Rice Bowl\nwith Chicken (200g)', 'Protein Smoothie\n(Milk, Banana, Whey)', 'Spaghetti Bolognese\n(200g Lean Beef)'],
            ['7', 'French Toast (3 slices)\n+ Fruit (100g)', 'Leftover Pasta or Rice\nBowl', 'Roast Chicken (250g)\n+ Potatoes (200g)', 'Smoothie + Snacks\n(250 kcal total)', 'Beef Stir-fry (200g)\n+ Brown Rice (150g)']
        ];
    }
    // Default Weight Loss / General
    return [
        ['1', '2 Scrambled Eggs\n+ 1 Slice Toast (Thin)', '1 Small Apple\n+ 10 Almonds', 'Grilled Chicken (150g)\n+ Large Mixed Salad', 'Protein Shake\n(1 scoop, water)', 'White Fish (150g) +\nSteamed Broccoli (200g)'],
        ['2', 'Oatmeal (40g)\n+ Handful Berries', 'Carrot Sticks\n+ 2 tbsp Hummus', 'Turkey Slices (100g)\n+ Avocado Wrap', 'Greek Yogurt (150g)\nPlain', 'Lean Beef (120g) +\nCauliflower Rice'],
        ['3', 'Protein Smoothie\n(Spinach, Half Banana)', '1 Hard-boiled Egg', 'Quinoa Salad (100g)\n+ Mixed Veggies', 'Cottage Cheese (100g)', 'Baked Salmon (120g)\n+ Asparagus'],
        ['4', '2 Scrambled Eggs\n+ 1 Slice Toast (Thin)', '1 Small Apple\n+ 10 Almonds', 'Grilled Chicken (150g)\n+ Large Mixed Salad', 'Protein Shake\n(1 scoop, water)', 'White Fish (150g) +\nSteamed Broccoli (200g)'],
        ['5', 'Oatmeal (40g)\n+ Handful Berries', 'Carrot Sticks\n+ 2 tbsp Hummus', 'Turkey Slices (100g)\n+ Avocado Wrap', 'Greek Yogurt (150g)\nPlain', 'Lean Beef (120g) +\nCauliflower Rice'],
        ['6', 'Protein Smoothie\n(Spinach, Half Banana)', '1 Hard-boiled Egg', 'Quinoa Salad (100g)\n+ Mixed Veggies', 'Cottage Cheese (100g)', 'Baked Salmon (120g)\n+ Asparagus'],
        ['7', 'Spinach Omelette\n(1 Whole, 2 Whites)', '1 Small Orange', 'Big Salad bowl\n+ Tuna (1 can in spring water)', 'Handful of Walnuts\n(15g)', 'Roast Chicken Breast\n(150g) + Zucchini Noodles']
    ];
};

const getTrainingPlan = (goal) => {
    if (goal === 'muscle_gain' || goal === 'performance') {
        return [
            { day: 'Day 1 \u2013 Chest & Triceps', exercises: [['Bench Press (Compound)', '4', '6-8', '90s'], ['Incline Dumbbell Press (Compound)', '4', '8-10', '75s'], ['Tricep Pushdowns (Isolation)', '3', '12-15', '60s']] },
            { day: 'Day 2 \u2013 Back & Biceps', exercises: [['Deadlift (Compound)', '4', '5-6', '120s'], ['Lat Pulldown (Compound)', '4', '8-10', '75s'], ['Dumbbell Curls (Isolation)', '3', '12-15', '60s']] },
            { day: 'Day 3 \u2013 Legs', exercises: [['Squats (Compound)', '4', '6-8', '120s'], ['Romanian Deadlift (Compound)', '4', '8-10', '90s'], ['Leg Extensions (Isolation)', '3', '12-15', '60s']] },
            { day: 'Day 4 \u2013 Active Recovery & Core', exercises: [['Plank', '3', '60s', '45s'], ['Russian Twists', '3', '20 reps', '45s'], ['Light Jogging or Walking', '1', '30 mins', 'N/A']] },
            { day: 'Day 5 \u2013 Shoulders & Arms', exercises: [['Overhead Press (Compound)', '4', '6-8', '90s'], ['Lateral Raises (Isolation)', '3', '12-15', '60s'], ['Hammer Curls (Isolation)', '3', '10-12', '60s']] },
            { day: 'Day 6 \u2013 Full Body Power', exercises: [['Power Cleans', '4', '5', '120s'], ['Pull-Ups', '3', 'AMRAP', '90s'], ['Dumbbell Lunges', '3', '10/leg', '60s']] },
            { day: 'Day 7 \u2013 Complete Rest', exercises: [['Rest & Mobility Work', '-', '-', '-']] }
        ];
    }
    // Default Weight Loss / General
    return [
        { day: 'Day 1 \u2013 Full Body Circuit', exercises: [['Goblet Squats', '3', '15', '45s'], ['Push-ups', '3', '12-15', '45s'], ['Dumbbell Rows', '3', '15', '45s']] },
        { day: 'Day 2 \u2013 Cardio & Core', exercises: [['HIIT Treadmill Sprints', '1', '20 mins', 'N/A'], ['Plank', '3', '45s', '30s'], ['Bicycle Crunches', '3', '20', '30s']] },
        { day: 'Day 3 \u2013 Lower Body Focus', exercises: [['Lunges', '3', '12/leg', '60s'], ['Glute Bridges', '3', '15', '45s'], ['Leg Press', '3', '12-15', '60s']] },
        { day: 'Day 4 \u2013 Active Recovery', exercises: [['Yoga or Pilates', '1', '40 mins', 'N/A'], ['Brisk Walk', '1', '30 mins', 'N/A']] },
        { day: 'Day 5 \u2013 Upper Body Focus', exercises: [['Dumbbell Bench Press', '3', '12-15', '60s'], ['Lat Pulldowns', '3', '12-15', '60s'], ['Shoulder Press', '3', '12-15', '45s']] },
        { day: 'Day 6 \u2013 High Intensity Cardio', exercises: [['Rowing Machine or Cycling', '1', '30 mins', 'N/A'], ['Burpees', '3', '10', '45s']] },
        { day: 'Day 7 \u2013 Complete Rest', exercises: [['Rest & Hydration', '-', '-', '-']] }
    ];
};

/**
 * Generate PDF fitness report
 */
const generateReport = async (data) => {
    const doc = new jsPDF();
    const { name, age, weight, height, gender, goal, activityLevel, bmi, bmr, tdee, macros } = data;
    
    const writeText = (text, y, fontSize = 10, fontStyle = 'normal', x = 20) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, x, y);
        return y + (lines.length * (fontSize * 0.45)); // Tighter line height
    };

    let cursorY = 20;

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text((name || 'CLIENT').toUpperCase(), 20, cursorY);
    cursorY += 10;

    // Intro paragraph
    const goalText = (goal || '').replace('_', ' ');
    const actText = (activityLevel || 'moderate');
    const introStr = `${name || 'The client'}, who is ${age} years old, ${height} cm tall, weighs ${weight} kg, has a ${actText} activity level, and aims to focus on ${goalText}, a balanced approach that combines a calorie-controlled diet with a mix of strength training and cardiovascular exercises will be most effective. Here's a comprehensive 7-day meal and training plan tailored to these goals.`;
    
    cursorY = writeText(introStr, cursorY, 10, 'normal');
    cursorY += 5;

    // BMR, BMI headers
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('BMR, BMI, and Macro Split', 20, cursorY);
    cursorY += 6;

    // Bullets
    doc.setFont('helvetica', 'bold');
    doc.text('• BMR (Basal Metabolic Rate):', 25, cursorY);
    let bmrStr = `BMR is approximately ${bmr} kcal/day. This is the estimated number of calories needed per day to maintain your current weight at rest.`;
    cursorY = writeText(bmrStr, cursorY + 5, 10, 'normal', 30);
    
    cursorY += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('• BMI (Body Mass Index):', 25, cursorY);
    let bmiAssessment = getBMIAssessment(bmi);
    let bmiStr = `BMI is approximately ${bmi}, categorizing you in the ${bmiAssessment.toLowerCase()} range according to standard BMI classifications.`;
    cursorY = writeText(bmiStr, cursorY + 5, 10, 'normal', 30);
    
    cursorY += 6;
    
    doc.setFont('helvetica', 'bold');
    const displayGoalText = goalText.replace(/\b\w/g, l => l.toUpperCase());
    doc.text(`Macro Split for ${displayGoalText}`, 20, cursorY);
    cursorY += 5;
    
    let macroIntro = `To support your goal of ${goalText}, your diet should balance caloric intake with sufficient protein. An ideal macro split for your target of ${macros.calories} kcal/day is:`;
    cursorY = writeText(macroIntro, cursorY, 10, 'normal');
    cursorY += 1;

    const pRatio = Math.round(((macros.macros.protein * 4) / macros.calories)*100);
    const cRatio = Math.round(((macros.macros.carbs * 4) / macros.calories)*100);
    const fRatio = Math.round(((macros.macros.fats * 9) / macros.calories)*100);

    doc.setFont('helvetica', 'bold');
    doc.text(`• Protein: ${pRatio}%`, 25, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.text(`- High protein intake (${macros.macros.protein}g) is essential for muscle repair.`, 55, cursorY);
    cursorY += 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`• Carbohydrates: ${cRatio}%`, 25, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.text(`- Carbs (${macros.macros.carbs}g) will provide energy for your workouts.`, 65, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'bold');
    doc.text(`• Fats: ${fRatio}%`, 25, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.text(`- Healthy fats (${macros.macros.fats}g) are necessary for hormone regulation.`, 50, cursorY);
    cursorY += 10;

    // MEAL PLAN
    doc.setFont('helvetica', 'bold');
    doc.text(`7-Day Meal Plan for ${name || 'Client'}`, 20, cursorY);
    cursorY += 5;
    
    let mealIntro = `The meal plan focuses on nutrient-dense foods emphasizing proteins, complex carbohydrates, and healthy fats. Serving sizes are explicitly tailored to your caloric targets.`;
    cursorY = writeText(mealIntro, cursorY, 10, 'normal');
    
    const mealPlanData = getMealPlan(goal);

    doc.autoTable({
        startY: cursorY + 2,
        head: [['Day', 'Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner']],
        body: mealPlanData,
        theme: 'grid',
        styles: { fontSize: 8.5, cellPadding: 2, textColor: [50,50,50], font: 'helvetica', valign: 'middle' },
        headStyles: { fillColor: [255, 255, 255], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [200, 200, 200] },
        bodyStyles: { lineWidth: 0.1, lineColor: [200, 200, 200] }
    });
    
    cursorY = doc.lastAutoTable.finalY + 3;

    // Render Meal Plan Notes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Notes:', 20, cursorY);
    cursorY += 4;
    doc.setFont('helvetica', 'normal');
    cursorY = writeText('• Meals are designed to be quick (under 20 mins prep where possible)', cursorY + 1, 9, 'normal', 23);
    cursorY = writeText('• Add sauces, oils, and cheese moderately to hit calorie goals without exceeding', cursorY, 9, 'normal', 23);
    cursorY = writeText('• Smoothies are your best friend for easy calorie & protein intake', cursorY, 9, 'normal', 23);
    
    cursorY += 6;
    
    if (cursorY > 210) {
        doc.addPage();
        cursorY = 20;
    }

    // TRAINING PLAN
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`7-Day Training Plan (${displayGoalText} Focus)`, 20, cursorY);
    cursorY += 6;
    
    const trainingPlanData = getTrainingPlan(goal);

    // Render individual daily tables for the exact structured look
    for (const d of trainingPlanData) {
        if (cursorY > 260) {
            doc.addPage();
            cursorY = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(d.day, 20, cursorY);
        
        doc.autoTable({
            startY: cursorY + 2,
            head: [['Exercise', 'Sets', 'Reps', 'Rest']],
            body: d.exercises,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 2, textColor: [50,50,50], font: 'helvetica', valign: 'middle' },
            headStyles: { fillColor: [255, 255, 255], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.1, lineColor: [200, 200, 200] },
            bodyStyles: { lineWidth: 0.1, lineColor: [200, 200, 200] },
            margin: { bottom: 10 }
        });
        
        cursorY = doc.lastAutoTable.finalY + 8;
    }

    return Buffer.from(doc.output('arraybuffer'));
};

module.exports = { generateReport };
