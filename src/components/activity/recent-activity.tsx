// src/components/activity/recent-activity.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Target, Calendar } from 'lucide-react';
import { getUserProgress, getUserStats } from '@/lib/database';
import { useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'module_completed' | 'roadmap_generated' | 'level_up' | 'streak_milestone';
  title: string;
  description: string;
  timestamp: string;
  xp?: number;
  metadata?: Record<string, unknown>;
}

interface UserProgressData {
  id: string;
  user_id: string;
  roadmap_id: string;
  module_id: string;
  completed: boolean;
  completed_at: string | null;
  xp_earned: number;
  time_spent: number;
  created_at: string;
  updated_at: string;
}

interface UserStatsData {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  modules_completed: number;
  roadmaps_completed: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export function RecentActivity() {
  const { user } = useUser();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecentActivity = useCallback(async () => {
    if (!user) return;
    
    try {
      const [progress, stats] = await Promise.all([
        getUserProgress(user.id),
        getUserStats(user.id)
      ]) as [UserProgressData[], UserStatsData];

      const activityItems: ActivityItem[] = [];

      // Add module completion activities
      const completedModules = progress
        .filter((p) => p.completed && p.completed_at)
        .sort((a, b) => 
          new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
        )
        .slice(0, 5);

      completedModules.forEach((module) => {
        activityItems.push({
          id: module.id,
          type: 'module_completed',
          title: 'Module Completed',
          description: `Completed: ${module.module_id}`,
          timestamp: module.completed_at!,
          xp: 10
        });
      });

      // Add level up activities
      if (stats && stats.level > 1) {
        activityItems.push({
          id: `level-${stats.level}`,
          type: 'level_up',
          title: 'Level Up!',
          description: `Reached level ${stats.level}`,
          timestamp: stats.updated_at,
          xp: stats.total_xp
        });
      }

      // Add streak milestone activities
      if (stats && stats.current_streak >= 3) {
        activityItems.push({
          id: `streak-${stats.current_streak}`,
          type: 'streak_milestone',
          title: 'Streak Milestone!',
          description: `${stats.current_streak} day streak!`,
          timestamp: stats.updated_at
        });
      }

      // Sort all activities by timestamp (most recent first)
      activityItems.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Take only the 5 most recent activities
      setActivities(activityItems.slice(0, 5));
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadRecentActivity();
    }
  }, [user, loadRecentActivity]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'module_completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'level_up':
        return <Target className="h-4 w-4 text-blue-600" />;
      case 'streak_milestone':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'module_completed':
        return 'bg-green-100 text-green-800';
      case 'level_up':
        return 'bg-blue-100 text-blue-800';
      case 'streak_milestone':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <p className="text-gray-500">Loading activity...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <p className="text-gray-500">No activity yet. Generate your first roadmap!</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest learning progress and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{activity.title}</h4>
                  <div className="flex items-center space-x-2">
                    {activity.xp && (
                      <Badge variant="secondary" className="text-xs">
                        +{activity.xp} XP
                      </Badge>
                    )}
                    <Badge className={getActivityColor(activity.type)}>
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}