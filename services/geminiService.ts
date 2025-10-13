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

// FIX: Added missing type definitions for storyboard and social media features.
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

// FIX: Implemented the function to return a value, resolving the compilation error.
export const generateImageFromReference = async (referenceImageUrl: string, prompt: string, negativePrompt?: string, context?: 'avatar'): Promise<string> => {
    let finalPrompt = prompt;
    if (context === 'avatar') {
        finalPrompt = `Use the provided photo as a strong reference for the person's facial features and likeness. Generate a new image that closely matches the person but in this new style: ${prompt}.`;
    }
    if (negativePrompt && negativePrompt.trim()) {
        finalPrompt += `. Avoid: ${negativePrompt.trim()}`;
    }
    return imageAction(referenceImageUrl, finalPrompt);
};

// FIX: Added missing service functions. These are wrappers around the generic 'imageAction' or text generation models.
export const editImage = (maskedImageUrl: string, prompt: string): Promise<string> => imageAction(maskedImageUrl, prompt);
export const removeBackground = (imageUrl: string): Promise<string> => imageAction(imageUrl, "remove the background, make it transparent");
export const upscaleImage = (imageUrl: string): Promise<string> => imageAction(imageUrl, "Upscale this image to a higher resolution, enhance details, make it 4k, sharp focus");
export const expandImage = (expandedCanvasUrl: string, prompt: string): Promise<string> => imageAction(expandedCanvasUrl, prompt || "Fill in the transparent areas seamlessly, continuing the existing image.");
export const removeObject = (maskedImageUrl: string): Promise<string> => imageAction(maskedImageUrl, "remove the masked object and realistically fill in the background");
export const generateUgcProductAd = (productImageUrl: string, productName: string, productDescription: string): Promise<string> => {
    const prompt = `Create a user-generated content (UGC) style ad featuring this product: ${productName}. Description: ${productDescription}. The image should look like an authentic social media post, possibly with a person subtly interacting with the product in a lifestyle setting. Bright, natural lighting.`;
    return imageAction(productImageUrl, prompt);
};
export const generateProductScene = (productUrl: string, scenePrompt: string): Promise<string> => imageAction(productUrl, `Place this product with a transparent background realistically into the following scene: ${scenePrompt}. Ensure lighting and shadows on the product match the new background.`);
export const generateMockup = async (designUrl: string, mockupUrl: string): Promise<string> => {
    const prompt = 'Apply the second image (the design) onto the first image (the t-shirt). The design should conform realistically to the fabric, including wrinkles and lighting.';
    const { base64Data: designData, mimeType: designMime } = parseDataUrl(designUrl);
    const { base64Data: mockupData, mimeType: mockupMime } = parseDataUrl(mockupUrl);
    return processImageEditingResponse(await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [{ inlineData: { data: mockupData, mimeType: mockupMime } }, { inlineData: { data: designData, mimeType: designMime } }, { text: prompt },] },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    }));
};
export const generateImageMetadata = async (imageUrl: string, usedPrompt: string): Promise<{ title: string; description: string; tags: string[] }> => {
  const { base64Data, mimeType } = parseDataUrl(imageUrl);
  const response = await getAiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: `Based on this image and the prompt used to create it ("${usedPrompt}"), generate a short, catchy title (under 10 words), a one-sentence description, and 5 relevant keyword tags.` }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, tags: { type: Type.ARRAY, items: { type: Type.STRING } } } },
    },
  });
  return JSON.parse(response.text);
};
export const getPromptInspiration = async (): Promise<string[]> => JSON.parse((await getAiClient().models.generateContent({ model: 'gemini-2.5-flash', contents: 'Generate 3 highly creative and visually interesting prompts for an AI image generator. Each prompt should be a single sentence.', config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } } })).text);
export const generatePromptFromImage = async (imageUrl: string): Promise<string> => {
    const { base64Data, mimeType } = parseDataUrl(imageUrl);
    return (await getAiClient().models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: 'Describe this image in detail to create a prompt for an AI image generator. Include details about the subject, setting, style, lighting, and composition.' }] } })).text;
};

export const generateBlogTopicIdeas = async (category: string): Promise<string[]> => {
    const aiClient = getAiClient();
    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 5 interesting and engaging blog post topic ideas for the category: ${category}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating blog topic ideas with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating blog topic ideas.");
    }
};

export const generateBlogPost = async (topic: string, tone: string, length: string, audience: string): Promise<string> => {
    const audienceText = audience.trim() ? ` for an audience of ${audience.trim()}` : '';
    return (await getAiClient().models.generateContent({ model: 'gemini-2.5-flash', contents: `Write a blog post about "${topic}". The tone should be ${tone}, the length should be approximately ${length}, and it should be written${audienceText}. The output must be formatted in clean HTML, including h1, h2, p, and ul/li tags. Do not include <!DOCTYPE>, <html>, <head>, or <body> tags. Start directly with the <h1> title tag.` })).text;
};
export const generateSocialMediaPost = async (topic: string, platform: string, tone: string, audience: string, includeHashtags: boolean, includeEmojis: boolean): Promise<SocialMediaPost[]> => {
    const audienceText = audience.trim() ? ` for an audience of ${audience.trim()}` : '';
    const hashtagsText = includeHashtags ? 'and relevant hashtags' : '';
    const emojisText = includeEmojis ? 'and appropriate emojis' : '';
    const response = await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate 3 social media posts about "${topic}" for the platform ${platform}. The tone should be ${tone}${audienceText}. Include the text of the post ${hashtagsText} ${emojisText}.`,
        config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: { type: Type.STRING }, post_text: { type: Type.STRING }, hashtags: { type: Type.ARRAY, items: { type: Type.STRING } } } } } },
    });
    return JSON.parse(response.text);
};

export const generateBusinessNames = async (description: string, keywords: string, style: string): Promise<BusinessName[]> => {
    const aiClient = getAiClient();
    try {
        const keywordText = keywords.trim() ? ` It should incorporate or be inspired by these keywords: "${keywords}".` : '';
        const prompt = `Generate 10 creative business names for a company with the following description: "${description}". The naming style should be ${style}.${keywordText} For each name, provide a short, one-sentence rationale explaining why it's a good fit.`;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: 'The suggested business name.'
                            },
                            rationale: {
                                type: Type.STRING,
                                description: 'A brief explanation for the name suggestion.'
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating business names with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating business names.");
    }
};

export const generateEmailCampaign = async (productName: string, productDescription: string, audience: string, campaignType: string, tone: string): Promise<EmailCampaign[]> => {
    const aiClient = getAiClient();
    try {
        const audienceText = audience.trim() ? ` The target audience is ${audience}.` : '';
        const prompt = `Generate 3 complete, distinct email variations for a "${campaignType}" campaign about a product/service named "${productName}". 
        Description: "${productDescription}".${audienceText} The tone should be ${tone}.
        For each variation, provide a compelling subject line, a short and enticing preview text (under 150 characters), and a full email body formatted in clean, modern HTML. The HTML should be self-contained and use inline styles for maximum compatibility. Include headings, paragraphs, and a clear call-to-action button.`;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
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
                        required: ["subject", "previewText", "body"]
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating email campaign with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the email campaign.");
    }
};


export const generateVideoScriptFromText = async (textContent: string): Promise<{ scenes: VideoScene[] }> => {
    const response = await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the following text, create a storyboard script for a short explainer video. Break it down into logical scenes. For each scene, provide a scene number, a short voiceover script (one or two sentences), and a description of the visuals. Text: "${textContent}"`,
        config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { scenes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { sceneNumber: { type: Type.INTEGER }, script: { type: Type.STRING }, visualDescription: { type: Type.STRING } } } } } } },
    });
    return JSON.parse(response.text);
};
export const generateMusicVideoScript = async (songDescription: string, artistGender: string, songLength: number): Promise<{ scenes: MusicVideoScene[] }> => {
    const response = await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a 5-scene storyboard for a music video. The song is ${songLength} seconds long. The artist is ${artistGender}. The song's theme is: "${songDescription}". For each scene, provide a scene number, timestamp (e.g., 0:00-0:06), camera shot type, a description of the action, and a detailed visual description suitable for an AI video generator.`,
        config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { scenes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { sceneNumber: { type: Type.INTEGER }, timestamp: { type: Type.STRING }, cameraShot: { type: Type.STRING }, action: { type: Type.STRING }, visualDescription: { type: Type.STRING } } } } } } },
    });
    return JSON.parse(response.text);
};
export const generateLyricsStoryboard = async (lyrics: string): Promise<{ scenes: LyricsScene[] }> => {
    const response = await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the following song lyrics and break them down into 4-6 visually distinct scenes for a music video. For each scene, provide:
        1. 'lyric': The key lyric line(s) for that scene (keep it short).
        2. 'visualPrompt': A detailed, rich, and creative prompt for an AI image generator to create the scene's main visual.
        3. 'motionPrompt': A simple, brief description of motion for the video (e.g., 'slow zoom in', 'camera pans left', 'subtle shimmering effect').
        
        Lyrics: "${lyrics}"`,
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
                                motionPrompt: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        },
    });
    return JSON.parse(response.text);
};

export const generateLipSyncVideo = async (imageUrl: string, audioFile: File): Promise<string> => {
    try {
        // Step 1: Transcribe audio to text.
        const transcribedText = await transcribeAudioFromFile(audioFile);
        if (!transcribedText || !transcribedText.trim()) {
            throw new Error("Audio transcription returned empty text. Cannot generate video.");
        }

        // Step 2: Get audio duration to pass to the video generator.
        const duration = await new Promise<number>((resolve, reject) => {
            const audio = new Audio(URL.createObjectURL(audioFile));
            audio.onloadedmetadata = () => {
                // Veo has a max duration, clamp it to the app's max setting.
                resolve(Math.min(audio.duration, 8)); 
            };
            audio.onerror = (e) => reject(new Error("Could not determine audio duration."));
        });
        
        // Step 3: Create a prompt for the video generation model.
        const prompt = `Animate the person in this image to look like they are speaking the following words, with natural mouth movements and facial expressions that match the tone: "${transcribedText}"`;

        // Step 4: Generate the video using the image, new prompt, and duration.
        // We generate the full video directly, as a preview might not be representative.
        const videoUrl = await generateVideoFromImage(imageUrl, prompt, Math.ceil(duration), false);

        return videoUrl;
    } catch (error) {
        console.error("Error generating lip sync video:", error);
        if (error instanceof Error) {
            throw new Error(`Lip Sync Generation Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the lip sync video.");
    }
};

// --- Audio Transcription Service ---

/**
 * Converts a File object to a GoogleGenerativeAI.Part object for the API.
 * @param file The audio or video file to convert.
 * @returns A promise that resolves with the Part object.
 */
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const transcribeAudioFromFile = async (audioFile: File): Promise<string> => {
  const aiClient = getAiClient();
  try {
    const audioPart = await fileToGenerativePart(audioFile);
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: "Transcribe this audio recording." },
          audioPart
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error transcribing audio file with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while transcribing the audio file.");
  }
};

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const startAudioTranscriptionSession = (callbacks: {
    onTranscriptionUpdate: (chunk: string, isTurnComplete: boolean) => void;
    onError: (error: Error) => void;
    onClose: () => void;
    onOpen: () => void;
}) => {
    const aiClient = getAiClient();
    const sessionPromise = aiClient.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: callbacks.onOpen,
            onmessage: (message: LiveServerMessage) => {
                // The model might send audio responses even if we only care about transcription.
                // We don't need to process them here.
                if (message.serverContent?.inputTranscription) {
                    callbacks.onTranscriptionUpdate(message.serverContent.inputTranscription.text, false);
                }
                if (message.serverContent?.turnComplete) {
                    callbacks.onTranscriptionUpdate('', true);
                }
            },
            onerror: (e: ErrorEvent) => callbacks.onError(new Error('Audio session error. Please check your connection and try again.')),
            onclose: (e: CloseEvent) => callbacks.onClose(),
        },
        config: {
            responseModalities: [Modality.AUDIO], // This is required by the API
            inputAudioTranscription: {},
            systemInstruction: 'You are a highly accurate and fast transcription service. Only transcribe what the user says. Do not respond or have a conversation.',
        },
    });
    return { sessionPromise, createBlob };
};