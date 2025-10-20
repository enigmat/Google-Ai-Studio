

import { GoogleGenAI, Modality, Type, GenerateContentResponse, LiveServerMessage, Blob, CloseEvent, ErrorEvent } from "@google/genai";

// The AI client is initialized lazily to avoid crashing the app if the API key is missing.
let ai: GoogleGenAI | null = null;

// --- API KEY MANAGEMENT ---
// In a production environment, it is highly recommended to use a backend proxy or serverless function
// to manage the API key securely. This prevents the key from being exposed on the client-side.
// For this self-contained client-side application, the API key is expected to be provided
// through a secure environment variable mechanism by the hosting platform (e.g., Vercel, Netlify).
// This approach is suitable for demos and controlled environments but not for public-facing production apps
// where the key could be compromised.

// Helper to get the API key, throwing an error if it's not set.
const getApiKey = (): string => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set. For security, this application requires the API key to be set in a server-side environment variable (e.g., in your Vercel project settings). It should not be hardcoded in the client-side code.");
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

export interface SocialMediaPost {
  platform: string;
  post_text: string;
  hashtags: string[];
}

export interface BusinessName {
  name: string;
  rationale: string;
}

export interface EmailCampaign {
  subject: string;
  previewText: string;
  body: string;
}

export interface CompanyProfile {
  companyName: string;
  companyDetails: string;
  website: string;
}

export interface EbookIdea {
  title: string;
  logline: string;
  summary: string;
  characters: { name: string; description: string }[];
  themes: string[];
}

export interface VideoScene {
  sceneNumber: number;
  script: string;
  visualDescription: string;
}

export interface MusicVideoScene {
    sceneNumber: number;
    timestamp: string;
    cameraShot: string;
    action: string;
    visualDescription:string;
}

export interface LyricsScene {
  lyric: string;
  visualPrompt: string;
  motionPrompt: string;
}

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
      const imageUrls = response.generatedImages
        .map(img => {
            // FIX: Access imageBytes and mimeType from the nested 'image' property.
            if (img.image?.imageBytes) {
                const base64ImageBytes: string = img.image.imageBytes;
                const mimeType = img.image.mimeType || 'image/png';
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
            console.warn("Received an image object without data:", img);
            return null;
        })
        .filter((url): url is string => url !== null);

      if (imageUrls.length > 0) {
          return imageUrls;
      }
    }

    throw new Error("No images were generated. The response might have been blocked.");
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
            model: 'veo-3.1-fast-generate-preview',
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
            model: 'veo-3.1-fast-generate-preview',
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
// FIX: Implement and export all missing functions required by the application.
// Helper to convert a file to a base64 data URL
const fileToDataUrl = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
            if (!match) {
                return reject(new Error("Invalid data URL format"));
            }
            const mimeType = match[1];
            const base64Data = match[2];
            resolve({ base64Data, mimeType });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

// --- Image Editing ---
export const imageAction = async (imageUrl: string, prompt: string): Promise<string> => {
    const aiClient = getAiClient();
    try {
        const { base64Data, mimeType } = parseDataUrl(imageUrl);
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            const base64ImageBytes: string = imagePart.inlineData.data;
            const imageMimeType = imagePart.inlineData.mimeType || 'image/png';
            return `data:${imageMimeType};base64,${base64ImageBytes}`;
        }
        throw new Error("No image was returned from the image action.");
    } catch (error) {
        console.error("Error performing image action with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during the image action.");
    }
};

export const generateImageFromReference = async (referenceImageUrl: string, prompt: string, negativePrompt?: string, mode?: string): Promise<string> => {
    let finalPrompt = prompt;
    if(mode === 'avatar') {
        finalPrompt = `Create an avatar based on the provided reference image with the following style: ${prompt}. Do not include text.`;
    } else {
        finalPrompt = `Using the provided image as a strong reference for composition, style, and subject, create a new image based on this prompt: "${prompt}".`;
    }

    if (negativePrompt && negativePrompt.trim()) {
        finalPrompt += ` Avoid the following: ${negativePrompt.trim()}`;
    }
    return imageAction(referenceImageUrl, finalPrompt);
};

// --- Metadata and Inspiration ---
export const generateImageMetadata = async (imageUrl: string, prompt: string): Promise<{ title: string, description: string, tags: string[] }> => {
    const aiClient = getAiClient();
    try {
        const { base64Data, mimeType } = parseDataUrl(imageUrl);
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { text: `Analyze the following user prompt and the resulting generated image. Based on both, generate a short, catchy title (5-10 words), a concise description (15-25 words), and 5-7 relevant comma-separated tags.\n\nUSER PROMPT: "${prompt}"\n\nIMAGE:` },
                    { inlineData: { data: base64Data, mimeType } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        tags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['title', 'description', 'tags']
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating image metadata with Gemini API:", error);
        return { // Return default metadata on failure
            title: "AI Generated Artwork",
            description: `An image created from the prompt: "${prompt.substring(0, 100)}..."`,
            tags: ["ai-art", "generated-image"],
        };
    }
};

export const getPromptInspiration = async (): Promise<string[]> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate 3 diverse and creative prompts for an AI image generator. The prompts should be visually descriptive and imaginative. Return a JSON array of strings.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error getting prompt inspiration with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while getting prompt inspiration.");
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
                    { text: "Describe this image in detail, as if you were creating a prompt for an AI image generator. Be descriptive about the subject, style, lighting, and composition." },
                    { inlineData: { data: base64Data, mimeType } }
                ]
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating prompt from image with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating prompt from image.");
    }
};

// --- Product and Marketing Image Generation ---
export const generateUgcProductAd = async (productImageUrl: string, productName: string, productDescription: string): Promise<string> => {
    const prompt = `Create a realistic User-Generated Content (UGC) style ad image. The image should feature the provided product: '${productName}'. The scene should look authentic, as if a real customer is using and enjoying the product in a natural, everyday setting (e.g., at home, outdoors). The product description is: '${productDescription}'.`;
    return imageAction(productImageUrl, prompt);
};

export const generateProductScene = async (productUrl: string, scenePrompt: string): Promise<string> => {
    const prompt = `Place the provided product image (which has a transparent background) into the following scene: "${scenePrompt}". Ensure the lighting, shadows, and perspective of the product realistically match the new background.`;
    return imageAction(productUrl, prompt);
};

export const generateMockup = async (designUrl: string, mockupUrl: string, prompt: string): Promise<string> => {
    const aiClient = getAiClient();
    try {
        const { base64Data: designData, mimeType: designMime } = parseDataUrl(designUrl);
        const { base64Data: mockupData, mimeType: mockupMime } = parseDataUrl(mockupUrl);
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { data: designData, mimeType: designMime } },
                    { inlineData: { data: mockupData, mimeType: mockupMime } },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            const base64ImageBytes: string = imagePart.inlineData.data;
            const imageMimeType = imagePart.inlineData.mimeType || 'image/png';
            return `data:${imageMimeType};base64,${base64ImageBytes}`;
        }
        throw new Error("No image was returned from the mockup generation.");
    } catch (error) {
        console.error("Error generating mockup with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during mockup generation.");
    }
};

// --- Text Generation ---
export const generateBlogPost = async (topic: string, tone: string, length: string, audience: string): Promise<string> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a blog post about "${topic}". The tone should be ${tone}. The desired length is ${length}. The target audience is ${audience}. Format the output as clean HTML with headings, paragraphs, and lists.`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating blog post with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the blog post.");
    }
};

export const generateSocialMediaPost = async (topic: string, platform: string, tone: string, audience: string, includeHashtags: boolean, includeEmojis: boolean): Promise<SocialMediaPost[]> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 social media post variations about "${topic}" for the platform ${platform}. The tone should be ${tone}. The target audience is ${audience}. ${includeHashtags ? 'Include relevant hashtags.' : ''} ${includeEmojis ? 'Include relevant emojis.' : ''}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            platform: { type: Type.STRING },
                            post_text: { type: Type.STRING },
                            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ['platform', 'post_text', 'hashtags']
                    }
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating social media post with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the social media post.");
    }
};

export const generateBusinessNames = async (description: string, keywords: string, style: string): Promise<BusinessName[]> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 5 creative business names for a company with the following description: "${description}". The naming style should be ${style}. Optional keywords to consider: ${keywords}. For each name, provide a brief rationale.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            rationale: { type: Type.STRING }
                        },
                        required: ['name', 'rationale']
                    }
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating business names with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating business names.");
    }
};

export const generateEmailCampaign = async (productName: string, productDescription: string, audience: string, campaignType: string, tone: string, companyProfile: CompanyProfile | null): Promise<EmailCampaign[]> => {
    const aiClient = getAiClient();
    const profileInfo = companyProfile ? `The email is from ${companyProfile.companyName} (${companyProfile.website}), a company that ${companyProfile.companyDetails}.` : '';

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a complete email for a marketing campaign.
- Campaign Type: ${campaignType}
- Product: ${productName} (${productDescription})
- Tone: ${tone}
- Audience: ${audience}
- Company Info: ${profileInfo}
Generate a subject line, a short preview text, and the full email body in clean HTML format. The HTML should be simple, using basic tags like <p>, <h1>, <h2>, <strong>, <a>, etc., and should render well in most email clients. Respond with a JSON array containing one object.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            subject: { type: Type.STRING },
                            previewText: { type: Type.STRING },
                            body: { type: Type.STRING }
                        },
                        required: ['subject', 'previewText', 'body']
                    },
                    minItems: 1,
                    maxItems: 1
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating email campaign with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the email campaign.");
    }
};

export const generateEbookIdea = async (genre: string, audience: string, themes: string, setting: string, protagonist: string): Promise<EbookIdea> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a creative and unique ebook idea based on the following criteria.
- Genre: ${genre}
- Target Audience: ${audience}
- Key Themes: ${themes || 'Not specified'}
- Setting: ${setting || 'Not specified'}
- Protagonist Description: ${protagonist || 'Not specified'}
Provide a compelling title, a one-sentence logline, a 3-paragraph summary, a brief description of 2-3 main characters, and a list of key themes.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'A catchy, genre-appropriate title for the book.' },
                        logline: { type: Type.STRING, description: 'A single, compelling sentence summarizing the core conflict of the story.' },
                        summary: { type: Type.STRING, description: 'A 3-paragraph summary of the plot, covering the setup, confrontation, and resolution.' },
                        characters: {
                            type: Type.ARRAY,
                            description: 'A list of 2-3 main characters.',
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "The character's name." },
                                    description: { type: Type.STRING, description: 'A brief description of the character, including their motivations and role in the story.' }
                                },
                                required: ['name', 'description']
                            }
                        },
                        themes: {
                            type: Type.ARRAY,
                            description: 'A list of 3-5 key themes explored in the story.',
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['title', 'logline', 'summary', 'characters', 'themes']
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating ebook idea with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the ebook idea.");
    }
};


export const generateBlogTopicIdeas = async (category: string): Promise<{topic: string, imagePrompt: string}[]> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on current trends for today, generate 5 trending blog post topic ideas for the category "${category}". For each topic, also provide a creative, visually descriptive prompt suitable for generating a header image for the blog post.`,
            config: {
                tools: [{googleSearch: {}}],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            topic: { type: Type.STRING, description: 'The trending blog post topic.' },
                            imagePrompt: { type: Type.STRING, description: 'A visually descriptive prompt to generate a header image for the topic.' }
                        },
                        required: ['topic', 'imagePrompt']
                    }
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating blog topic ideas with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating blog topic ideas.");
    }
};

export const generateRecipePost = async (dish: string, cuisine: string, prepTime: string, dietary: string[]): Promise<string> => {
    const aiClient = getAiClient();

    const dietaryInfo = dietary.length > 0 ? `It should be suitable for the following diets: ${dietary.join(', ')}.` : '';
    const cuisineInfo = cuisine ? `The cuisine style is ${cuisine}.` : '';
    const prepTimeInfo = prepTime ? `The total prep and cook time should be ${prepTime}.` : '';

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a friendly and engaging blog post for a recipe.
- The dish is: "${dish}".
- ${cuisineInfo}
- ${prepTimeInfo}
- ${dietaryInfo}

The post should have:
1. A warm, engaging introduction to the dish.
2. A list of ingredients under an "Ingredients" heading, formatted as an HTML unordered list (<ul><li>...</li></ul>).
3. Step-by-step cooking instructions under an "Instructions" heading, formatted as an HTML ordered list (<ol><li>...</li></ol>).
4. A concluding paragraph with serving suggestions or tips.

Format the entire output as clean, well-structured HTML, using <h1> for the title, <h2> for subheadings, and <p> for paragraphs.`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating recipe post with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the recipe post.");
    }
};

// --- Video Scripting ---
export const generateVideoScriptFromText = async (textContent: string): Promise<{ scenes: VideoScene[] }> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following text and break it down into a 5-scene video script for a short explainer video. For each scene, provide a scene number, a short voiceover script, and a detailed description of the visuals that should be generated.
TEXT: """${textContent}"""`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scenes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    sceneNumber: { type: Type.INTEGER },
                                    script: { type: Type.STRING },
                                    visualDescription: { type: Type.STRING },
                                },
                                required: ['sceneNumber', 'script', 'visualDescription']
                            }
                        }
                    },
                    required: ['scenes']
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating video script with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the video script.");
    }
};

export const generateMusicVideoScript = async (songDescription: string, artistGender: string, songLength: number): Promise<{ scenes: MusicVideoScene[] }> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a 5-scene music video storyboard for a song with the following description: "${songDescription}". The artist/protagonist is ${artistGender}. The song is ${songLength} seconds long. For each scene, provide the scene number, a timestamp (e.g., "0:00-0:15"), a camera shot description, a description of the action, and a detailed description of the visuals.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scenes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    sceneNumber: { type: Type.INTEGER },
                                    timestamp: { type: Type.STRING },
                                    cameraShot: { type: Type.STRING },
                                    action: { type: Type.STRING },
                                    visualDescription: { type: Type.STRING },
                                },
                                required: ['sceneNumber', 'timestamp', 'cameraShot', 'action', 'visualDescription']
                            }
                        }
                    },
                    required: ['scenes']
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating music video script with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the music video script.");
    }
};

export const generateLyricsStoryboard = async (lyrics: string): Promise<{ scenes: LyricsScene[] }> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following song lyrics and create a storyboard for a short animated video. Break the lyrics into key thematic scenes (around 5-8 scenes). For each scene, provide the specific lyric line, a detailed visual prompt for an AI image generator (do not include text in the visual), and a short motion prompt (e.g., 'slow zoom in', 'pan left to right').
LYRICS: """${lyrics}"""`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scenes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    lyric: { type: Type.STRING },
                                    visualPrompt: { type: Type.STRING },
                                    motionPrompt: { type: Type.STRING },
                                },
                                required: ['lyric', 'visualPrompt', 'motionPrompt']
                            }
                        }
                    },
                    required: ['scenes']
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating lyrics storyboard with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the lyrics storyboard.");
    }
};

// --- Audio ---

export const generateLipSyncVideo = async (imageUrl: string, audioFile: File): Promise<string> => {
    // NOTE: Gemini does not currently have a direct "lip sync" API. 
    // This is a placeholder for a feature that would require a different model or service.
    // For this app, we'll throw an informative error.
    console.error("generateLipSyncVideo is not implemented with the current Gemini API.");
    throw new Error("Lip Sync video generation is not supported by the Gemini API at this time.");
};


export const startAudioTranscriptionSession = (callbacks: {
    onOpen: () => void;
    onTranscriptionUpdate: (chunk: string, isTurnComplete: boolean) => void;
    onError: (error: Error) => void;
    onClose: () => void;
}) => {
    const aiClient = getAiClient();

    const sessionPromise = aiClient.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: callbacks.onOpen,
            onmessage: (message: LiveServerMessage) => {
                const text = message.serverContent?.inputTranscription?.text;
                const turnComplete = message.serverContent?.turnComplete;
                if (text) {
                    callbacks.onTranscriptionUpdate(text, !!turnComplete);
                }
            },
            onerror: (e: ErrorEvent) => callbacks.onError(new Error(e.message || "An unknown live session error occurred.")),
            onclose: (e: CloseEvent) => callbacks.onClose(),
        },
        config: {
            responseModalities: [Modality.AUDIO], // Required for live, but we only care about transcription
            inputAudioTranscription: {},
        },
    });

    const createBlob = (data: Float32Array): Blob => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        const bytes = new Uint8Array(int16.buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return {
            data: btoa(binary),
            mimeType: 'audio/pcm;rate=16000',
        };
    };

    return { sessionPromise, createBlob };
};

export const transcribeAudioFromFile = async (audioFile: File): Promise<string> => {
    const aiClient = getAiClient();
    try {
        const { base64Data, mimeType } = await fileToDataUrl(audioFile);
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: "Transcribe the following audio file completely and accurately." },
                    { inlineData: { data: base64Data, mimeType } }
                ]
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error transcribing audio file with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while transcribing the audio file.");
    }
};