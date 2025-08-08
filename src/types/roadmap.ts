export interface Resource {
  type: string;
  title: string;
  url: string;
}

export interface Module {
  title: string;
  description: string;
  resources: Resource[];
  project: string;
}

export interface Week {
  week: number;
  title: string;
  description: string;
  modules: Module[];
}

export interface Roadmap {
  title: string;
  description: string;
  weeks: Week[];
}

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";