import React, { useState } from 'react';

interface MealPlanFormData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  activityLevel: string;
  calorieDeficit: string;
  dietaryPreferences: string;
}

interface MealPlanFormProps {
  onSubmit: (data: MealPlanFormData) => void;
  isLoading: boolean;
}

const MealPlanForm: React.FC<MealPlanFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<MealPlanFormData>({
    gender: 'Male',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'Moderately Active',
    calorieDeficit: '500',
    dietaryPreferences: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="meal-plan-form-container">
      <div className="form-header">
        <div className="header-icon">🍽️</div>
        <h2>Create Your Personalized Meal Plan</h2>
        <p className="form-subtitle">
          Get a customized nutrition plan with TDEE calculation and macro targets
        </p>
      </div>

      <form onSubmit={handleSubmit} className="meal-plan-form">
        {/* Personal Information Section */}
        <div className="form-section personal-info">
          <div className="section-header">
            <h3>👤 Personal Information</h3>
            <p>Tell us about yourself</p>
          </div>
          
          <div className="form-grid spacious">
            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="age" className="form-label">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                className="form-input"
                min="18"
                max="100"
                required
              />
              <div className="input-hint">Must be 18+ years</div>
            </div>

            <div className="form-group">
              <label htmlFor="height" className="form-label">
                Height
              </label>
              <input
                type="text"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g., 5'10&quot; or 178 cm"
                className="form-input"
                required
              />
              <div className="input-hint">Feet/inches or centimeters</div>
            </div>

            <div className="form-group">
              <label htmlFor="weight" className="form-label">
                Weight
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter your weight"
                className="form-input"
                min="50"
                max="500"
                required
              />
              <div className="input-hint">Weight in pounds (lbs)</div>
            </div>
          </div>
        </div>

        {/* Activity Level Section */}
        <div className="form-section activity-level">
          <div className="section-header">
            <h3>💪 Activity Level</h3>
            <p>How active are you daily?</p>
          </div>
          
          <div className="activity-options">
            {[
              { value: 'Sedentary', label: 'Sedentary', desc: 'Little to no exercise, desk job' },
              { value: 'Lightly Active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
              { value: 'Moderately Active', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
              { value: 'Heavily Active', label: 'Heavily Active', desc: 'Hard exercise 6-7 days/week, physical job' }
            ].map(option => (
              <label key={option.value} className="activity-option">
                <input
                  type="radio"
                  name="activityLevel"
                  value={option.value}
                  checked={formData.activityLevel === option.value}
                  onChange={handleChange}
                  className="activity-radio"
                />
                <div className="activity-content">
                  <span className="activity-label">{option.label}</span>
                  <span className="activity-desc">{option.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Goals Section */}
        <div className="form-section goals">
          <div className="section-header">
            <h3>🎯 Nutrition Goals</h3>
            <p>Set your calorie target and preferences</p>
          </div>
          
          <div className="form-grid spacious">
            <div className="form-group">
              <label htmlFor="calorieDeficit" className="form-label">
                Daily Calorie Deficit
              </label>
              <div className="calorie-input-container">
                <input
                  type="number"
                  id="calorieDeficit"
                  name="calorieDeficit"
                  value={formData.calorieDeficit}
                  onChange={handleChange}
                  placeholder="300-800"
                  className="form-input"
                  min="300"
                  max="800"
                  required
                />
                <span className="calorie-suffix">kcal</span>
              </div>
              <div className="input-hint">
                <div>300-500: Sustainable weight loss</div>
                <div>500-800: Aggressive weight loss</div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dietaryPreferences" className="form-label">
                Dietary Preferences
              </label>
              <select
                id="dietaryPreferences"
                name="dietaryPreferences"
                value={formData.dietaryPreferences}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">No specific preferences</option>
                <option value="Vegetarian">🌱 Vegetarian</option>
                <option value="Vegan">🌿 Vegan</option>
                <option value="Low-Carb">🥩 Low-Carb</option>
                <option value="Keto">🥑 Keto</option>
                <option value="Gluten-Free">🌾 Gluten-Free</option>
                <option value="Dairy-Free">🥛 Dairy-Free</option>
                <option value="Mediterranean">🐟 Mediterranean</option>
                <option value="Pescatarian">🐠 Pescatarian</option>
                <option value="Paleo">🍖 Paleo</option>
              </select>
              <div className="input-hint">Select your dietary style</div>
            </div>
          </div>

          {/* Additional Preferences */}
          <div className="form-group full-width">
            <label htmlFor="additionalPreferences" className="form-label">
              Additional Notes
            </label>
            <textarea
              id="additionalPreferences"
              name="dietaryPreferences"
              value={formData.dietaryPreferences}
              onChange={handleChange}
              placeholder="Any food allergies, specific dislikes, or additional requirements..."
              className="form-textarea"
              rows={3}
            />
            <div className="input-hint">Optional: List any foods to avoid or include</div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Generating Your Meal Plan...
              </>
            ) : (
              <>
                <span className="button-icon">🍎</span>
                Generate My Meal Plan
              </>
            )}
          </button>
          
          <div className="form-note">
            <div>⚡ Your plan will include:</div>
            <ul>
              <li>TDEE calculation</li>
              <li>Daily macro targets</li>
              <li>4 meals (breakfast, lunch, dinner, snack)</li>
              <li>Portion sizes & calorie estimates</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MealPlanForm;