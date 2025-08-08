// components/roadmap/skill-graph.tsx
"use client";

import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SkillGraphProps {
  roadmap: {
    weeks: Array<{
      modules: Array<{
        title: string;
        completed?: boolean;
      }>;
    }>;
  };
  userProgress?: Array<{
    module_id: string;
    completed: boolean;
  }>;
}

export function SkillGraph({ roadmap, userProgress = [] }: SkillGraphProps) {
  const data = useMemo(() => {
    const allModules = roadmap.weeks.flatMap(week => week.modules);
    const progressMap = new Map(userProgress.map(p => [p.module_id, p.completed]));
    
    return allModules.map((module, index) => ({
      subject: module.title.substring(0, 20) + (module.title.length > 20 ? '...' : ''),
      A: progressMap.get(module.title) ? 100 : 0,
      fullMark: 100
    }));
  }, [roadmap, userProgress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Progress Overview</CardTitle>
        <CardDescription>
          Visual representation of your learning progress across different modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Progress"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}