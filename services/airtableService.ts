

import { SavedImage } from '../components/SavedGallery';

export interface AirtableConfig {
    token: string;
    baseId: string;
    tableName: string;
}

const AIRTABLE_FIELD_LIMIT = 100000;

/**
 * Resizes and compresses an image to a Data URL that fits within Airtable's text field limits.
 * @param dataUrl The original image Data URL.
 * @returns A promise that resolves with the compressed JPEG Data URL.
 */
const resizeAndCompressImageForAirtable = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error("Could not get canvas context for image compression."));
            }

            const MAX_DIMENSION = 512;
            let { width, height } = image;

            if (width > height) {
                if (width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                }
            } else {
                if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(image, 0, 0, width, height);
            
            // Try JPEG at 80% quality first
            const jpegUrl = canvas.toDataURL('image/jpeg', 0.8);
            
            if (jpegUrl.length < AIRTABLE_FIELD_LIMIT) {
                resolve(jpegUrl);
            } else {
                // If still too large, try lower quality
                const lowerQualityJpegUrl = canvas.toDataURL('image/jpeg', 0.6);
                 if (lowerQualityJpegUrl.length < AIRTABLE_FIELD_LIMIT) {
                    resolve(lowerQualityJpegUrl);
                } else {
                    reject(new Error(`Image is too large to save to Airtable, even after compression. Max size is ~75KB.`));
                }
            }
        };
        image.onerror = () => {
            reject(new Error("Failed to load image for resizing. It might be a network issue or a CORS problem if the image is from another domain."));
        };
        image.src = dataUrl;
    });
};


export const testAirtableConnection = async (config: AirtableConfig): Promise<void> => {
    // We fetch 1 record to verify credentials and table access.
    // Removing the `fields[]=` parameter is more robust, as some API versions
    // may interpret an empty field name as an error.
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?maxRecords=1`;
    
    const headers = {
        'Authorization': `Bearer ${config.token}`,
    };

    try {
        const response = await fetch(url, { method: 'GET', headers });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        // No need to parse JSON, a 200 OK is enough for success.
    } catch (error) {
        console.error("Airtable connection test failed:", error);
        if (error instanceof Error) {
            throw new Error(`Connection failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred during the connection test.");
    }
};

export const saveImageToAirtable = async (config: AirtableConfig, image: SavedImage): Promise<void> => {
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`;
    
    const headers = {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
    };

    // Compress the image to fit within Airtable's text field limits.
    const thumbnailUrl = await resizeAndCompressImageForAirtable(image.url);

    // Due to Airtable API limitations (requiring a public URL for attachments),
    // we save a compressed image thumbnail as a Data URL in a long text field.
    const fields: { [key: string]: any } = {
        'Title': image.title,
        'Prompt': image.prompt,
        'Description': image.description,
        'Tags': image.tags.join(', '),
        'Image Thumbnail URL': thumbnailUrl,
    };
    
    if (image.originalPrompt) {
        fields['Original Prompt'] = image.originalPrompt;
    }

    const body = {
        records: [
            { fields },
        ],
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(`Airtable API error: ${errorMessage}`);
        }
        
    } catch (error) {
        console.error("Failed to save to Airtable:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to save to Airtable. ${error.message}`);
        }
        throw new Error("An unknown error occurred while saving to Airtable.");
    }
};

export const updateAirtableRecord = async (config: AirtableConfig, recordId: string, fields: object): Promise<void> => {
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${recordId}`;
    
    const headers = {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
    };

    const body = {
        fields,
    };

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(`Airtable API error: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Failed to update Airtable record:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to update Airtable. ${error.message}`);
        }
        throw new Error("An unknown error occurred while updating the Airtable record.");
    }
};

const executeAirtableGet = async (url: string, headers: HeadersInit) => {
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error?.message || `HTTP status ${response.status}`);
        // Attach the error type from Airtable's response for more specific error handling.
        (error as any).type = errorData.error?.type;
        throw error;
    }
    return response.json();
};

export const getPromptsFromAirtable = async (
    config: AirtableConfig,
    options: { searchQuery?: string; offset?: string; pageSize?: number; tags?: string[] }
): Promise<{ records: any[]; offset?: string }> => {
    const { searchQuery, offset, pageSize = 12, tags = [] } = options;
    let baseUrl = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?pageSize=${pageSize}`;
    if (offset) baseUrl += `&offset=${offset}`;
    const headers = { Authorization: `Bearer ${config.token}` };

    // This function generates a formula based on a specified primary field name ('Prompt' or 'Name').
    // This prevents errors by not referencing fields that may not exist in a user's table.
    const buildFormula = (primaryField: 'Prompt' | 'Name'): string => {
        const formulas: string[] = [];
        // 1. Ensure the primary field is not blank.
        formulas.push(`NOT({${primaryField}} = '')`);

        // 2. Add search query filter (case-insensitive).
        if (searchQuery) {
            const cleanedQuery = searchQuery.replace(/"/g, '\\"').toLowerCase();
            // Search the primary field and an optional 'Title' field.
            // Airtable's IF() handles cases where 'Title' is empty.
            formulas.push(`OR(SEARCH("${cleanedQuery}", LOWER({${primaryField}})), IF({Title}, SEARCH("${cleanedQuery}", LOWER({Title}))))`);
        }

        // 3. Add tag filter.
        if (tags.length > 0) {
            const tagFormulas = tags.map(tag => `FIND(LOWER("${tag.replace(/"/g, '\\"')}"), LOWER({Tags}))`);
            formulas.push(`OR(${tagFormulas.join(',')})`);
        }
        return `AND(${formulas.join(',')})`;
    };

    let data;
    try {
        // Attempt 1: Try with 'Prompt' as the primary field.
        const formula = buildFormula('Prompt');
        const url = `${baseUrl}&filterByFormula=${encodeURIComponent(formula)}`;
        data = await executeAirtableGet(url, headers);
    } catch (e: any) {
        // If 'Prompt' field is missing, fall back to trying 'Name'.
        if (e.type === 'INVALID_FILTER_BY_FORMULA' && e.message.toLowerCase().includes("unknown field name 'prompt'")) {
            console.warn("Airtable field 'Prompt' not found. Falling back to 'Name'.");
            try {
                const formula = buildFormula('Name');
                const url = `${baseUrl}&filterByFormula=${encodeURIComponent(formula)}`;
                data = await executeAirtableGet(url, headers);
            } catch (fallbackError) {
                // If 'Name' also fails, throw that more relevant error.
                throw fallbackError;
            }
        } else {
            // Re-throw other critical errors (e.g., auth, base not found).
            throw e;
        }
    }

    if (!data) {
      throw new Error("Failed to fetch data from Airtable after attempting fallbacks.");
    }

    // Process records flexibly, preferring 'Prompt' but falling back to 'Name'.
    const finalRecords = (data.records || [])
        .map((r: any) => {
            if (!r.fields) return null;

            const promptText = r.fields.Prompt || r.fields.Name;
            // Use 'Title' field if it exists. If not, use 'Name' but only if it wasn't already used for the prompt.
            const titleText = r.fields.Title || (r.fields.Prompt && r.fields.Name ? r.fields.Name : null);

            if (!promptText) return null; // Must have a prompt from one of the fields.

            return {
                id: r.id,
                fields: {
                    Prompt: promptText,
                    Title: titleText,
                }
            };
        })
        .filter((r): r is { id: string; fields: { Prompt: string; Title: string | null } } => r !== null);

    return {
        records: finalRecords,
        offset: data.offset,
    };
};


export const getTagsFromAirtable = async (config: AirtableConfig): Promise<string[]> => {
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?pageSize=100&fields%5B%5D=Tags`;
    const headers = { 'Authorization': `Bearer ${config.token}` };

    try {
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || '';
            // Gracefully handle the 'Tags' field not existing by returning an empty array.
            if (errorMessage.includes("Unknown field name")) {
                console.warn("Airtable 'Tags' field not found. Tag filtering will be disabled.");
                return []; 
            }
            throw new Error(`Airtable API error fetching tags: ${errorMessage || `HTTP status ${response.status}`}`);
        }
        
        const data = await response.json();
        const allTags = new Set<string>();
        
        data.records.forEach((record: any) => {
            const tagsField = record.fields.Tags;
            if (tagsField && typeof tagsField === 'string') {
                tagsField.split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag) // remove empty tags resulting from ", ," or trailing commas
                    .forEach(tag => allTags.add(tag));
            }
        });
        
        return Array.from(allTags).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    } catch (error) {
        console.error("Failed to get tags from Airtable:", error);
        // On any other failure, also return an empty array to prevent the modal from crashing.
        return [];
    }
};

export const getRandomPromptFromAirtable = async (config: AirtableConfig): Promise<{ id: string, prompt: string }> => {
    const headers = { 'Authorization': `Bearer ${config.token}` };
    const baseApiUrl = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`;
    
    // Helper to process API response and select a random valid record.
    const processAndGetRandom = (data: any, fieldName: 'Prompt' | 'Name'): { id: string, prompt: string } | null => {
        if (!data.records || data.records.length === 0) {
            return null;
        }
        // Filter for records that have a non-empty string in the specified field.
        const validRecords = data.records.filter((record: any) => 
            record.fields[fieldName] && typeof record.fields[fieldName] === 'string' && record.fields[fieldName].trim() !== ''
        );
        if (validRecords.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * validRecords.length);
        const randomRecord = validRecords[randomIndex];
        return { id: randomRecord.id, prompt: randomRecord.fields[fieldName] };
    };

    try {
        // Attempt 1: Try to get a prompt from the 'Prompt' field.
        try {
            const filterFormula = "AND(NOT({Prompt} = ''), NOT({Synced}))";
            const url = `${baseApiUrl}?filterByFormula=${encodeURIComponent(filterFormula)}`;
            const data = await executeAirtableGet(url, headers);
            const result = processAndGetRandom(data, 'Prompt');
            if (result) return result; // Success! Found a prompt.
        } catch (e: any) {
            // If the 'Prompt' field doesn't exist, we swallow the error and proceed to the 'Name' field.
            // Any other error (e.g., auth, network) is critical and should be thrown.
            if (!(e.type === 'INVALID_FILTER_BY_FORMULA' && e.message.toLowerCase().includes("unknown field name 'prompt'"))) {
                throw e;
            }
            console.warn("Airtable field 'Prompt' not found for 'Random' button. Falling back to 'Name'.");
        }

        // Attempt 2 (Fallback): Try to get a prompt from the 'Name' field.
        // This runs if the 'Prompt' field didn't exist or had no valid unsynced prompts.
        try {
            const filterFormula = `AND(NOT({Name} = ''), NOT({Synced}))`;
            const url = `${baseApiUrl}?filterByFormula=${encodeURIComponent(filterFormula)}`;
            const data = await executeAirtableGet(url, headers);
            const result = processAndGetRandom(data, 'Name');
            if (result) return result; // Success on fallback!
        } catch(e: any) {
            // If the fallback itself fails (e.g., 'Name' also missing), it's a critical error.
             throw new Error(`Failed to fetch from Airtable using 'Name' field after 'Prompt' field failed or was empty. Error: ${e.message}`);
        }
        
        // If both attempts completed without errors but found no valid records, throw a user-friendly message.
        throw new Error("No unsynced prompts found in your Airtable base. Make sure a 'Prompt' or 'Name' field has entries and the 'Synced' checkbox is unchecked.");
        
    } catch (error) { // This outer catch handles any thrown errors from the attempts.
        console.error("Failed to get random prompt from Airtable:", error);
        if (error instanceof Error) {
            // Re-throw with a more user-friendly prefix.
            throw new Error(`Failed to fetch from Airtable. ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching a prompt from Airtable.");
    }
};
