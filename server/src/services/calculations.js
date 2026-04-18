/**
 * Metabolic Calculations Service
 */

/**
 * Calculate BMI
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI rounded to 1 decimal place
 */
const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR in calories
 */
const calculateBMR = (weight, height, age, gender) => {
    if (gender.toLowerCase() === 'male') {
        return Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5);
    } else {
        return Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161);
    }
};

/**
 * Calculate TDEE
 * @param {number} bmr - BMR in calories
 * @param {string} activityLevel - Activity level key
 * @returns {number} TDEE in calories
 */
const calculateTDEE = (bmr, activityLevel) => {
    const multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very': 1.725,
        'extra': 1.9
    };
    const multiplier = multipliers[activityLevel.toLowerCase()] || 1.2;
    return Math.round(bmr * multiplier);
};

/**
 * Calculate Macros based on goal
 * @param {number} tdee - TDEE in calories
 * @param {string} goal - 'weight_loss', 'muscle_gain', 'general', 'performance'
 * @returns {Object} Protein, Carbs, Fats in grams and target calories
 */
const calculateMacros = (tdee, goal) => {
    let targetCalories = tdee;
    let proteinRatio, fatRatio, carbRatio;

    switch (goal.toLowerCase()) {
        case 'weight_loss':
            targetCalories -= 500;
            proteinRatio = 0.40; // 40% protein
            fatRatio = 0.30;    // 30% fat
            carbRatio = 0.30;   // 30% carbs
            break;
        case 'muscle_gain':
            targetCalories += 300;
            proteinRatio = 0.30;
            fatRatio = 0.25;
            carbRatio = 0.45;
            break;
        case 'performance':
            targetCalories += 200;
            proteinRatio = 0.25;
            fatRatio = 0.25;
            carbRatio = 0.50;
            break;
        case 'general':
        default:
            proteinRatio = 0.25;
            fatRatio = 0.30;
            carbRatio = 0.45;
            break;
    }

    return {
        calories: Math.round(targetCalories),
        macros: {
            protein: Math.round((targetCalories * proteinRatio) / 4),
            fats: Math.round((targetCalories * fatRatio) / 9),
            carbs: Math.round((targetCalories * carbRatio) / 4)
        }
    };
};

module.exports = {
    calculateBMI,
    calculateBMR,
    calculateTDEE,
    calculateMacros
};
