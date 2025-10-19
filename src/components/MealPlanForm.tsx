import React, { useState, useEffect } from 'react';

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

// Height validation utility functions
const HeightValidation = {
  // Check if height contains negative values
  hasNegativeValue: (height: string): boolean => {
    return height.includes('-');
  },

  // Validate height format (supports: 5'10", 5ft 10in, 170cm, 1.70m)
  isValidFormat: (height: string): boolean => {
    if (!height.trim()) return false;
    
    const heightPatterns = [
      /^\d+'\d+"$/,           // 5'10"
      /^\d+'\d+$/,            // 5'10
      /^\d+ft\s*\d+in$/i,     // 5ft 10in (case insensitive)
      /^\d+ft$/i,             // 5ft (case insensitive)
      /^\d+cm$/i,             // 170cm (case insensitive)
      /^\d+\.\d+m$/i,         // 1.70m (case insensitive)
      /^\d+m$/i,              // 170m (case insensitive)
      /^\d+\.\d+$/,           // 170.5 (assumed cm)
      /^\d+$/,                // 170 (assumed cm)
    ];

    return heightPatterns.some(pattern => pattern.test(height.trim()));
  },

  // Extract numeric value from height string
  extractNumericValue: (height: string): number | null => {
    const trimmedHeight = height.trim();
    
    // For feet/inches format: 5'10" -> convert to cm
    const feetInchesMatch = trimmedHeight.match(/^(\d+)'(\d+)?"?$/i);
    if (feetInchesMatch) {
      const feet = parseInt(feetInchesMatch[1]);
      const inches = feetInchesMatch[2] ? parseInt(feetInchesMatch[2]) : 0;
      return (feet * 12 + inches) * 2.54; // Convert to cm
    }

    // For feet format: 5ft -> convert to cm
    const feetMatch = trimmedHeight.match(/^(\d+)ft$/i);
    if (feetMatch) {
      const feet = parseInt(feetMatch[1]);
      return feet * 30.48; // Convert to cm
    }

    // For cm format: 170cm
    const cmMatch = trimmedHeight.match(/^(\d+)cm$/i);
    if (cmMatch) {
      return parseInt(cmMatch[1]);
    }

    // For meter format: 1.70m
    const meterMatch = trimmedHeight.match(/^(\d+\.?\d*)m$/i);
    if (meterMatch) {
      return parseFloat(meterMatch[1]) * 100;
    }

    // For plain numbers (assume cm)
    const numberMatch = trimmedHeight.match(/^(\d+\.?\d*)$/);
    if (numberMatch) {
      return parseFloat(numberMatch[1]);
    }

    return null;
  },

  // Validate height range (in cm)
  isValidRange: (heightInCm: number): boolean => {
    return heightInCm >= 100 && heightInCm <= 250; // 3'3" to 8'2" in cm
  },

  // Get validation error message
  getErrorMessage: (height: string): string => {
    if (!height.trim()) {
      return 'Height is required';
    }

    if (HeightValidation.hasNegativeValue(height)) {
      return 'Height cannot contain negative values';
    }

    if (!HeightValidation.isValidFormat(height)) {
      return 'Please use valid format: 5\'10", 170cm, or 1.70m';
    }

    const numericValue = HeightValidation.extractNumericValue(height);
    if (numericValue === null) {
      return 'Invalid height value';
    }

    if (!HeightValidation.isValidRange(numericValue)) {
      return 'Height must be between 100cm (3\'3") and 250cm (8\'2")';
    }

    return '';
  }
};

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Real-time validation effect
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    // Validate age if touched
    if (touched.age) {
      if (!formData.age.trim()) {
        newErrors.age = 'Age is required';
      } else {
        const age = parseInt(formData.age);
        if (isNaN(age) || age < 18 || age > 100) {
          newErrors.age = 'Age must be between 18 and 100';
        }
      }
    }

    // Validate height if touched
    if (touched.height) {
      const heightError = HeightValidation.getErrorMessage(formData.height);
      if (heightError) {
        newErrors.height = heightError;
      }
    }

    // Validate weight if touched
    if (touched.weight) {
      if (!formData.weight.trim()) {
        newErrors.weight = 'Weight is required';
      } else {
        const weight = parseInt(formData.weight);
        if (isNaN(weight) || weight < 50 || weight > 500) {
          newErrors.weight = 'Weight must be between 50 and 500 lbs';
        }
      }
    }

    // Validate calorie deficit if touched
    if (touched.calorieDeficit) {
      if (!formData.calorieDeficit.trim()) {
        newErrors.calorieDeficit = 'Calorie deficit is required';
      } else {
        const deficit = parseInt(formData.calorieDeficit);
        if (isNaN(deficit) || deficit < 100 || deficit > 1000) {
          newErrors.calorieDeficit = 'Calorie deficit must be between 100 and 1000';
        }
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched when user starts typing
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const validateForm = (): boolean => {
    // Mark all fields as touched to show all errors
    const allFields = ['age', 'height', 'weight', 'calorieDeficit'];
    const newTouched: { [key: string]: boolean } = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Check if there are any errors
    const hasErrors = Object.keys(errors).length > 0;
    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const loadExampleData = () => {
    setFormData({
      gender: 'Male',
      age: '30',
      height: '5\'10"',
      weight: '180',
      activityLevel: 'Moderately Active',
      calorieDeficit: '500',
      dietaryPreferences: 'Prefer low-carb options'
    });
    
    // Clear any existing errors and touched states when loading example data
    setErrors({});
    setTouched({});
  };

  return (
    <div className="meal-plan-form-container">
      <div className="form-header">
        <div className="header-icon">🍽️</div>
        <h2>Create Your Personalized Meal Plan</h2>
        <p className="form-subtitle">
          Get a customized nutrition plan with TDEE calculation and macro targets
        </p>
        
        <button
          onClick={loadExampleData}
          className="example-button"
          type="button"
          disabled={isLoading}
        >
          🚀 Load Example Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="meal-plan-form" noValidate> {/* Add noValidate to disable browser validation */}
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
                placeholder="Enter your age"
                className={`form-input ${touched.age && errors.age ? 'error' : ''}`}
                required
              />
              {touched.age && errors.age && <div className="error-message">{errors.age}</div>}
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
                onBlur={handleBlur}
                placeholder="e.g., 5'10&quot; or 178 cm"
                className={`form-input ${touched.height && errors.height ? 'error' : ''}`}
                required
              />
              {touched.height && errors.height && <div className="error-message">{errors.height}</div>}
              <div className="input-hint">Acceptable formats: 5'10", 170cm, 1.70m</div>
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
                onBlur={handleBlur}
                placeholder="Enter your weight"
                className={`form-input ${touched.weight && errors.weight ? 'error' : ''}`}
                required
              />
              {touched.weight && errors.weight && <div className="error-message">{errors.weight}</div>}
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
                  onBlur={handleBlur}
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
                  onBlur={handleBlur}
                  placeholder="300-800"
                  className={`form-input ${touched.calorieDeficit && errors.calorieDeficit ? 'error' : ''}`}
                  required
                />
                <span className="calorie-suffix">kcal</span>
              </div>
              {touched.calorieDeficit && errors.calorieDeficit && <div className="error-message">{errors.calorieDeficit}</div>}
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
                onBlur={handleBlur}
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
              onBlur={handleBlur}
              placeholder="Any food allergies, specific dislikes, or additional requirements..."
              className="form-textarea spacious"
              rows={3}
            />
            <div className="input-hint">Optional: List any foods to avoid or include</div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button primary"
            disabled={isLoading || Object.keys(errors).length > 0}
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