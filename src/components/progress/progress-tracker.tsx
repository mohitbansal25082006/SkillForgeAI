// components/progress/progress-tracker.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { updateUserProgress, updateUserStats } from '@/lib/database';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface ModuleProgress {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
}

interface ProgressTrackerProps {
  roadmapId: string;
  modules: ModuleProgress[];
  onProgressUpdate?: () => void;
}

export function ProgressTracker({ roadmapId, modules, onProgressUpdate }: ProgressTrackerProps) {
  const { user } = useUser();
  const [moduleStates, setModuleStates] = useState<ModuleProgress[]>(modules);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const completed = modules.filter(m => m.completed).length;
    setCompletedCount(completed);
  }, [modules]);

  const handleModuleToggle = async (moduleId: string, currentCompleted: boolean) => {
    if (!user) return;

    try {
      const newCompleted = !currentCompleted;
      const xpEarned = newCompleted ? 10 : -10;
      
      // Update progress in database
      await updateUserProgress(user.id, roadmapId, moduleId, newCompleted, Math.abs(xpEarned));
      
      // Update user stats
      await updateUserStats(user.id, Math.abs(xpEarned), newCompleted);

      // Update local state
      setModuleStates(prev => 
        prev.map(module => 
          module.id === moduleId 
            ? { ...module, completed: newCompleted }
            : module
        )
      );

      setCompletedCount(prev => newCompleted ? prev + 1 : prev - 1);

      // Notify parent component of progress update
      if (onProgressUpdate) {
        onProgressUpdate();
      }

      toast.success(newCompleted ? 'Module completed! +10 XP' : 'Module unmarked as completed');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const progressPercentage = (completedCount / modules.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>
          Track your progress through this learning roadmap
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{completedCount}/{modules.length} modules</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-xs text-muted-foreground">{progressPercentage.toFixed(0)}% complete</p>
        </div>

        <div className="space-y-4">
          {moduleStates.map((module, index) => (
            <div key={module.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                className="mt-0.5"
                onClick={() => handleModuleToggle(module.id, module.completed)}
              >
                {module.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </Button>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{module.title}</h4>
                  <Badge variant={module.completed ? "default" : "secondary"}>
                    {module.completed ? "Completed" : "Not Started"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{module.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{module.completed ? "Completed" : "Estimated 2-3 hours"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}