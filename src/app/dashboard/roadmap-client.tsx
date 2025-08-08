// app/dashboard/roadmap-client.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { RoadmapForm } from "@/components/roadmap/roadmap-form";
import { RoadmapDisplay } from "@/components/roadmap/roadmap-display";
import { SkillGraph } from "@/components/roadmap/skill-graph";
import { ProgressTracker } from "@/components/progress/progress-tracker";
import { Roadmap } from "@/types/roadmap";
import { getUserProgress } from "@/lib/database";
import { useUser } from "@clerk/nextjs";

interface UserProgress {
  module_id: string;
  completed: boolean;
}

export default function RoadmapClient() {
  const { user } = useUser();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  const handleRoadmapGenerated = (generatedRoadmap: Roadmap) => {
    setRoadmap(generatedRoadmap);
    // Trigger a refresh of the recent activity
    window.dispatchEvent(new CustomEvent('activity-updated'));
  };

  const loadUserProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      const progress = await getUserProgress(user.id);
      setUserProgress(progress as UserProgress[]);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user && roadmap) {
      loadUserProgress();
    }
  }, [user, roadmap, loadUserProgress]);

  // Listen for activity updates
  useEffect(() => {
    const handleActivityUpdate = () => {
      loadUserProgress();
    };

    window.addEventListener('activity-updated', handleActivityUpdate);
    return () => {
      window.removeEventListener('activity-updated', handleActivityUpdate);
    };
  }, [loadUserProgress]);

  return (
    <div className="space-y-6">
      <RoadmapForm onRoadmapGenerated={handleRoadmapGenerated} />
      
      {roadmap && (
        <>
          <SkillGraph roadmap={roadmap} userProgress={userProgress} />
          
          <ProgressTracker 
            roadmapId={roadmap.title}
            modules={roadmap.weeks.flatMap(week => 
              week.modules.map(module => ({
                id: module.title,
                title: module.title,
                description: module.description,
                completed: userProgress.some(p => p.module_id === module.title && p.completed),
                xp: 10
              }))
            )}
            onProgressUpdate={() => {
              // Trigger activity refresh when progress is updated
              window.dispatchEvent(new CustomEvent('activity-updated'));
            }}
          />
          
          <RoadmapDisplay roadmap={roadmap} />
        </>
      )}
    </div>
  );
}