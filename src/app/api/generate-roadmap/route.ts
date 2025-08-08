// app/api/generate-roadmap/route.ts
import { NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { generateRoadmapPrompt } from '@/utils/prompts';
import { auth } from '@clerk/nextjs/server';
import { Roadmap } from '@/types/roadmap';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, experience, goal } = await request.json();

    if (!topic || !experience || !goal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = generateRoadmapPrompt(topic, experience, goal);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert learning path designer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
    }

    const roadmap = JSON.parse(content) as Roadmap;

    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}