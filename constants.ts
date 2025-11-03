export type GeneratorMode =
  | 'text-to-image'
  | 'image-variations'
  | 'ugc-ad'
  | 'ugc-video-ad'
  | 'text-to-video'
  | 'animate-image'
  | 'video-green-screen'
  | 'gif-generator'
  | 'creative-chat'
  | 'image-to-prompt'
  | 'product-studio'
  | 'tshirt-mockup'
  | 'blog-post'
  | 'recipe-post'
  | 'social-media-post'
  | 'poem-writer'
  | 'avatar-generator'
  | 'flyer-generator'
  | 'logo-generator'
  | 'thumbnail-generator'
  | 'recreate-thumbnail'
  | 'explainer-video'
  | 'music-video'
  | 'title-to-image'
  | 'lyrics-to-video'
  | 'audio-to-text'
  | 'lip-sync'
  | 'business-name-generator'
  | 'email-campaign'
  | 'ebook-idea'
  | 'book-cover'
  | 'book-mockup';

export const STYLES = [
    { name: 'None', promptSuffix: '' },
    { name: 'Cinematic', promptSuffix: ', cinematic, dramatic lighting, epic composition, professional color grading' },
    { name: 'Photorealistic', promptSuffix: ', photorealistic, 8k, sharp focus, high quality photo' },
    { name: 'Anime', promptSuffix: ', anime style, vibrant colors, detailed line work, studio ghibli inspired' },
    { name: 'Watercolor', promptSuffix: ', watercolor painting, soft edges, blended colors, paper texture' },
    { name: '3D Render', promptSuffix: ', 3d render, octane render, trending on artstation, hyper-detailed' },
    { name: 'Pixel Art', promptSuffix: ', pixel art, 16-bit, detailed, vibrant, retro video game style' },
    { name: 'Low Poly', promptSuffix: ', low poly, isometric, simple shapes, clean, minimalist' },
];

export const ASPECT_RATIOS = ['1:1', '16:9', '9:16'] as const;

export const EXAMPLE_PROMPTS = [
  'A raccoon in a library, wearing a monocle',
  'A neon-lit cyberpunk city street at night, raining',
  'A majestic castle floating in the clouds, fantasy',
  'A cute robot tending to a small garden on a spaceship',
];

export const VARIATION_COUNTS = [4, 8, 12] as const;

export const VIDEO_STYLES = [
    { name: 'None', promptSuffix: '' },
    { name: 'Cinematic', promptSuffix: ', cinematic, epic, dramatic lighting, professional color grading, high detail' },
    { name: 'Vintage Film', promptSuffix: ', vintage film, 8mm, grainy, retro, film scratches, warm tones' },
    { name: 'Black & White', promptSuffix: ', black and white, monochrome, high contrast, dramatic shadows' },
    { name: 'Time-lapse', promptSuffix: ', time-lapse, fast motion, clouds moving quickly, city lights streaking' },
    { name: 'Slow Motion', promptSuffix: ', slow motion, ultra slow-mo, 1000fps, dramatic, detailed movement' },
    { name: 'Caricature', promptSuffix: ', caricature style, exaggerated features, humorous, animated drawing' },
];

// For Avatar Generator
export const AVATAR_GENDERS = ['Male', 'Female', 'Non-binary'];
export const AVATAR_AGES = ['Child', 'Teenager', 'Young Adult', 'Adult', 'Elderly'];
export const AVATAR_HAIR_STYLES = ['Short and neat', 'Long and flowing', 'Curly and wild', 'Braided', 'Top-knot', 'Mohawk'];
export const AVATAR_COLORS = ['Black', 'Brown', 'Blonde', 'Red', 'Blue', 'Green', 'Purple', 'Pink', 'White', 'Silver'];
export const AVATAR_ART_STYLES = [
  { name: 'Photorealistic', value: 'photorealistic, detailed skin texture, sharp focus' },
  { name: 'Anime', value: 'anime style, vibrant colors, cell shading' },
  { name: 'Disney Pixar', value: 'disney pixar style, 3d render, friendly and expressive' },
  { name: 'Cyberpunk', value: 'cyberpunk style, neon lights, futuristic clothing, cybernetic implants' },
  { name: 'Fantasy', value: 'fantasy style, elven features, intricate armor, magical glow' },
];

// For Flyer Generator
export const FLYER_STYLES = ['Modern & Clean', 'Bold & Energetic', 'Elegant & Minimalist', 'Retro & Funky', 'Corporate & Professional'];

// For Logo Generator
export const LOGO_STYLES = ['Minimalist', 'Geometric', 'Mascot', 'Abstract', 'Lettermark', 'Emblem'];

// For Thumbnail Generator
export const THUMBNAIL_STYLES = [
    { name: 'Bold', description: 'High contrast, big text, bright colors.', promptSuffix: 'bold sans-serif font, high contrast, vibrant colors, clickbait, eye-catching' },
    { name: 'Minimalist', description: 'Clean, simple, lots of negative space.', promptSuffix: 'minimalist design, clean san-serif font, lots of negative space' },
    { name: 'Gaming', description: 'Energetic, flashy, often with characters.', promptSuffix: 'gaming thumbnail style, flashy effects, neon colors, action-packed' },
];

// For T-shirt Mockup Generator
export const TSHIRT_MOCKUPS = [
    { id: 'black', name: 'Black T-shirt', url: 'https://storage.googleapis.com/gemini-ui-params/prompter/mockup_black.png' },
    { id: 'white', name: 'White T-shirt', url: 'https://storage.googleapis.com/gemini-ui-params/prompter/mockup_white.png' },
    { id: 'heather', name: 'Heather Grey T-shirt', url: 'https://storage.googleapis.com/gemini-ui-params/prompter/mockup_heather.png' },
];

// For Book Mockup Generator
export const BOOK_MOCKUPS = [
    { id: 'paperback-front', name: 'Paperback', url: 'https://storage.googleapis.com/gemini-ui-params/prompter/book_paperback_front.png' },
    { id: 'hardcover-angle', name: 'Hardcover', url: 'https://storage.googleapis.com/gemini-ui-params/prompter/book_hardcover_angle.png' },
    { id: 'paperback-angle-shadow', name: 'Paperback Angle', url: 'https://storage.googleapis.com/gemini-ui-params/prompter/book_paperback_angle_shadow.png' },
    { id: 'hardcover-bar', name: 'Hardcover 3D', url: 'https://storage.googleapis.com/gemini-ui-params/prompter/book_hardcover_bar.png' },
];

// For Blog Post Generator
export const BLOG_TONES = ['Professional', 'Casual', 'Humorous', 'Informative', 'Inspirational', 'Sarcastic'];
export const BLOG_LENGTHS = ['Short (200 words)', 'Medium (500 words)', 'Long (1000 words)'];

// For Social Media Post Generator
export const SOCIAL_MEDIA_PLATFORMS = ['Twitter/X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok'];

// For Business Name Generator
export const BUSINESS_NAME_STYLES = ['Modern', 'Classic', 'Playful', 'Descriptive', 'Abstract'];

// For Email Campaign Generator
export const EMAIL_CAMPAIGN_TYPES = ['Product Launch', 'Promotional Sale', 'Welcome Email', 'Newsletter Update', 'Re-engagement'];

// For Ebook Idea Generator
export const EBOOK_GENRES = ['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Young Adult', 'Historical Fiction'];
export const EBOOK_AUDIENCES = ['Children', 'Young Adults', 'New Adults', 'Adults'];

// For Book Cover Generator
export const BOOK_COVER_STYLES = ['Photorealistic', 'Minimalist', 'Illustrated', 'Vintage', 'Typographic', 'Fantasy Painting'];

// For Poem Writer
export const POEM_STYLES = ['Free Verse', 'Sonnet', 'Haiku', 'Limerick', 'Ballad', 'Ode'];
export const POEM_MOODS = ['Joyful', 'Melancholy', 'Humorous', 'Reflective', 'Romantic', 'Mysterious'];