import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a cartoon image of the specified animal.
 */
export const generateAnimalCartoon = async (animalName: string): Promise<string | null> => {
  if (!apiKey) {
    console.warn("No API Key available for image generation.");
    return null;
  }

  try {
    const prompt = `A cute, vibrant, friendly cartoon illustration of a ${animalName} on a clean white background. High quality, children's book style.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to generate image:", error);
    return null;
  }
};