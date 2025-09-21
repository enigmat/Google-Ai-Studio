

export type GeneratorMode = 'text-to-image' | 'ugc-ad' | 'text-to-video' | 'animate-image' | 'image-to-prompt' | 'creative-chat' | 'product-studio' | 'tshirt-mockup' | 'blog-post' | 'social-media-post' | 'avatar-generator';

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
  { id: 'white', name: 'White T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDAwIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNNTAgMjBjMCAyNSAxMDAgMjUgMTAwIDBMMTYwIDMwbDIwIDEwLTEwIDE0MEgzMEwyMCA0MGwyMC0xMHoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNFMUUwRTAiIHN0cm9rZS13aWR0aD0iNCIgZD0iTTc1IDIwYzAgMjAgNTAgMjAgNTAgMCIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik01MCAyMGMwIDI1IDEwMCAyNSAxMDAgMEwxNjAgMzBsMjAgMTAtMTAgMTQwSDMwTDIwIDQwbDIwLTEweiIvPjxwYXRoIGZpbGw9IiMwMDAiIG9wYWNpdHk9Ii4wNSIgZD0iTTMwIDE4MGMxMC0xMCAzMC01IDQwIDBsLTIwIDEweiIvPjxwYXRoIGZpbGw9IiMwMDAiIG9wYWNpdHk9Ii4wNSIgZD0iTTE3MCAxODBjLTEwLTEwLTMwLTUtNDAgMGwyMCAxMHoiLz48L3N2Zz4=' },
  { id: 'black', name: 'Black T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGZpbGw9IiMyMTIxMjEiIGQ9Ik01MCAyMGMwIDI1IDEwMCAyNSAxMDAgMEwxNjAgMzBsMjAgMTAtMTAgMTQwSDMwTDIwIDQwbDIwLTEweiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQyNDI0MiIgc3Ryb2tlLXdpZHRoPSI0IiBkPSJNNzUgMjBjMCAyMCA1MCAyMCA1MCAwIi8+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTUwIDIwYzAgMjUgMTAwIDI1IDEwMCAwTDE2MCAzMGwyMCAxMC0xMCAxNDBIMzBMMjAgNDBsMjAtMTB6Ii8+PC9zdmc+' },
  { id: 'grey', name: 'Grey T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDAwIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSIjOUU5QjlFIiBkPSJNNTAgMjBjMCAyNSAxMDAgMjUgMTAwIDBMMTYwIDMwbDIwIDEwLTEwIDE0MEgzMEwyMCA0MGwyMC0xMHoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM3NTc1NzUiIHN0cm9rZS13aWR0aD0iNCIgZD0iTTc1IDIwYzAgMjAgNTAgMjAgNTAgMCIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik01MCAyMGMwIDI1IDEwMCAyNSAxMDAgMEwxNjAgMzBsMjAgMTAtMTAgMTQwSDMwTDIwIDQwbDIwLTEweiIvPjwvc3ZnPg==' },
];

export const BLOG_TONES = ['Professional', 'Casual', 'Enthusiastic', 'Informative', 'Formal', 'Humorous'];
export const SOCIAL_MEDIA_PLATFORMS = ['Twitter/X', 'LinkedIn', 'Instagram'];

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