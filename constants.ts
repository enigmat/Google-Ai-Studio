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