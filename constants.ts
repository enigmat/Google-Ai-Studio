

export type GeneratorMode = 'text-to-image' | 'ugc-ad' | 'text-to-video' | 'animate-image' | 'image-to-prompt' | 'creative-chat' | 'product-studio' | 'tshirt-mockup' | 'blog-post' | 'avatar-generator' | 'ebook-generator' | 'book-cover-generator' | 'ebook-manager';

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
  { name: 'Fantasy', promptSuffix: ', fantasy art, epic, magical, ethereal lighting, mythical creatures, detailed armor, Lord of the Rings inspired' }
];

export const ASPECT_RATIOS = ['1:1', '16:9', '9:16'] as const;

export const VIDEO_STYLES = [
  { name: 'None', promptSuffix: '' },
  { name: 'Cinematic', promptSuffix: ', cinematic, dramatic lighting, epic score, high contrast, wide-angle shot' },
  { name: 'Cartoonish', promptSuffix: ', cartoon style, vibrant colors, exaggerated motion, 2D animation look, stylised' },
  { name: 'Documentary', promptSuffix: ', documentary style, handheld camera feel, natural lighting, realistic motion' },
  { name: 'Abstract', promptSuffix: ', abstract, surreal, non-representational, fluid motion, experimental visuals' },
];

export const TSHIRT_MOCKUPS = [
  { id: 'white', name: 'White T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InNoYWRvdyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDA7c3RvcC1vcGFjaXR5OjAuMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sbG9yOiMwMDA7c3RvcC1vcGFjaXR5OjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNNTAgMjAgQyA1MCA0NSwgMTUwIDQ1LCAxNTAgMjAgTCAxNjAgMzAgTCAxODAgNDAgTCAxNzAgMTgwIEwgMzAgMTgwIEwgMjAgNDAgTCA0MCAzMCBaIiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTc1IDIwIEMgNzUgNDAsIDEyNSA0MCwgMTI1IDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNFMUUwRTAiIHN0cm9rZS13aWR0aD0iNCIvPjxwYXRoIGQ9Ik01MCAyMCBDIDUwIDQ1LCAxNTAgNDVzLCAxNTAgMjAgTCAxNjAgMzAgTCAxODAgNDAgTCAxNzAgMTgwIEwgMzAgMTgwIEwgMjAgNDAgTCA0MCAzMCBaIiBmaWxsPSJ1cmwoI3NoYWRvdykiLz48cGF0aCBkPSJNMzAsMTgwIEM0MCwxNzAgNjAsMTc1IDcwLDE4MCBMNTAsMTkwIFoiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuMDUiLz48cGF0aCBkPSJNMTcwLDE4MCBDMTYwLDE3MCAxNDAsMTc1IDEzMCwxODAgTDE1MCwxOTAgWiIgZmlsbD0iIzAwMDAwMCIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==' },
  { id: 'black', name: 'Black T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImhpZ2hsaWdodCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRjtzdG9wLW9wYWNpdHk6MC4xIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGO3N0b3Atb3BhY2l0eTowIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTUwIDIwIEMgNTAgNDUsIDE1MCA0NSwgMTUwIDIwIEwgMTYwIDMwIEwgMTgwIDQwIEwgMTcwIDE4MCBMIDMwIDE4MCBMIDIwIDQwIEwgNDAgMzAgWiIgZmlsbD0iIzIxMjEyMSIvPjxwYXRoIGQ9Ik03NSAyMCBDIDc1IDQwLCAxMjUgNDAsIDEyNSAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDI0MjQyIiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNNTAgMjAgQyA1MCA0NSwgMTUwIDQ1LCAxNTAgMjAgTCAxNjAgMzAgTCAxODAgNDAgTCAxNzAgMTgwIEwgMzAgMTgwIEwgIDIwIDQwIEwgNDAgMzAgWiIgZmlsbD0idXJsKCNoaWdobGlnaHQpIi8+PC9zdmc+' },
  { id: 'grey', name: 'Grey T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InNoYWRvdy1ncmV5IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDtzdG9wLW9wYWNpdHk6MC4xIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwO3N0b3Atb3BhY2l0eTowIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTUwIDIwIEMgNTAgNDUsIDE1MCA0NSwgMTUwIDIwIEwgMTYwIDMwIEwgMTgwIDQwIEwgMTcwIDE4MCBMIDMwIDE4MCBMIDIwIDQwIEwgNDAgMzAgWiIgZmlsbD0iIzlFOUI5RSIvPjxwYXRoIGQ9Ik03NSAyMCBDIDc1IDQwLCAxMjUgNDAsIDEyNSAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzU3NTc1IiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNNTAgMjAgQyA1MCA0NSwgMTUwIDQ1LCAxNTAgMjAgTCAxNjAgMzAgTCAxODAgNDAgTCAxNzAgMTgwIEwgMzAgMTgwIEwgMjAgNDAgTCA0MCAzMCBaIiBmaWxsPSJ1cmwoI3NoYWRvdy1ncmV5KSIvPjwvc3ZnPg==' },
];

export const BLOG_TONES = ['Professional', 'Casual', 'Enthusiastic', 'Informative', 'Formal', 'Humorous'];

export const BLOG_LENGTHS = ['Short (~300 words)', 'Medium (~600 words)', 'Long (~1000 words)'];

export const AVATAR_GENDERS = ['Male', 'Female', 'Non-binary'];
export const AVATAR_AGES = ['Child', 'Teenager', 'Young Adult', 'Adult', 'Elderly'];
export const AVATAR_HAIR_STYLES = ['Short', 'Medium', 'Long', 'Bald', 'Buzzcut', 'Curly', 'Straight', 'Wavy', 'Braids'];
export const AVATAR_COLORS = ['Black', 'Brown', 'Blonde', 'Red', 'Grey', 'White', 'Blue', 'Green', 'Pink', 'Purple'];
export const AVATAR_ART_STYLES = [
  { name: 'Photorealistic', value: 'hyperrealistic portrait, photorealistic, 8K HDR, professional photography, sharp focus, detailed skin texture' },
  { name: 'Anime', value: 'anime art style, cel shaded, vibrant colors, detailed eyes, masterpiece, from a high-budget anime film' },
  { name: 'Cartoon', value: 'disney pixar style, cartoon character, 3d render, vibrant, cute' },
  { name: 'Pixel Art', value: '16-bit pixel art character portrait, detailed, vibrant colors' },
  { name: 'Fantasy Art', value: 'fantasy art portrait, D&D character art, epic, magical, detailed armor' },
  { name: 'Watercolor', value: 'watercolor painting portrait, soft wash, paper texture, artistic' }
];

export const BOOK_COVER_STYLES = [
  'Photographic', 'Minimalist', 'Vector Art', 'Fantasy Painting', 'Sci-Fi Illustration', 'Vintage', 'Abstract'
];