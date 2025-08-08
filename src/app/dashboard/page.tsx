// app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoadmapClient from "./roadmap-client";
import { VideoSummarizer } from "@/components/video/video-summarizer";
import { PDFSearch } from "@/components/pdf/pdf-search";
import { Flashcards } from "@/components/learning/flashcards";
import { Quiz } from "@/components/learning/quiz";
import { UserStats } from "@/components/stats/user-stats";
import { SmartRecommendations } from "@/components/recommendations/smart-recommendations";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Sample flashcards and quiz data for demonstration
  const sampleFlashcards = [
    { front: "What is React?", back: "A JavaScript library for building user interfaces" },
    { front: "What is a component?", back: "A reusable piece of UI that can have its own state and logic" },
    { front: "What is JSX?", back: "A syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files" }
  ];

  const sampleQuiz = [
    {
      question: "What is the virtual DOM?",
      options: [
        "A real DOM representation",
        "A lightweight copy of the real DOM",
        "A database for storing components",
        "A styling framework"
      ],
      correctAnswer: 1,
      explanation: "The virtual DOM is a lightweight copy of the real DOM that React uses to optimize updates."
    },
    {
      question: "What is the purpose of state in React?",
      options: [
        "To store CSS styles",
        "To manage data that changes over time",
        "To define component structure",
        "To handle HTTP requests"
      ],
      correctAnswer: 1,
      explanation: "State is used to manage data that changes over time in a component."
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* User Stats Section */}
      <div className="mb-8">
        <UserStats />
      </div>

      {/* Smart Recommendations Section */}
      <div className="mb-8">
        <SmartRecommendations />
      </div>

      <Tabs defaultValue="roadmap" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="pdf">Documents</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roadmap" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <RoadmapClient />
            </div>
            <div>
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
                <p className="text-gray-500">Your latest learning progress</p>
                <div className="mt-4">
                  <p className="text-gray-500">No activity yet. Generate your first roadmap!</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="video">
          <VideoSummarizer />
        </TabsContent>
        
        <TabsContent value="pdf">
          <PDFSearch />
        </TabsContent>
        
        <TabsContent value="learning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Flashcards</h2>
              <Flashcards cards={sampleFlashcards} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Quiz</h2>
              <Quiz questions={sampleQuiz} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}