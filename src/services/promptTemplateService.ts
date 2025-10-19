// Service to handle the meal plan prompt template
export class PromptTemplateService {
  static getMealPlanPrompt(userData: {
    gender: string;
    age: number;
    height: string;
    weight: number;
    activityLevel: string;
    calorieDeficit: number;
    dietaryPreferences?: string;
  }): string {
    const {
      gender,
      age,
      height,
      weight,
      activityLevel,
      calorieDeficit,
      dietaryPreferences = "None"
    } = userData;

    return `CRITICAL: You MUST respond with ONLY valid JSON, no other text, no explanations, no markdown formatting.

MEAL PLAN GENERATION PROMPT

I am a ${gender}, ${age} years old.
My height is ${height}, and my weight is ${weight} lbs.
My daily activity level is ${activityLevel}.

Goal and Deficit:
My primary goal is to establish a daily ${calorieDeficit} calorie deficit.

Dietary Requirements & Preferences:
I have the following specific dietary restrictions, allergies, or preferences: ${dietaryPreferences}.

OUTPUT REQUEST: Generate the entire response as a single, valid JSON object, strictly following the schema below.

The JSON object must contain three top-level keys: TDEE_Calculation, Daily_Macro_Targets_Grams, and Meal_Plan.

TDEE Calculation: Calculate my estimated Total Daily Energy Expenditure (TDEE), target deficit, and final target calorie intake.

Meal Plan: Create a detailed, one-day meal plan (Breakfast, Lunch, Dinner, and one Snack) that hits the target calorie deficit.

Macro Targets: Provide the estimated daily total grams for Protein, Fat, and Carbohydrates for the entire meal plan.

Required JSON Schema:
{
  "TDEE_Calculation": {
    "estimated_TDEE_kcal": "[Number]",
    "target_deficit_kcal": "[Number]", 
    "target_calorie_intake_kcal": "[Number]"
  },
  "Daily_Macro_Targets_Grams": {
    "protein": "[Number]",
    "fat": "[Number]",
    "carbohydrates": "[Number]"
  },
  "Meal_Plan": [
    {
      "meal_name": "[String: e.g., 'Breakfast', 'Lunch', 'Dinner', 'Snack']",
      "estimated_calories_kcal": "[Number]",
      "description": "[String: A brief summary of the meal]",
      "items": [
        {
          "food": "[String: e.g., 'Oatmeal']",
          "portion": "[String: e.g., '1/2 cup dry', '1 whole']"
        }
      ]
    }
  ]
}

IMPORTANT: 
- Replace ALL placeholder text ([Number], [String]) with actual values
- Do NOT include any explanatory text before or after the JSON
- Do NOT use markdown code blocks
- The response must be parseable as valid JSON
- Include exactly 4 meals: Breakfast, Lunch, Dinner, Snack`;
  }
}