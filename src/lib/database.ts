// lib/database.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// User Progress Functions
export async function updateUserProgress(userId: string, roadmapId: string, moduleId: string, completed: boolean, xpEarned: number = 10) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      roadmap_id: roadmapId,
      module_id: moduleId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      xp_earned: xpEarned,
      updated_at: new Date().toISOString()
    })
    .select();

  if (error) throw error;
  return data;
}

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// User Stats Functions
export async function updateUserStats(userId: string, xpEarned: number = 0, moduleCompleted: boolean = false) {
  // First, get current stats
  const { data: currentStats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  const newXp = (currentStats?.total_xp || 0) + xpEarned;
  const newLevel = Math.floor(newXp / 100) + 1;
  const newModulesCompleted = (currentStats?.modules_completed || 0) + (moduleCompleted ? 1 : 0);
  
  // Calculate streak
  const lastActivity = currentStats?.last_activity ? new Date(currentStats.last_activity) : new Date();
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const newStreak = diffDays === 1 ? (currentStats?.current_streak || 0) + 1 : 1;
  const newLongestStreak = Math.max(newStreak, currentStats?.longest_streak || 0);

  const { data, error } = await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      total_xp: newXp,
      level: newLevel,
      current_streak: newStreak,
      longest_streak: newLongestStreak,
      modules_completed: newModulesCompleted,
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select();

  if (error) throw error;
  return data;
}

export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Achievement Functions
export async function unlockAchievement(userId: string, achievementType: string, achievementName: string, description: string, icon: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_type: achievementType,
      achievement_name: achievementName,
      description,
      icon,
      unlocked_at: new Date().toISOString()
    })
    .select();

  if (error) throw error;
  return data;
}

export async function getUserAchievements(userId: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) throw error;
  return data;
}