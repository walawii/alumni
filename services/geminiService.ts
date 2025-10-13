
import { GoogleGenAI } from "@google/genai";

// FIX: Per guidelines, API key must be obtained exclusively from process.env.API_KEY
// and we should assume it is pre-configured and valid.
// Initializing the client directly with the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateAlumniStory = async (prompt: string): Promise<string> => {
  // FIX: Redundant checks for API_KEY are removed as per the guidelines.
  // The try/catch block is retained for robust API error handling.
  try {
    const fullPrompt = `Tuliskan sebuah kisah sukses singkat dan inspiratif (sekitar 150 kata) tentang seorang alumni fiktif dari SMAN 7 Tasikmalaya yang sukses dalam bidang "${prompt}". Ceritakan tantangan yang dihadapinya dan bagaimana nilai-nilai yang didapat di sekolah membantunya. Gunakan bahasa yang memotivasi.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    return "Maaf, terjadi kesalahan saat mencoba menghasilkan cerita. Silakan coba lagi nanti.";
  }
};
