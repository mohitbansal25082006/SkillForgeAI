// components/stats/user-stats.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, TrendingUp, Calendar } from 'lucide-react';
import { getUserStats, getUserAchievements } from '@/lib/database';
import { useUser } from '@clerk/nextjs';

interface UserStatsData {
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  modules_completed: number;
  roadmaps_completed: number;
}

interface Achievement {
  achievement_name: string;
  description: string;
  icon: string;
  unlocked_at: string;
}

export function UserStats() {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const [userStats, userAchievements] = await Promise.all([
        getUserStats(user.id),
        getUserAchievements(user.id)
      ]);
      
      setStats(userStats as UserStatsData);
      setAchievements(userAchievements as Achievement[]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading stats...</div>;
  }

  if (!stats) {
    return <div>No stats available</div>;
  }

  const xpToNextLevel = stats.level * 100;
  const currentLevelXp = (stats.level - 1) * 100;
  const progressInLevel = ((stats.total_xp - currentLevelXp) / 100) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Level Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Level</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.level}</div>
          <div className="space-y-1">
            <Progress value={progressInLevel} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {stats.total_xp - currentLevelXp}/{xpToNextLevel - currentLevelXp} XP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* XP Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total XP</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_xp}</div>
          <p className="text-xs text-muted-foreground">
            Keep learning to earn more!
          </p>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.current_streak} days</div>
          <p className="text-xs text-muted-foreground">
            Best: {stats.longest_streak} days
          </p>
        </CardContent>
      </Card>

      {/* Modules Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Modules</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.modules_completed}</div>
          <p className="text-xs text-muted-foreground">
            Completed so far
          </p>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Your latest accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.slice(0, 6).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <h4 className="font-medium">{achievement.achievement_name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No achievements yet. Keep learning!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}