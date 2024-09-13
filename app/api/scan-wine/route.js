import { scanWineImage } from '@/utils/openai';

export async function POST(request) {
  const { imageUrl } = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OpenAI API key is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const wineData = await scanWineImage(imageUrl, apiKey);
    return new Response(JSON.stringify(wineData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}