import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// API Key (Keep it secret)
const API_KEY = "AIzaSyDCw1ilfBV5sLrAThFeA25ziPVMUExm11Q";  
const MODEL_NAME = "gemini-1.5-pro"; // Updated to the correct model name

async function runChat(prompt) {
  try {
    console.log("User Prompt:", prompt);

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Define Chat Configuration
    const generationConfig = {
      temperature: 0.75,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Start Chat Session
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    // Send Message to API
    const result = await chat.sendMessage(prompt);

    // Log Full API Response for Debugging
    console.log("API Response:", result);

    // Handle API Response Errors
    if (!result || !result.response) {
      throw new Error("Invalid API response received.");
    }

    return result.response.text();
  } catch (error) {
    console.error("❌ Error in API call:", error);
    return "Error: Unable to generate a response. Details: " + error.message;
  }
}

// Default export
export default runChat;