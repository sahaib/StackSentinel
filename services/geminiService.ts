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

  if (!apiKey) {
    console.warn("No API_KEY found. Running in Demo Mode with mock response.");
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { markdown: MOCK_RESPONSE };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await convertFileToBase64(file);

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
        temperature: 0.2,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return { markdown: text };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { markdown: MOCK_RESPONSE };
  }
};

export const refineArchitecture = async (file: File, previousMarkdown: string, feedback: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API_KEY found. Simulating refinement.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { markdown: MOCK_RESPONSE + `\n\n**Update based on feedback:** ${feedback}\n(Demo Note: In live mode, this would be a full re-analysis.)` };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await convertFileToBase64(file);

    const prompt = `
    The user has provided additional context/feedback on your previous analysis.
    
    PREVIOUS ANALYSIS:
    ${previousMarkdown}

    USER FEEDBACK/CONTEXT:
    "${feedback}"

    TASK:
    Re-evaluate the architecture based on this new information. 
    1. If the user clarifies a technology (e.g., "We use DynamoDB, not Postgres"), update your risks and recommendations accordingly.
    2. Regenerate the Mermaid diagram to reflect the *correct* improved architecture.
    3. Maintain the same output format (Breakdown, Risks, Fix, Recommended Architecture Diagram, Verdict).
    `;

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
            text: prompt
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return { markdown: text };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { markdown: previousMarkdown };
  }
};