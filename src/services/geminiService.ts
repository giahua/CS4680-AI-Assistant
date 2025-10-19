import { GoogleGenerativeAI } from '@google/generative-ai';

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
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    console.log('Initialized with model: gemini-2.5-flash');
  }

  static async sendMessage(prompt: string): Promise<string> {
    try {
      if (!this.model) {
        this.initialize();
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }
}