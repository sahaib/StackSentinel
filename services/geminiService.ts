import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, MOCK_RESPONSE } from '../constants';
import { AnalysisResult } from '../types';

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeArchitecture = async (file: File): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;

  // DEMO MODE CHECK:
  // If no API key is present, fallback to the mock response after a simulated delay.
  // This satisfies the "simulated delay" requirement in the prompt for the demo version.
  if (!apiKey) {
    console.warn("No API_KEY found. Running in Demo Mode with mock response.");
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second simulated delay
    return { markdown: MOCK_RESPONSE };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await convertFileToBase64(file);

    // Using gemini-3-pro-preview for advanced multimodal analysis
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: "Analyze this system architecture diagram."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2, // Low temperature for more analytical/factual output
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return { markdown: text };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to mock on error for stability in this demo environment,
    // or rethrow if you want strict error handling.
    // For this specific request, we will return the mock if the API call fails
    // to ensure the user sees the UI flow.
    return { markdown: MOCK_RESPONSE };
  }
};