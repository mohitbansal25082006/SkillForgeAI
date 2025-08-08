# SkillForge AI - Personalized Skill Roadmap Generator
> **"Turn any topic into a fully personalized learning journey — powered by AI."**
---
## 🌟 Overview
**SkillForge AI** is a full-stack, AI-powered application that takes a **topic** or **goal** (e.g., *Learn Prompt Engineering*, *Become a Web3 Developer*, *Master UI/UX Design*) and automatically generates a **custom skill roadmap** complete with:
- Courses,
- Project ideas,
- Reading materials,
- Practice questions,
- Flashcards,
- Progress tracking,
- Achievements,
- Smart recommendations.
The platform adapts to the user's goals, learning style, and current knowledge level using **Large Language Models**, **Vector Databases**, and modern **Next.js 15 + ShadCN UI** stack.
---
## 🚀 Live Demo
**[🔗 Visit SkillForge AI](https://skill-forge-ai.vercel.app/)**
---
## 🎯 Key Features
### 🧠 1. **AI-Powered Roadmap Generation**
- **Smart Input Analysis**: Understands user's experience level and learning goals
- **Personalized Content**: Generates custom 4-week learning plans
- **Resource Curation**: Provides relevant videos, articles, and tutorials
- **Project-Based Learning**: Includes hands-on project ideas for each module
### 📊 2. **Visual Progress Tracking**
- **Interactive Skill Graph**: Radar charts showing progress across different modules
- **Module Completion**: Track individual module completion with XP rewards
- **Level System**: Gamified progression with levels and XP
- **Learning Streaks**: Encourages consistent learning habits
### 🏆 3. **Gamification System**
- **Experience Points (XP)**: Earn 10 XP for each completed module
- **Achievement Badges**: Unlock achievements for various milestones
- **Level Progression**: Visual level-up system with progress bars
- **Streak Tracking**: Monitor and maintain learning streaks
### 🧩 4. **Interactive Learning Modules**
- **Flashcards**: Spaced repetition system with flip cards
- **Quizzes**: Interactive quizzes with explanations
- **Progress Tracking**: Real-time updates and statistics
- **Personalized Content**: Adaptive learning paths
### 🔍 5. **Smart Content Processing**
- **Video Summarizer**: Paste YouTube URLs to get comprehensive summaries
- **PDF Upload & Search**: Upload PDFs and search through them using AI
- **Semantic Search**: Natural language queries across uploaded documents
- **Content Organization**: Structured learning materials
### 📈 6. **Advanced Analytics**
- **User Statistics Dashboard**: Comprehensive stats and progress overview
- **Smart Recommendations**: AI-powered suggestions based on progress
- **Activity Feed**: Real-time updates on learning activities
- **Performance Metrics**: Track learning efficiency and improvement
---
## 🛠️ Technology Stack
### 🌍 Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router and SSR |
| **TypeScript** | Type safety and better development experience |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **ShadCN UI** | Modern, accessible UI components |
| **Recharts** | Data visualization and skill graphs |
| **Framer Motion** | Smooth animations and transitions |
| **Lucide React** | Beautiful icons |
### 🤖 AI & Backend
| Technology | Purpose |
|------------|---------|
| **OpenAI GPT-4o** | Content generation and AI-powered features |
| **LangChain** | Memory management and prompt chains |
| **Clerk Authentication** | User authentication and management |
| **Supabase** | Database and real-time subscriptions |
| **UploadThing** | File upload and management |
| **Vector Database** | Semantic search and embeddings |
### 🗄️ Database & Storage
| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Primary database for user data and progress |
| **Supabase Vector Store** | Document embeddings and semantic search |
| **Cloud Storage** | File storage for uploads and exports |
### 🚀 Deployment & DevOps
| Technology | Purpose |
|------------|---------|
| **Vercel** | Deployment platform with automatic scaling |
| **GitHub Actions** | CI/CD pipeline and automation |
| **GitHub** | Version control and collaboration |
| **npm** | Package management |
---
### Data Flow
1. **User Input** → **Frontend** → **API Routes** → **AI Services**
2. **AI Generation** → **Database Storage** → **Frontend Display**
3. **User Actions** → **Progress Tracking** → **Achievement System**
4. **File Upload** → **Vector Storage** → **Semantic Search**
---
## 📦 Installation & Setup
### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub account
- Vercel account
- OpenAI API key
- Supabase project
---
### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/SkillForgeAI.git
cd SkillForgeAI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Then add the following to .env.local:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# CLERK_SECRET_KEY=your_clerk_secret_key
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# OPENAI_API_KEY=your_openai_api_key
# UPLOADTHING_TOKEN=your_uploadthing_token

# Run the development server
npm run dev

# Open your browser and navigate to http://localhost:3000
```
---
### Database Setup
```sql
-- Create Supabase project at supabase.com
-- Then run this SQL setup script in the Supabase SQL Editor:

-- Enable pgvector extension
create extension if not exists vector;

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  roadmap_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  xp_earned INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  modules_completed INTEGER DEFAULT 0,
  roadmaps_completed INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matching function
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_count INT,
  filter JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(
  doc_id uuid,
  content TEXT,
  metadata JSONB,
  embedding VECTOR(1536),
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id AS doc_id,
    d.content,
    d.metadata,
    d.embedding,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM
    public.documents d
  WHERE
    1 - (d.embedding <=> query_embedding) > 0.5
    AND (filter->>'userId' IS NULL OR d.metadata->>'userId' = filter->>'userId')
  ORDER BY
    similarity DESC
  LIMIT match_count;
END;
$$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS documents_embedding_idx ON public.documents
USING hnsw (embedding vector_cosine_ops);
```
---
### 🚀 Deployment
```bash
# Prepare Repository
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/SkillForgeAI.git
git push -u origin main

# Deploy to Vercel
# 1. Go to vercel.com
# 2. Click "New Project" → "Import Git Repository"
# 3. Select your SkillForgeAI repository
# 4. Configure environment variables (see below)
# 5. Click "Deploy"

# Post-Deployment Setup
# 1. Update Clerk dashboard with your Vercel domain
# 2. Configure Supabase for your production domain
# 3. Test all features on the live site

# Required environment variables for production:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# CLERK_SECRET_KEY=your_clerk_secret_key
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# OPENAI_API_KEY=your_openai_api_key
# UPLOADTHING_TOKEN=your_uploadthing_token
```
---
### 🤝 Contributing
```bash
# We welcome contributions! Please follow these steps:
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/amazing-feature
# 3. Make your changes
# 4. Commit your changes
git commit -m 'Add amazing feature'
# 5. Push to the branch
git push origin feature/amazing-feature
# 6. Open a Pull Request
```
---
**Built with 💻 by Mohit Bansal**
*"The future of learning is personalized, adaptive, and powered by AI."*
