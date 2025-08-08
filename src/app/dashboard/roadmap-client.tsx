// app/dashboard/roadmap-client.tsx
"use client";

import { useState } from "react";
import { RoadmapForm } from "@/components/roadmap/roadmap-form";
import { RoadmapDisplay } from "@/components/roadmap/roadmap-display";
import { Roadmap } from "@/types/roadmap";

export default function RoadmapClient() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const handleRoadmapGenerated = (generatedRoadmap: Roadmap) => {
    setRoadmap(generatedRoadmap);
  };

  return (
    <div className="space-y-6">
      <RoadmapForm onRoadmapGenerated={handleRoadmapGenerated} />
      {roadmap && <RoadmapDisplay roadmap={roadmap} />}
    </div>
  );
}