export interface MealItem {
  food: string;
  portion: string;
}

export interface Meal {
  meal_name: string;
  estimated_calories_kcal: number;
  description: string;
  items: MealItem[];
}

export interface TDEE_Calculation {
  estimated_TDEE_kcal: number;
  target_deficit_kcal: number;
  target_calorie_intake_kcal: number;
}

export interface Daily_Macro_Targets_Grams {
  protein: number;
  fat: number;
  carbohydrates: number;
}

export interface MealPlanData {
  TDEE_Calculation: TDEE_Calculation;
  Daily_Macro_Targets_Grams: Daily_Macro_Targets_Grams;
  Meal_Plan: Meal[];
}