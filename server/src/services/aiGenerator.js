const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate highly specialized Meal and Training plans via LLM.
 * Optionally estimates body fat if a physique photo is provided.
 * 
 * @param {Object} metrics - Client biometrics and constraints
 * @param {Object} photo - Multer file object
 * @returns {Promise<Object>} JSON containing bodyFat, mealPlan array, and trainingPlan array
 */
const generateDynamicPlans = async (metrics, photo) => {
    let imagesContent = [];

    // If an image was uploaded, attach it as a base64 Data URL so the vision model can parse it.
    if (photo) {
        const base64Image = photo.buffer.toString('base64');
        const mimeType = photo.mimetype;
        imagesContent.push({
            type: 'image_url',
            image_url: {
                url: `data:${mimeType};base64,${base64Image}`
            }
        });
    }

    const { name, age, weight, height, gender, goal, activityLevel, injuries, tdee, macros } = metrics;
    
    const goalText = goal.replace('_', ' ');

    const promptText = `I am Fitness Report GPT, building a detailed 7-day protocol for a client.
Client Profile:
- Name: ${name}
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm
- Gender: ${gender}
- Primary Goal: ${goalText}
- Physical Constraints/Injuries: ${injuries || 'None'}
- Target Daily Calories: ${macros.calories}
- Target Macros: Protein (${macros.macros.protein}g), Carbs (${macros.macros.carbs}g), Fats (${macros.macros.fats}g)

Instructions:
1. Construct a strict 7-day meal plan prioritizing the user's constraints and allergies. It MUST hit the target calories/macros.
2. Construct a strict 7-day training plan reflecting their exact goal (${goalText}). Ensure there are 3 exercises per trained muscle group (2 compound, 1 isolation). Include sets, reps, and rest.
3. If an image is provided, accurately estimate their current Body Fat Percentage (X%) based solely on the visual. If no image, return "N/A".

Respond ONLY with valid JSON using exactly this schema:
{
  "bodyFat": "Estimated Body Fat % or N/A",
  "mealPlan": [
    ["Day 1", "Breakfast details...", "Snack 1 details", "Lunch details", "Snack 2", "Dinner details"],
    // ... exactly 7 arrays for 7 days
  ],
  "trainingPlan": [
    {
      "day": "Day 1 – [Focus Area]",
      "headers": ["Exercise", "Sets", "Reps", "Rest"], // Ensure headers adapt based on the day. Ex: Use ["Activity", "Duration", "Focus"] for Cardio/Recovery days.
      "exercises": [
        ["Exercise Name (Compound/Isolation)", "Sets", "Reps", "Rest"] // Data MUST match the length and context of your headers array!
        // ... 3 exercises
      ]
    }
    // ... exactly 7 day objects
  ]
}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are an elite AI personal trainer producing strict, professional JSON plans."
            },
            {
                role: "user",
                content: [
                    { type: "text", text: promptText },
                    ...imagesContent
                ]
            }
        ],
        response_format: { type: "json_object" }
    });

    try {
        const jsonOutput = JSON.parse(response.choices[0].message.content);
        return jsonOutput;
    } catch (e) {
        console.error("Failed to parse OpenAI response", e);
        throw new Error("AI generation failed to return valid protocol format.");
    }
};

module.exports = { generateDynamicPlans };
