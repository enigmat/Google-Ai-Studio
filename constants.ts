


export type GeneratorMode = 'text-to-image' | 'ugc-ad' | 'text-to-video' | 'animate-image' | 'image-to-prompt' | 'creative-chat' | 'product-studio' | 'tshirt-mockup' | 'blog-post' | 'social-media-post' | 'avatar-generator' | 'image-variations' | 'flyer-generator' | 'explainer-video' | 'logo-generator' | 'thumbnail-generator' | 'video-green-screen' | 'recreate-thumbnail' | 'music-video' | 'wall-art-mockup';

export const EXAMPLE_PROMPTS = [
  "A majestic lion with a cosmic mane",
  "Floating islands in a twilight sky",
  "A cyberpunk city street at night in the rain",
  "An enchanted forest with glowing mushrooms",
  "A robot orchestra playing classical music"
];

export const STYLES = [
  { name: 'None', promptSuffix: '' },
  { name: 'Photorealistic', promptSuffix: ', hyperrealistic, photorealistic, 8K HDR, professional photography, sharp focus, detailed' },
  { name: 'Anime', promptSuffix: ', anime art style, cel shaded, vibrant colors, detailed background, masterpiece, from a high-budget anime film' },
  { name: 'Watercolor', promptSuffix: ', watercolor painting, soft wash, wet-on-wet technique, paper texture, vibrant colors, artistic' },
  { name: 'Cyberpunk', promptSuffix: ', cyberpunk aesthetic, neon lighting, futuristic city, dystopian, high-tech, Blade Runner style, cinematic' },
  { name: 'Fantasy', promptSuffix: ', fantasy art, epic, magical, ethereal lighting, mythical creatures, detailed armor, Lord of the Rings inspired' },
  { name: '3D Model', promptSuffix: ', 3D model, Blender render, Octane render, high detail, physically-based rendering (PBR), polished' },
  { name: 'Pixel Art', promptSuffix: ', 16-bit pixel art, detailed, vibrant color palette, retro gaming style, sprite' },
  { name: 'Minimalist', promptSuffix: ', minimalist, clean lines, simple, elegant, negative space, vector art' },
  { name: 'Steampunk', promptSuffix: ', steampunk, victorian, gears, cogs, steam-powered, intricate details, brass and copper' },
  { name: 'Vintage Photo', promptSuffix: ', vintage photograph, 1950s, sepia tone, grainy, faded colors, classic car, retro fashion' },
  { name: 'Comic Book', promptSuffix: ', comic book art, graphic novel style, bold outlines, halftone dots, vibrant colors, dynamic action' },
  { name: 'Line Art', promptSuffix: ', line art, black and white, clean lines, simple, elegant, minimalist drawing' },
  { name: 'Digital Painting', promptSuffix: ', digital painting, masterpiece, concept art, detailed, complex, ArtStation trending' }
];

// FIX: Added constants for various generator components.
export const BLOG_TONES = ['Professional', 'Casual', 'Friendly', 'Humorous', 'Informative', 'Witty'];
export const BLOG_LENGTHS = ['Short (~300 words)', 'Medium (~600 words)', 'Long (~1000 words)'];
export const SOCIAL_MEDIA_PLATFORMS = ['Twitter/X', 'LinkedIn', 'Instagram'];
export const LOGO_STYLES = ['Minimalist', 'Geometric', 'Mascot', 'Abstract', 'Vintage', 'Modern'];
export const AVATAR_GENDERS = ['Female', 'Male', 'Non-binary'];
export const AVATAR_AGES = ['Child', 'Teenager', 'Young Adult', 'Adult', 'Elderly'];
export const AVATAR_HAIR_STYLES = ['Short and neat', 'Medium-length wavy', 'Long and straight', 'Curly afro', 'Top knot bun', 'Braids', 'Bald'];
export const AVATAR_COLORS = ['Black', 'Brown', 'Blonde', 'Red', 'Blue', 'Green', 'Purple', 'White', 'Silver'];
export const AVATAR_ART_STYLES = [
  { name: 'Photorealistic', value: 'hyperrealistic, photorealistic, 8K HDR, professional photography, sharp focus' },
  { name: 'Digital Painting', value: 'digital painting, concept art, detailed, ArtStation trending' },
  { name: 'Anime', value: 'anime art style, cel shaded, vibrant colors, from a high-budget anime film' },
  { name: '3D Character', value: '3D model, Blender render, character design, polished, Pixar style' },
  { name: 'Comic Book', value: 'comic book art, graphic novel style, bold outlines, halftone dots' },
];

export const ASPECT_RATIOS = ['1:1', '16:9', '9:16'] as const;

export const VARIATION_COUNTS = [4, 8, 12] as const;

export const VIDEO_STYLES = [
  { name: 'None', promptSuffix: '' },
  { name: 'Cinematic', promptSuffix: ', cinematic, dramatic lighting, epic score, high contrast, wide-angle shot' },
  { name: 'Cartoonish', promptSuffix: ', cartoon style, vibrant colors, exaggerated motion, 2D animation look, stylised' },
  { name: 'Documentary', promptSuffix: ', documentary style, handheld camera feel, natural lighting, realistic motion' },
  { name: 'Abstract', promptSuffix: ', abstract, surreal, non-representational, fluid motion, experimental visuals' },
];

export const FLYER_STYLES = ['Modern & Clean', 'Bold & Energetic', 'Elegant & Minimalist', 'Retro & Funky', 'Corporate & Professional'];

export const THUMBNAIL_STYLES = [
  { name: 'Bold & Punchy', description: 'High contrast, dramatic lighting, and dynamic text. Great for reaction videos and challenges.', promptSuffix: 'dramatic lighting, high contrast, bold sans-serif fonts, dynamic composition' },
  { name: 'Clean & Minimalist', description: 'Simple, elegant design with lots of clean space. Ideal for educational or business content.', promptSuffix: 'minimalist design, sans-serif fonts, generous white space, clean lines, simple color palette' },
  { name: 'Gaming', description: 'Vibrant, energetic, and action-packed. Perfect for gameplay videos and live streams.', promptSuffix: 'vibrant neon colors, futuristic fonts, energetic, action-packed scene' },
  { name: 'Tech Review', description: 'Modern, professional, and sleek. Suitable for product reviews and tech tutorials.', promptSuffix: 'clean layout, modern fonts, professional, high-tech aesthetic, blue and silver color scheme' },
  { name: 'Vlog', description: 'Friendly and approachable style. Often features a person and casual text.', promptSuffix: 'friendly and approachable style, handwritten or casual fonts, a realistic and inviting scene' },
  { name: 'Documentary', description: 'Serious, cinematic, and informative. Uses high-quality imagery and formal text.', promptSuffix: 'serious and informative tone, serif fonts, cinematic lighting, realistic imagery' }
];

export const TSHIRT_MOCKUPS = [
  { id: 'white', name: 'White T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDAwIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNNTAgMjBjMCAyNSAxMDAgMjUgMTAwIDBMMTYwIDMwbDIwIDEwLTEwIDE0MEgzMEwyMCA0MGwyMC0xMHoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNFMUUwRTAiIHN0cm9rZS11aWR0aD0iNCIgZD0iTTc1IDIwYzAgMjAgNTAgMjAgNTAgMCIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik01MCAyMGMwIDI1IDEwMCAyNSAxMDAgMEwxNjAgMzBsMjAgMTAtMTAgMTQwSDMwTDIwIDQwbDIwLTEweiIvPjxwYXRoIGZpbGw9IiMwMDAiIG9wYWNpdHk9Ii4wNSIgZD0iTTMwIDE4MGMxMC0xMCAzMC01IDQwIDBsLTIwIDEweiIvPjxwYXRoIGZpbGw9IiMwMDAiIG9wYWNpdHk9Ii4wNSIgZD0iTTE3MCAxODBjLTEwLTEwLTMwLTUtNDAgMGwyMCAxMHoiLz48L3N2Zz4=' },
  { id: 'black', name: 'Black T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGZpbGw9IiMyMTIxMjEiIGQ9Ik01MCAyMGMwIDI1IDEwMCAyNSAxMDAgMEwxNjAgMzBsMjAgMTAtMTAgMTQwSDMwTDIwIDQwbDIwLTEweiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQyNDI0MiIgc3Ryb2tlLXdpZHRoPSI0IiBkPSJNNzUgMjBjMCAyMCA1MCAyMCA1MCAwIi8+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTUwIDIwYzAgMjUgMTAwIDI1IDEwMCAwTDE2MCAzMGwyMCAxMC0xMCAxNDBIMzBMMjAgNDBsMjAtMTB6Ii8+PC9zdmc+' },
  { id: 'grey', name: 'Grey T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGZpbGw9IiNhMGEwYTAiIGQ9Ik01MCAyMGMwIDI1IDEwMCAyNSAxMDAgMEwxNjAgMzBsMjAgMTAtMTAgMTQwSDMwTDIwIDQwbDIwLTEweiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2M1YzVjNSIgc3Ryb2tlLXdpZHRoPSI0IiBkPSJNNzUgMjBjMCAyMCA1MCAyMCA1MCAwIi8+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTUwIDIwYzAgMjUgMTAwIDI1IDEwMCAwTDE2MCAzMGwyMCAxMC0xMCAxNDBIMzBMMjAgNDBsMjAtMTB6Ii8+PC9zdmc+' },
];
