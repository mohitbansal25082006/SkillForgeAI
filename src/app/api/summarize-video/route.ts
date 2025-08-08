import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import openai from '@/lib/openai';
import { auth } from '@clerk/nextjs/server';

interface VideoSummary {
  summary: string;
  keyPoints: string[];
  chapters: Array<{ title: string; summary: string }>;
  projectIdeas: string[];
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Get transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(' ');

    // Generate summary using OpenAI
    const summary = await generateVideoSummary(transcriptText);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing video:', error);
    return NextResponse.json({ error: 'Failed to summarize video' }, { status: 500 });
  }
}

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function generateVideoSummary(transcript: string): Promise<VideoSummary> {
  const prompt = `
    Analyze this YouTube video transcript and provide:
    1. A comprehensive summary
    2. Key points in bullet format
    3. Chapter-wise breakdown if applicable
    4. 3 project ideas based on the video content
    
    Transcript: ${transcript.substring(0, 15000)} // Limit to avoid token overflow
    
    Return the response in JSON format with these keys:
    {
      "summary": "Overall summary",
      "keyPoints": ["Point 1", "Point 2"],
      "chapters": [{"title": "Chapter 1", "summary": "Summary"}],
      "projectIdeas": ["Project idea 1", "Project idea 2", "Project idea 3"]
    }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are an expert at analyzing educational content." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Failed to generate summary');
  }
  
  return JSON.parse(content) as VideoSummary;
}