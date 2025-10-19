import React from 'react';

interface MealItem {
  food: string;
  portion: string;
}

interface Meal {
  meal_name: string;
  estimated_calories_kcal: number;
  description: string;
  items: MealItem[];
}

interface TDEE_Calculation {
  estimated_TDEE_kcal: number;
  target_deficit_kcal: number;
  target_calorie_intake_kcal: number;
}

interface Daily_Macro_Targets_Grams {
  protein: number;
  fat: number;
  carbohydrates: number;
}

interface MealPlanData {
  TDEE_Calculation: TDEE_Calculation;
  Daily_Macro_Targets_Grams: Daily_Macro_Targets_Grams;
  Meal_Plan: Meal[];
}

interface MealPlanDisplayProps {
  data: MealPlanData;
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ data }) => {
  const { TDEE_Calculation, Daily_Macro_Targets_Grams, Meal_Plan } = data;

  const getMealIcon = (mealName: string) => {
    switch (mealName.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const calculateTotalCalories = () => {
    return Meal_Plan.reduce((total, meal) => total + meal.estimated_calories_kcal, 0);
  };

  return (
    <div className="meal-plan-display">
      {/* Header */}
      <div className="plan-header">
        <h2>📋 Your Personalized Meal Plan</h2>
        <p>Tailored to your goals and preferences</p>
      </div>

      {/* TDEE Calculation */}
      <div className="plan-section tdee-section">
        <h3>📊 TDEE Calculation</h3>
        <div className="tdee-grid">
          <div className="tdee-card">
            <div className="tdee-value">{TDEE_Calculation.estimated_TDEE_kcal}</div>
            <div className="tdee-label">Estimated TDEE</div>
            <div className="tdee-unit">calories/day</div>
          </div>
          <div className="tdee-card">
            <div className="tdee-value">{TDEE_Calculation.target_deficit_kcal}</div>
            <div className="tdee-label">Daily Deficit</div>
            <div className="tdee-unit">calories</div>
          </div>
          <div className="tdee-card highlight">
            <div className="tdee-value">{TDEE_Calculation.target_calorie_intake_kcal}</div>
            <div className="tdee-label">Target Intake</div>
            <div className="tdee-unit">calories/day</div>
          </div>
        </div>
      </div>

      {/* Macro Targets */}
      <div className="plan-section macros-section">
        <h3>🎯 Daily Macro Targets</h3>
        <div className="macros-grid">
          <div className="macro-card protein">
            <div className="macro-icon">💪</div>
            <div className="macro-content">
              <div className="macro-value">{Daily_Macro_Targets_Grams.protein}g</div>
              <div className="macro-label">Protein</div>
            </div>
          </div>
          <div className="macro-card carbs">
            <div className="macro-icon">🌾</div>
            <div className="macro-content">
              <div className="macro-value">{Daily_Macro_Targets_Grams.carbohydrates}g</div>
              <div className="macro-label">Carbs</div>
            </div>
          </div>
          <div className="macro-card fat">
            <div className="macro-icon">🥑</div>
            <div className="macro-content">
              <div className="macro-value">{Daily_Macro_Targets_Grams.fat}g</div>
              <div className="macro-label">Fat</div>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Plan */}
      <div className="plan-section meals-section">
        <h3>🍽️ Daily Meal Plan</h3>
        <div className="meals-container">
          {Meal_Plan.map((meal: Meal, index: number) => (
            <div key={index} className="meal-card">
              <div className="meal-header">
                <span className="meal-icon">{getMealIcon(meal.meal_name)}</span>
                <div className="meal-title">
                  <h4>{meal.meal_name}</h4>
                  <span className="meal-calories">{meal.estimated_calories_kcal} calories</span>
                </div>
              </div>
              
              <p className="meal-description">{meal.description}</p>
              
              <div className="meal-items">
                <h5>Meal Items:</h5>
                <ul>
                  {meal.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="meal-item">
                      <span className="food-name">{item.food}</span>
                      <span className="food-portion">{item.portion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Total */}
      <div className="plan-section total-section">
        <h3>📈 Daily Total</h3>
        <div className="total-card">
          <div className="total-value">{calculateTotalCalories()} calories</div>
          <div className="total-label">Total Daily Intake</div>
          <div className="total-macros">
            <span>Protein: {Daily_Macro_Targets_Grams.protein}g</span>
            <span>Carbs: {Daily_Macro_Targets_Grams.carbohydrates}g</span>
            <span>Fat: {Daily_Macro_Targets_Grams.fat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanDisplay;