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
  { id: 'white', name: 'White T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InNoYWRvdyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDA7c3RvcC1vcGFjaXR5OjAuMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDtzdG9wLW9wYWNpdHk6MCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik01MCAyMCBDIDUwIDQ1LCAxNTAgNDUsIDE1MCAyMCBMIDE2MCAzMCBMIDE4MCA0MCBMIDE3MCAxODAgTCAzMCAxODAgTCAyMCA0MCBMIDQwIDMwIFoiIGZpbGw9IiNGRkZGRkYiLz48cGF0aCBkPSJNNzUgMjAgQyA3NSA0MCwgMTI1IDQwLCAxMjUgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0UwRTBFMCIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTUwIDIwIEMgNTAgNDUsIDE1MCA0NSwgMTUwIDIwIEwgMTYwIDMwIEwgMTgwIDQwIEwgMTcwIDE4MCBMIDMwIDE4MCBMIDIwIDQwIEwgNDAgMzAgWiIgZmlsbD0idXJsKCNzaGFkb3cpIi8+PHBhdGggZD0iTTMwLDE4MCBDNDAsMTcwIDYwLDE3NSA3MCwxODAgTDUwLDE5MCBaIiBmaWxsPSIjMDAwMDAwIiBvcGFjaXR5PSIwLjA1Ii8+PHBhdGggZD0iTTE3MCwxODAgQzE2MCwxNzAgMTQwLDE3NSAxMzAsMTgwIEwxNTAsMTkwIFoiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=' },
  { id: 'black', name: 'Black T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImhpZ2hsaWdodCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRjtzdG9wLW9wYWNpdHk6MC4xIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGO3N0b3Atb3BhY2l0eTowIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTUwIDIwIEMgNTAgNDUsIDE1MCA0NSwgMTUwIDIwIEwgMTYwIDMwIEwgMTgwIDQwIEwgMTcwIDE4MCBMIDMwIDE4MCBMIDIwIDQwIEwgNDAgMzAgWiIgZmlsbD0iIzIxMjEyMSIvPjxwYXRoIGQ9Ik03NSAyMCBDIDc1IDQwLCAxMjUgNDAsIDEyNSAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDI0MjQyIiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNNTAgMjAgQyA1TAgNDUsIDE1MCA0NSwgMTUwIDIwIEwgMTYwIDMwIEwgMTgwIDQwIEwgMTcwIDE4MCBMIDMwIDE4MCBMIDIwIDQwIEwgNDAgMzAgWiIgZmlsbD0idXJsKCNoaWdobGlnaHQpIi8+PC9zdmc+' },
  { id: 'grey', name: 'Grey T-Shirt', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InNoYWRvdy1ncmV5IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDtzdG9wLW9wYWNpdHk6MC4xIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwO3N0b3Atb3BhY2l0eTowIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTUwIDIwIEMgNTAgNDUsIDE1MCA0NSwgMTUwIDIwIEwgMTYwIDMwIEwgMTgwIDQwIEwgMTcwIDE4MCBMIDMwIDE4MCBMIDIwIDQwIEwgNDAgMzAgWiIgZmlsbD0iIzlFOUI5RSIvPjxwYXRoIGQ9Ik03NSAyMCBDIDc1IDQwLCAxMjUgNDAsIDEyNSAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzU3NTc1IiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNNTAgMjAgQyA1MCA0NSwgMTUwIDQ1LCAxNTAgMjAgTCAxNjAgMzAgTCAxODAgNDAgTCAxNzAgMTgwIEwgMzAgMTgwIEwgMjAgNDAgTCA0MCAzMCBaIiBmaWxsPSJ1cmwoI3NoYWRvdy1ncmV5KSIvPjwvc3ZnPg==' },
];

export const BLOG_TONES = ['Professional', 'Casual', 'Enthusiastic', 'Informative', 'Formal', 'Humorous'];

export const BLOG_LENGTHS = ['Short (~300 words)', 'Medium (~600 words)', 'Long (~1000 words)'];