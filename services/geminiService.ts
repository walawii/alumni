import { GoogleGenAI, Type } from "@google/genai";

// Helper to convert File to a format suitable for the Gemini API
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result includes the data URI prefix, which we need to remove.
      // e.g., "data:image/jpeg;base64,LzlqLzRBQ...". We want only "LzlqLzRBQ..."
      const base64Data = (reader.result as string).split(',')[1];
      resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

interface GeneratedStory {
    title: string;
    content: string;
}

export const generateNewsStory = async (
    prompt: string,
    image: File
): Promise<GeneratedStory> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const imagePart = await fileToGenerativePart(image);
        
        const textPart = {
            text: `Based on the provided image and the following keywords/description, generate a compelling news article title and the full article content (around 500 words) suitable for an alumni website.
            
            Keywords/Description: "${prompt}"
            
            Return the result in a JSON object with "title" and "content" keys. The content should be well-structured, engaging, and written in Indonesian.`,
        };

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
            },
            required: ['title', 'content'],
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        return {
            title: parsedJson.title || 'Judul Gagal Dibuat',
            content: parsedJson.content || 'Konten gagal dibuat. Silakan coba lagi.'
        };

    } catch (error) {
        console.error("Error generating story with Gemini:", error);
        throw new Error("Gagal menghasilkan cerita. Periksa konsol untuk detail.");
    }
};