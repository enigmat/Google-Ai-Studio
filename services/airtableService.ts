import { SavedImage } from '../components/SavedGallery';

export interface AirtableConfig {
    token: string;
    baseId: string;
    tableName: string;
}

export const testAirtableConnection = async (config: AirtableConfig): Promise<void> => {
    // We fetch 1 record with no fields to verify credentials and table access.
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?maxRecords=1&fields%5B%5D=`;
    
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
    // Airtable table names are often URL encoded
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`;
    
    const headers = {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
    };

    // Construct the record, ensuring field names match the Airtable base
    const fields: { [key: string]: any } = {
        'Title': image.title,
        'Description': image.description,
        'Prompt': image.prompt, // This will be the final prompt used for generation (including enhanced)
        // IMPORTANT: Storing the full data URL in a Long Text field
        // Airtable's attachment field requires a public URL, which isn't feasible client-side
        'ImageUrl': image.url, 
        // Convert tags array to a comma-separated string
        'Tags': image.tags.join(', '), 
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
            // Provide a more specific error message from Airtable if available
            const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(`Airtable API error: ${errorMessage}`);
        }
        
    } catch (error) {
        console.error("Failed to save to Airtable:", error);
        if (error instanceof Error) {
            // Re-throw with a more user-friendly prefix
            throw new Error(`Failed to save to Airtable. ${error.message}`);
        }
        throw new Error("An unknown error occurred while saving to Airtable.");
    }
};

export const getPromptsFromAirtable = async (
    config: AirtableConfig, 
    options: { searchQuery?: string, offset?: string, pageSize?: number }
): Promise<{ records: any[], offset?: string }> => {
    const { searchQuery, offset, pageSize = 12 } = options;
    
    let url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?pageSize=${pageSize}&fields%5B%5D=Prompt&fields%5B%5D=Title`;

    // Filter for prompts that are not empty and not marked as "Synced"
    let formulas = ["NOT({Prompt} = '')", "({Synced} = 0)"];
    if (searchQuery) {
        const cleanedQuery = searchQuery.replace(/"/g, '\\"').toLowerCase();
        // Airtable's SEARCH is case-insensitive by default
        formulas.push(`OR(SEARCH("${cleanedQuery}", LOWER({Prompt})), SEARCH("${cleanedQuery}", LOWER({Title})))`);
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
        return {
            records: data.records || [],
            offset: data.offset,
        };
    } catch (error) {
        console.error("Failed to get prompts from Airtable:", error);
        throw error;
    }
};


export const getRandomPromptFromAirtable = async (config: AirtableConfig): Promise<string> => {
    // Construct the URL to only fetch prompts that are not empty and not marked as "Synced"
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?fields%5B%5D=Prompt&filterByFormula=AND(NOT({Prompt} = ''), ({Synced} = 0))`;
    
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
            throw new Error("No unsynced prompts found in your Airtable base. Make sure the 'Prompt' column has entries and the 'Synced' checkbox is unchecked.");
        }
        
        // Extra client-side filter for robustness
        const validRecords = records.filter((record: any) => record.fields.Prompt && typeof record.fields.Prompt === 'string' && record.fields.Prompt.trim() !== '');

        if (validRecords.length === 0) {
            throw new Error("No valid, unsynced prompts found. All matching entries in the 'Prompt' column are empty.");
        }

        const randomIndex = Math.floor(Math.random() * validRecords.length);
        const randomPrompt = validRecords[randomIndex].fields.Prompt;
        
        if (!randomPrompt || typeof randomPrompt !== 'string') {
             throw new Error("A random record was selected, but it doesn't contain a valid 'Prompt' field.");
        }

        return randomPrompt;

    } catch (error) {
        console.error("Failed to get random prompt from Airtable:", error);
        if (error instanceof Error) {
            // Re-throw with a more user-friendly prefix
            throw new Error(`Failed to fetch from Airtable. ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching a prompt from Airtable.");
    }
};