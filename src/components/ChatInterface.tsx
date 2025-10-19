import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/types';
import { GeminiService } from '../services/geminiService';
import { PromptTemplateService } from '../services/promptTemplateService';
import { FileUtils } from '../utils/fileUtils';
import MealPlanForm from './MealPlanForm';
import MealPlanDisplay from './MealPlanDisplay';
import './ChatInterface.css';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMealPlanForm, setShowMealPlanForm] = useState(false);
  const [currentMealPlanData, setCurrentMealPlanData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const exampleMessage: ChatMessage = {
      id: 'example',
      text: `👋 Welcome! I can help you create personalized meal plans with TDEE calculation.\n\nClick "Generate Meal Plan" below to get started, or ask me anything in the chat!`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([exampleMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await GeminiService.sendMessage(inputText);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || 'Unknown error occurred'}`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealPlanSubmit = async (formData: any) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Generate a meal plan for:\n- ${formData.gender}, ${formData.age} years old\n- ${formData.height} tall, ${formData.weight} lbs\n- ${formData.activityLevel}\n- ${formData.calorieDeficit}-calorie deficit${formData.dietaryPreferences ? `\n- Dietary preferences: ${formData.dietaryPreferences}` : ''}`,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowMealPlanForm(false);
    setIsLoading(true);

    try {
      console.log('Submitting form data:', formData);
      
      const aiResponse = await GeminiService.generateMealPlan({
        gender: formData.gender,
        age: parseInt(formData.age),
        height: formData.height,
        weight: parseInt(formData.weight),
        activityLevel: formData.activityLevel,
        calorieDeficit: parseInt(formData.calorieDeficit),
        dietaryPreferences: formData.dietaryPreferences || ''
      });

      console.log('Raw AI Response:', aiResponse);

      // Enhanced JSON parsing
      let jsonString = aiResponse.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      } else if (jsonString.includes('```')) {
        jsonString = jsonString.replace(/```/g, '').trim();
      }
      
      // Try to extract JSON from the response
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }

      console.log('Cleaned JSON string:', jsonString);

      try {
        const mealPlanData = JSON.parse(jsonString);
        
        // Validate the structure
        if (mealPlanData.TDEE_Calculation && mealPlanData.Daily_Macro_Targets_Grams && mealPlanData.Meal_Plan) {
          console.log('Successfully parsed meal plan data:', mealPlanData);
          
          // Store the meal plan data for JSON download
          setCurrentMealPlanData(mealPlanData);
          
          // Create the meal plan display message
          const mealPlanMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: '',
            isUser: false,
            timestamp: new Date(),
            customComponent: <MealPlanDisplay data={mealPlanData} />
          };
          
          // Create the JSON offer message
          const jsonOfferMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            text: '📄 Would you like to see the raw JSON data or download it as a file?',
            isUser: false,
            timestamp: new Date(),
            customComponent: (
              <div className="json-actions">
                <button 
                  onClick={() => handleShowRawJSON(mealPlanData)}
                  className="json-button show-json"
                >
                  👁️ Show Raw JSON
                </button>
                <button 
                  onClick={() => handleDownloadJSON(mealPlanData)}
                  className="json-button download-json"
                >
                  💾 Download JSON File
                </button>
              </div>
            )
          };

          setMessages(prev => [...prev, mealPlanMessage, jsonOfferMessage]);
        } else {
          throw new Error('Response missing required fields');
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('String that failed to parse:', jsonString);
        
        // Show the raw response for debugging
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: `I received a response but couldn't parse it as valid JSON. Here's the raw response:\n\n${aiResponse.substring(0, 1000)}${aiResponse.length > 1000 ? '...' : ''}`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error: any) {
      console.error('Error generating meal plan:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || 'Failed to generate meal plan'}`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowRawJSON = (mealPlanData: any) => {
    const jsonString = FileUtils.formatJSONForDisplay(mealPlanData);
    
    const jsonMessage: ChatMessage = {
      id: Date.now().toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      customComponent: (
        <div className="raw-json-display">
          <h4>📋 Raw JSON Data (prompt_output.json)</h4>
          <pre className="json-content">
            {jsonString}
          </pre>
          <button 
            onClick={() => handleDownloadJSON(mealPlanData)}
            className="json-button download-json"
          >
            💾 Download JSON File
          </button>
        </div>
      )
    };
    
    setMessages(prev => [...prev, jsonMessage]);
  };

  const handleDownloadJSON = (mealPlanData: any) => {
    FileUtils.downloadJSON(mealPlanData, 'prompt_output.json');
    
    // Add a confirmation message
    const downloadMessage: ChatMessage = {
      id: Date.now().toString(),
      text: '✅ JSON file downloaded as "prompt_output.json"',
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, downloadMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>CS4680 AI Assistant</h1>
        <p>Powered by Gemini AI - Nutrition & Meal Planning</p>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {message.customComponent ? (
                message.customComponent
              ) : (
                <>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        
        {showMealPlanForm && (
          <div className="message ai-message">
            <div className="message-content" style={{ maxWidth: '100%', padding: '0' }}>
              <MealPlanForm 
                onSubmit={handleMealPlanSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
        
        {isLoading && !showMealPlanForm && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        {!showMealPlanForm ? (
          <div className="input-actions">
            <button
              onClick={() => setShowMealPlanForm(true)}
              className="meal-plan-button"
            >
              🍽️ Generate Meal Plan
            </button>
            <div className="input-wrapper">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Or type your message here..."
                disabled={isLoading}
                rows={1}
                className="message-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="send-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="form-actions">
            <button
              onClick={() => setShowMealPlanForm(false)}
              className="back-button"
            >
              ← Back to Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;