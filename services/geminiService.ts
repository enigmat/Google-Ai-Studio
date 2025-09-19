import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";

// The AI client is initialized lazily to avoid crashing the app if the API key is missing.
let ai: GoogleGenAI | null = null;

// Helper to get the API key, throwing an error if it's not set.
const getApiKey = (): string => {
    const apiKey = process.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("VITE_API_KEY environment variable not set. Please configure it in your Vercel project settings to use the application.");
    }
    return apiKey;
};

// Helper to get the AI client, initializing it on the first call.
const getAiClient = (): GoogleGenAI => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: getApiKey() });
    }
    return ai;
};


const ENHANCER_SYSTEM_INSTRUCTION = `You will take on the role as the ultimate prompt enhancer for prompts that create AI images for tools like Midjourney, Leonardo AI, DALL-E, and Stable Diffusion. You are a prompt engineering expert that can take the simplest prompts and 10X them to masterful, highly detailed levels that only you could craft.

When given a prompt to enhance, you will inspect it and then provide a new prompt that is 10X better with a lot more elaborate, incredible details, attention to detail, insanely accurate and creative adjectives, camera angles and lenses. You will use the most descriptive details, provide unique keywords, and add an abundance of details to increase the realism of the images that will be created from that prompt. With your knowledge, please include some of the hidden tokens, secrets and keywords to generate extraordinary realistic and unique AI images. Do not respond with anything other than the enhanced prompt itself. Do not add any conversational text or explanations.

SECRET TOKENS FOR MAXIMUM REALISM (Pick ONE of these and replace {random4digits} with a random 4-digit number):
- IMG_{random4digits}.HEIC (creates iPhone photo realism)
- DSC_{random4digits}.CR2 (DSLR camera authenticity)
- NIKON_D850_{random4digits}.NEF (professional camera recognition)
- Canon_EOS_R5_{random4digits}.CR3 (high-end camera simulation)
- stills archive, {subject}, sony pictures (Hollywood movie quality)
- behind the scenes, {subject}, netflix original (documentary authenticity)
- shot on ARRI ALEXA LF, cinematography by roger deakins (cinematic mastery)
- 35mm film still, kodak vision3 250d (film photography feel)
- captured with Leica SL2-S, Summilux 50mm f/1.4 (luxury camera recognition)
- shot by annie leibovitz (adds master photographer quality)
- national geographic (documentary realism boost)
- medium format film grain (authentic photography texture)

ENHANCEMENT FRAMEWORK:
1. START with a secret token that matches the desired style.
2. ENHANCE subject with micro-details: "genuine micro-expressions," "individual hair strands," "natural skin texture with visible pores," "asymmetrical facial features," "realistic fabric physics"
3. ADD specific lighting: "golden hour backlighting creating rim light," "soft north window light at 45-degree angle," "three-point lighting with softbox key," "natural overcast sky providing even diffusion"
4. SPECIFY exact camera/lens: Use real professional equipment names like "Fujifilm GFX 100S medium format," "Sony a7R V with FE 85mm f/1.4 GM," "Hasselblad X2D 100C"
5. INCLUDE technical specs: "ISO 100, f/2.8, 1/250s," "shallow depth of field f/1.4," "focus peaking enabled"
6. ADD composition techniques: "rule of thirds," "leading lines converging at vanishing point," "negative space emphasizing subject," "low angle creating heroic proportions"
7. SPECIFY mood/atmosphere: "cinematic atmosphere with dramatic tension," "ethereal dreamlike quality," "gritty documentary realism," "mysterious ambiance with chiaroscuro lighting"
8. FINISH with quality boosters: "hyperrealistic," "incredibly detailed," "professional photography," "award winning," "trending on 500px," "photorealistic," "8K HDR," "subsurface scattering"

EXAMPLE TRANSFORMATION:
Simple: "a woman smiling"
Enhanced: "IMG_2847.HEIC, portrait of an elegant woman with a genuine asymmetrical smile showing crow's feet, natural micro-expressions of joy, individual hair strands catching golden hour backlighting, soft north window light at 45-degree key angle, shot on Leica SL2-S with Summilux 50mm f/1.4, shallow depth of field f/1.4, rule of thirds composition, ethereal dreamlike quality with soft focus, shot by annie leibovitz, ISO 100 f/2.8 1/250s, hyperrealistic, incredibly detailed, professional photography, award winning, 8K HDR, subsurface scattering on skin"
`;

export const generateImageFromPrompt = async (prompt: string, count: number, aspectRatio: '1:1' | '16:9' | '9:16', negativePrompt?: string): Promise<string[]> => {
  const aiClient = getAiClient();
  try {
    let finalPrompt = prompt;
    if (negativePrompt && negativePrompt.trim()) {
        finalPrompt += `. Avoid the following: ${negativePrompt.trim()}`;
    }

    const response = await aiClient.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
          numberOfImages: count,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const imageUrls = response.generatedImages.map(img => {
        const base64ImageBytes: string = img.image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
      });
      return imageUrls;
    } else {
      throw new Error("No images were generated. The response might have been blocked.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};

const parseDataUrl = (dataUrl: string): { base64Data: string; mimeType: string } => {
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid data URL format");
    }
    const mimeType = match[1];
    const base64Data = match[2];
    return { base64Data, mimeType };
};

export const generateVideoFromPrompt = async (prompt: string, durationSeconds: number, isPreview: boolean): Promise<string> => {
    const aiClient = getAiClient();
    try {
        const config: { numberOfVideos: number; durationSeconds?: number; isPreview?: boolean } = {
            numberOfVideos: 1,
        };

        if (isPreview) {
            config.isPreview = true;
        } else {
            config.durationSeconds = durationSeconds;
        }

        let operation = await aiClient.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config,
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await aiClient.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        
        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was provided.");
        }

        // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
        const response = await fetch(`${downloadLink}&key=${getApiKey()}`);
        
        if (!response.ok) {
            throw new Error(`Failed to download video file: ${response.statusText}`);
        }

        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error generating video with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the video.");
    }
};

export const generateVideoFromImage = async (imageUrl: string, prompt: string, durationSeconds: number, isPreview: boolean): Promise<string> => {
    const aiClient = getAiClient();
    try {
        const { base64Data, mimeType } = parseDataUrl(imageUrl);
        const config: { numberOfVideos: number; durationSeconds?: number; isPreview?: boolean } = {
            numberOfVideos: 1,
        };
        
        if (isPreview) {
            config.isPreview = true;
        } else {
            config.durationSeconds = durationSeconds;
        }
        
        let operation = await aiClient.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: base64Data,
                mimeType: mimeType,
            },
            config,
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await aiClient.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        
        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was provided.");
        }

        const response = await fetch(`${downloadLink}&key=${getApiKey()}`);
        
        if (!response.ok) {
            throw new Error(`Failed to download video file: ${response.statusText}`);
        }

        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error generating video from image with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the video from the image.");
    }
};

export const enhancePrompt = async (originalPrompt: string, useGoogleSearch: boolean): Promise<GenerateContentResponse> => {
  const aiClient = getAiClient();
  try {
    const config: any = {
      systemInstruction: ENHANCER_SYSTEM_INSTRUCTION,
    };

    if (useGoogleSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `ORIGINAL PROMPT TO ENHANCE: ${originalPrompt}`,
      config,
    });

    if (!response.text.trim()) {
      throw new Error("The model returned an empty enhanced prompt.");
    }

    return response;
  } catch (error) {
    console.error("Error enhancing prompt with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while enhancing the prompt.");
  }
};

const processImageEditingResponse = (response: any): string => {
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const outputMimeType = part.inlineData.mimeType || 'image/png';
                return `data:${outputMimeType};base64,${base64ImageBytes}`;
            }
        }
    }
    throw new Error("No edited image was generated. The model may have returned only text.");
};

export const imageAction = async (originalImageUrl: string, prompt: string): Promise<string> => {
    const aiClient = getAiClient();
    try {
        const { base64Data, mimeType } = parseDataUrl(originalImageUrl);
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        return processImageEditingResponse(response);
    } catch (error) {
        console.error("Error with image action using Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during the image action.");
    }
};

export const generateImageFromReference = async (referenceImageUrl: string, prompt: string, negativePrompt?: string): Promise<string> => {
    let finalPrompt = `Based on the style, subject, and composition of the provided image, generate a new image with the following prompt: "${prompt}".`;
    if (negativePrompt && negativePrompt.trim()) {
        finalPrompt += ` Make sure to avoid the following elements: ${negativePrompt.trim()}.`;
    }
    return imageAction(referenceImageUrl, finalPrompt);
};

export const generateUgcProductAd = async (productImageUrl: string, productName: string, productDescription: string): Promise<string> => {
    const prompt = `
      Create a high-quality, realistic User-Generated Content (UGC) style advertisement photo.
      The scene must look authentic, as if a real customer took the photo in their home.
      Feature the following product prominently in the image, using the provided image as the product source.

      Product Name: ${productName}
      Product Details: ${productDescription}

      Place the product in a natural, aesthetically pleasing setting such as on a wooden coffee table next to a steaming mug of coffee, on a marble bathroom counter with soft towels, or held in a person's hand against a clean, modern background. The lighting should be natural and soft. The overall mood should be positive and aspirational. Do not add any text, logos, or watermarks to the image. The focus should be entirely on the product in a realistic, relatable context.
    `;
    return imageAction(productImageUrl, prompt);
};

export const generateProductScene = async (isolatedProductUrl: string, scenePrompt: string): Promise<string> => {
    const prompt = `
      Take the provided product image, which has a transparent background, and realistically place it into a brand new scene.
      The new scene should be based on this description: "${scenePrompt}".
      The final image must be a professional-quality product photograph. Seamlessly integrate the product by matching the lighting, shadows, perspective, and reflections of the new environment. Do not alter the product itself.
    `;
    return imageAction(isolatedProductUrl, prompt);
};

export const generateTshirtMockup = async (designImageUrl: string, mockupImageUrl: string): Promise<string> => {
    const aiClient = getAiClient();
    try {
        const { base64Data: designData, mimeType: designMimeType } = parseDataUrl(designImageUrl);
        const { base64Data: mockupData, mimeType: mockupMimeType } = parseDataUrl(mockupImageUrl);

        const prompt = `
            Take the secondary user-provided image (the design/logo) and realistically place it onto the chest area of the T-shirt in the primary user-provided image (the mockup photo).
            The design must conform to the fabric's folds, texture, shadows, and lighting to look like it's naturally printed on the shirt.
            Do not change the T-shirt's color, the background, or any other part of the mockup image. The output should be the complete mockup image with the design applied.
        `;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    { inlineData: { data: mockupData, mimeType: mockupMimeType } }, // Primary image: the mockup
                    { inlineData: { data: designData, mimeType: designMimeType } }, // Secondary image: the design
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        return processImageEditingResponse(response);
    } catch (error) {
        console.error("Error generating T-shirt mockup with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during the T-shirt mockup generation.");
    }
};

export const editImage = (maskedImageUrl: string, prompt: string): Promise<string> => {
    // The prompt is pre-formatted by the calling function to instruct the AI about the mask
    return imageAction(maskedImageUrl, prompt);
};

export const removeObject = (maskedImageUrl: string): Promise<string> => {
    const prompt = "Seamlessly remove the object or area indicated by the semi-transparent red mask. Fill in the area with a realistic and context-aware background that perfectly matches the surrounding image in style, lighting, and texture. Do not add any new objects. The result should be a clean, edited image where the removal is undetectable.";
    return imageAction(maskedImageUrl, prompt);
};

export const expandImage = (expandedCanvasUrl: string, prompt: string): Promise<string> => {
    return imageAction(expandedCanvasUrl, prompt);
};

export const removeBackground = (originalImageUrl: string): Promise<string> => {
    const prompt = "Please remove the background of this image, making it transparent. The main subject should be perfectly preserved. Output a PNG with a transparent background.";
    return imageAction(originalImageUrl, prompt);
};

export const upscaleImage = (originalImageUrl: string): Promise<string> => {
    const prompt = "Upscale this image to a higher resolution. Enhance the details, clarity, and sharpness without adding new elements or changing the style. Make it look like a high-resolution version of the original.";
    return imageAction(originalImageUrl, prompt);
};

export const generateImageMetadata = async (imageUrl: string, prompt: string): Promise<{ title: string; description: string; tags: string[] }> => {
  const aiClient = getAiClient();
  try {
    const { base64Data, mimeType } = parseDataUrl(imageUrl);
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: `Analyze this image, which was generated from the prompt: "${prompt}". Provide a short, catchy title (3-5 words), a one-sentence description, and an array of 5 relevant lowercase tags for searching.` }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'A short, catchy title for the image.' },
            description: { type: Type.STRING, description: 'A one-sentence description of the image.' },
            tags: {
              type: Type.ARRAY,
              description: 'An array of 5 relevant, lowercase tags for searching.',
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text);
    return {
      title: json.title || 'Untitled Artwork',
      description: json.description || 'No description available.',
      tags: Array.isArray(json.tags) ? json.tags : [],
    };
  } catch (error) {
    console.error('Error generating image metadata:', error);
    // Return default metadata on failure
    return {
      title: 'Untitled Artwork',
      description: 'Metadata generation failed.',
      tags: [],
    };
  }
};

export const getPromptInspiration = async (): Promise<string[]> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate 5 highly detailed and visually-rich prompts for an AI image generator, one for each of the following themes in order: "sci-fi cityscape", "fantasy portrait", "abstract nature", "vintage photograph", and "food photography". For the "vintage photograph" theme, ensure the prompt includes details that mimic the aesthetic of old photographs, such as film grain, sepia tones, faded colors, and era-appropriate subjects (e.g., from the 1920s or 1950s).',
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        prompts: {
                            type: Type.ARRAY,
                            description: 'An array of 5 prompt strings.',
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const json = JSON.parse(response.text);
        if (json.prompts && Array.isArray(json.prompts)) {
            return json.prompts;
        }
        throw new Error("Invalid format for prompt inspiration response.");

    } catch (error) {
        console.error("Error getting prompt inspiration:", error);
        return ["Failed to get inspiration. Please try again."];
    }
};

export const generatePromptFromImage = async (imageUrl: string): Promise<string> => {
    const aiClient = getAiClient();
    try {
        const { base64Data, mimeType } = parseDataUrl(imageUrl);
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: mimeType } },
                    { text: "Analyze this image in detail. Generate a rich, descriptive text prompt that could be used with an AI image generator to recreate a similar image. Focus on subject, setting, style, composition, lighting, and mood. Do not include any conversational text, just the prompt itself." }
                ]
            },
        });
        
        if (!response.text.trim()) {
            throw new Error("The model returned an empty prompt.");
        }

        return response.text;
    } catch (error) {
        console.error("Error generating prompt from image with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the prompt from the image.");
    }
};

export const generateBlogPost = async (topic: string, tone: string, length: string, audience: string): Promise<string> => {
  const aiClient = getAiClient();
  try {
    const systemInstruction = `You are an expert blog post writer who outputs clean, semantic HTML. Your task is to generate a complete, well-structured, and engaging blog post based on the user's request. The post should include an <h1> for the title, <p> tags for paragraphs, <h2> tags for main headings, and a concluding paragraph. Do not include <html>, <head>, or <body> tags. Only return the HTML content for the blog post itself, ready to be embedded in a div.`;
    
    const contents = `Generate a blog post in HTML format with the following specifications:
- Topic/Title: ${topic}
- Tone of Voice: ${tone}
- Desired Length: ${length}
- Target Audience: ${audience}

Ensure the output is only the HTML content for the blog post.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    if (!response.text.trim()) {
      throw new Error("The model returned an empty blog post.");
    }

    return response.text;
  } catch (error) {
    console.error("Error generating blog post with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the blog post.");
  }
};