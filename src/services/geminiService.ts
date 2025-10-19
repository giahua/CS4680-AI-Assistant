import { GoogleGenerativeAI } from '@google/generative-ai';
import { PromptTemplateService } from './promptTemplateService';

export class GeminiService {
  private static genAI: GoogleGenerativeAI | null = null;
  private static model: any = null;

  static initialize() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables.');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });
    
    console.log('Gemini service initialized');
  }

  static async sendMessage(prompt: string): Promise<string> {
    try {
      if (!this.model) {
        this.initialize();
      }

      console.log('Sending message to Gemini...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Successfully received response from Gemini');
      return text;
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  // Add the missing generateMealPlan method that uses PromptTemplateService
  static async generateMealPlan(userData: {
    gender: string;
    age: number;
    height: string;
    weight: number;
    activityLevel: string;
    calorieDeficit: number;
    dietaryPreferences?: string;
  }): Promise<string> {
    try {
      const prompt = PromptTemplateService.getMealPlanPrompt(userData);
      console.log('Generated prompt for meal plan:', prompt);
      return await this.sendMessage(prompt);
    } catch (error: any) {
      console.error('Error in generateMealPlan:', error);
      throw new Error(`Failed to generate meal plan: ${error.message}`);
    }
  }
}