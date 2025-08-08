"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ExternalLink, FileText, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

interface VideoSummary {
  summary: string;
  keyPoints: string[];
  chapters: Array<{ title: string; summary: string }>;
  projectIdeas: string[];
}

export function VideoSummarizer() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState<VideoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!videoUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/summarize-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize video');
      }

      const data = await response.json();
      setSummary(data.summary);
      toast.success('Video summarized successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to summarize video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Video Summarizer</CardTitle>
          <CardDescription>
            Paste a YouTube URL to get a comprehensive summary, key points, and project ideas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSummarize} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Summarize'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{summary.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Points</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {summary.chapters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Chapters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary.chapters.map((chapter, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{chapter.title}</h4>
                    <p className="text-gray-600 text-sm">{chapter.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Project Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {summary.projectIdeas.map((idea, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {idea}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}