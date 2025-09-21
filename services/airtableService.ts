import { SavedImage } from '../components/SavedGallery';

export interface AirtableConfig {
    token: string;
    baseId: string;
    tableName: string;
}

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

    // Due to Airtable API limitations (requiring a public URL for attachments),
    // we save the image as a Data URL in a long text field. This is a reliable client-side approach.
    const fields: { [key: string]: any } = {
        'Title': image.title,
        'Prompt': image.prompt,
        'Description': image.description,
        'Tags': image.tags.join(', '), // Save tags as a comma-separated string
        'Image Data URL': image.url, // Save the full data URL
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

export const getPromptsFromAirtable = async (
    config: AirtableConfig, 
    options: { searchQuery?: string, offset?: string, pageSize?: number, tags?: string[] }
): Promise<{ records: any[], offset?: string }> => {
    const { searchQuery, offset, pageSize = 12, tags = [] } = options;
    
    // Remove the explicit fields parameter to fetch all fields.
    // This makes the function robust against missing optional fields like 'Title' or 'Tags'.
    let url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?pageSize=${pageSize}`;

    // Base filter: Ensure the 'Prompt' field is not empty.
    let formulas = ["NOT({Prompt} = '')"];
    
    if (searchQuery) {
        const cleanedQuery = searchQuery.replace(/"/g, '\\"').toLowerCase();
        // Only search the 'Prompt' field. Searching optional fields like 'Title'
        // would cause an "Unknown field name" error if the user's base doesn't have them.
        formulas.push(`SEARCH("${cleanedQuery}", LOWER({Prompt}))`);
    }

    if (tags.length > 0) {
        // This will attempt to filter by a 'Tags' field. If it doesn't exist, the API will return an error,
        // which is caught below and displayed to the user.
        const tagFormulas = tags.map(tag => `FIND(LOWER("${tag.replace(/"/g, '\\"')}"), LOWER({Tags}))`);
        formulas.push(`OR(${tagFormulas.join(',')})`);
    }

    url += `&filterByFormula=AND(${formulas.join(',')})`;

    if (offset) {
        url += `&offset=${offset}`;
    }

    const headers = { 'Authorization': `Bearer ${config.token}` };

    try {
        const response = await fetch(url, { method: 'GET', headers });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(`Airtable API error: ${errorMessage}`);
        }

        const data = await response.json();
        
        const finalRecords = (data.records || [])
            .filter((r: any) => r.fields && r.fields.Prompt) // Ensure records have fields and a Prompt
            .map((r: any) => ({
                id: r.id,
                fields: {
                    Prompt: r.fields.Prompt,
                    // Title is optional. If it doesn't exist, r.fields.Title will be undefined.
                    // The UI component handles this gracefully.
                    Title: r.fields.Title 
                }
            }));

        return {
            records: finalRecords || [],
            offset: data.offset,
        };
    } catch (error) {
        console.error("Failed to get prompts from Airtable:", error);
        throw error;
    }
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
    // Remove the explicit fields parameter to fetch all fields for robustness. Filter for non-empty prompts.
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?filterByFormula=NOT({Prompt} = '')`;
    
    const headers = {
        'Authorization': `Bearer ${config.token}`,
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(`Airtable API error: ${errorMessage}`);
        }

        const data = await response.json();
        const records = data.records;

        if (!records || records.length === 0) {
            throw new Error("No prompts found in your Airtable base. Make sure the 'Prompt' column has entries.");
        }
        
        // Extra client-side filter for robustness
        const validRecords = records.filter((record: any) => record.fields.Prompt && typeof record.fields.Prompt === 'string' && record.fields.Prompt.trim() !== '');

        if (validRecords.length === 0) {
            throw new Error("No valid prompts found. All matching entries in the 'Prompt' column are empty.");
        }

        const randomIndex = Math.floor(Math.random() * validRecords.length);
        const randomRecord = validRecords[randomIndex];
        const randomPrompt = randomRecord.fields.Prompt;
        
        if (!randomPrompt || typeof randomPrompt !== 'string') {
             throw new Error("A random record was selected, but it doesn't contain a valid 'Prompt' field.");
        }

        return { id: randomRecord.id, prompt: randomPrompt };

    } catch (error) {
        console.error("Failed to get random prompt from Airtable:", error);
        if (error instanceof Error) {
            // Re-throw with a more user-friendly prefix
            throw new Error(`Failed to fetch from Airtable. ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching a prompt from Airtable.");
    }
};