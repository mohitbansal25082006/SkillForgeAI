// lib/database.ts
import { supabase } from './supabase'

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  content: string;
  roadmap_id: string;
  order: number;
  completed: boolean;
}

export async function createRoadmap(roadmap: Omit<Roadmap, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('roadmaps')
    .insert([roadmap])
    .select()
    
  if (error) throw error;
  return data[0];
}

export async function getUserRoadmaps(userId: string) {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}