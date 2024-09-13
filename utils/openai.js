import OpenAI from "openai";

const VALID_WINE_TYPES = ["Red", "Sparkling", "White", "Rose", "Dessert", "Fortified"];

function mapToValidWineType(type) {
  const normalizedType = type.trim().toLowerCase();
  return VALID_WINE_TYPES.find(validType => 
    normalizedType.includes(validType.toLowerCase())
  ) || "Other";
}

export async function scanWineImage(imageUrl, apiKey) {
  if (!apiKey) {
    throw new Error("OpenAI API key is required");
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "You are an AI for an online wine cellar. Your job is to scan and determine the exact bottle of wine in the image. Provide the following information in a structured format:\n\nWine Name:\nType: (choose from Red, Sparkling, White, Rose, Dessert, Fortified)\nRegion:\nDescription: (2-3 sentences about the wine and its characteristics in a conversational tone.). DO NOT USE ASTERISKS * OR OTHER MARKUP." },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 300,
    });
    
    const result = response.choices[0].message.content;
    
    // Parse the result using regular expressions
    const nameMatch = result.match(/Wine Name:(.*?)(?:\n|$)/);
    const typeMatch = result.match(/Type:(.*?)(?:\n|$)/);
    const regionMatch = result.match(/Region:(.*?)(?:\n|$)/);
    const descriptionMatch = result.match(/Description:(.*)/s);

    return {
      name: nameMatch ? nameMatch[1].trim() : "Unknown",
      type: typeMatch ? mapToValidWineType(typeMatch[1]) : "Other",
      region: regionMatch ? regionMatch[1].trim() : "Unknown",
      description: descriptionMatch ? descriptionMatch[1].trim() : "No description available.",
    };
  } catch (error) {
    console.error('Error scanning wine image:', error);
    throw error;
  }
}