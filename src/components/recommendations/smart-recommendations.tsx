// components/recommendations/smart-recommendations.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BookOpen, Video, FileText, Target, ArrowRight } from 'lucide-react';
import { getUserProgress, getUserStats } from '@/lib/database';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface UserStats {
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  modules_completed: number;
  roadmaps_completed: number;
}

interface Recommendation {
  id: string;
  type: 'module' | 'roadmap' | 'resource';
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  actionUrl?: string;
}

export function SmartRecommendations() {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateRecommendations();
    }
  }, [user]);

  const generateRecommendations = async () => {
    if (!user) return;
    
    try {
      const [progress, stats] = await Promise.all([
        getUserProgress(user.id),
        getUserStats(user.id)
      ]);

      const recs: Recommendation[] = [];

      // Analyze progress and generate recommendations
      const incompleteModules = progress.filter((p: { completed: boolean }) => !p.completed);
      
      if (incompleteModules.length > 0) {
        recs.push({
          id: 'continue-learning',
          type: 'module',
          title: 'Continue Your Current Learning',
          description: `You have ${incompleteModules.length} modules in progress`,
          reason: 'Maintain momentum in your current roadmap',
          priority: 'high',
          estimatedTime: '2-3 hours',
          actionUrl: '/dashboard'
        });
      }

      // Level-based recommendations
      if (stats && stats.total_xp > 200) {
        recs.push({
          id: 'advanced-topics',
          type: 'roadmap',
          title: 'Explore Advanced Topics',
          description: 'Based on your progress, you\'re ready for more complex concepts',
          reason: 'You\'ve mastered the fundamentals',
          priority: 'medium',
          estimatedTime: '5-10 hours',
          actionUrl: '/dashboard'
        });
      }

      // Streak-based recommendations
      if (stats && stats.current_streak >= 3) {
        recs.push({
          id: 'maintain-streak',
          type: 'module',
          title: 'Keep Your Streak Going!',
          description: 'Complete a quick module to maintain your learning streak',
          reason: `You're on a ${stats.current_streak}-day streak!`,
          priority: 'high',
          estimatedTime: '30 minutes',
          actionUrl: '/dashboard'
        });
      }

      // XP-based recommendations
      if (stats && stats.total_xp < 100) {
        recs.push({
          id: 'first-milestone',
          type: 'module',
          title: 'Reach Your First 100 XP',
          description: 'Complete modules to earn XP and level up',
          reason: 'You\'re close to your first milestone',
          priority: 'high',
          estimatedTime: '1 hour',
          actionUrl: '/dashboard'
        });
      }

      // New user recommendation
      if (stats && stats.modules_completed === 0) {
        recs.push({
          id: 'get-started',
          type: 'roadmap',
          title: 'Generate Your First Learning Roadmap',
          description: 'Start your learning journey by creating a personalized roadmap',
          reason: 'Begin your learning adventure',
          priority: 'high',
          estimatedTime: '5 minutes',
          actionUrl: '/dashboard'
        });
      }

      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'module': return <BookOpen className="h-4 w-4" />;
      case 'roadmap': return <Target className="h-4 w-4" />;
      case 'resource': return <FileText className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const handleGetStarted = () => {
    // Scroll to the roadmap form section
    const roadmapForm = document.getElementById('roadmap-form');
    if (roadmapForm) {
      roadmapForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Smart Recommendations
        </CardTitle>
        <CardDescription>
          Personalized suggestions based on your learning progress and goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="mt-1">
                  {getTypeIcon(rec.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{rec.reason}</span>
                    <span>{rec.estimatedTime}</span>
                  </div>
                </div>
                {rec.actionUrl ? (
                  <Link href={rec.actionUrl}>
                    <Button size="sm">
                      Start
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm">Start</Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Complete some modules to get personalized recommendations!
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Our AI-powered recommendation system analyzes your learning progress and suggests the best next steps for your educational journey.
            </p>
            <div className="space-y-3">
              <Button onClick={handleGetStarted} className="w-full max-w-xs mx-auto">
                Generate Your First Roadmap
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-xs text-gray-400">
                or complete existing modules to unlock personalized suggestions
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}