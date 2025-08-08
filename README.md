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
| **Redis** | Caching and session management (future) |
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
