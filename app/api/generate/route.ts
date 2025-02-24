import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.EMOJI_API_ACCESS_KEY;
    if (!apiKey) {
      console.error('EMOJI_API_ACCESS_KEY is not configured');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    console.log('Making request to Emoji API with prompt:', prompt);
    const response = await fetch(
      `https://emoji-api.com/emojis?access_key=${apiKey}&search=${encodeURIComponent(prompt)}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('Emoji API error:', {
        status: response.status,
        statusText: response.statusText
      });
      
      return NextResponse.json(
        { error: `Emoji API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Emoji API response:', data);
    
    if (!Array.isArray(data) || !data.length) {
      return NextResponse.json(
        { error: "No emoji found for the given prompt" },
        { status: 404 }
      );
    }

    const emojiCharacter = data[0].character;
    console.log('Sending emoji character:', emojiCharacter);

    return NextResponse.json({
      success: true,
      emoji: emojiCharacter
    });

  } catch (error) {
    console.error('Error in emoji generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate emoji', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 