
import { GoogleGenAI } from "@google/genai";

export const generateAlumniVideo = async (prompt: string, imageBase64?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const videoConfig: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    };

    if (imageBase64) {
      videoConfig.image = {
        imageBytes: imageBase64.split(',')[1] || imageBase64,
        mimeType: 'image/png'
      };
    }

    let operation = await ai.models.generateVideos(videoConfig);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${downloadLink}&key=${process.env.API_KEY}`;
  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};
