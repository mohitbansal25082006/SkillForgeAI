// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">SkillForge AI</h1>
        <p className="text-xl text-gray-600 mb-8">
          Turn any topic into a fully personalized learning journey — powered by AI.
        </p>
        <Link href="/dashboard">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Custom Roadmaps</CardTitle>
            <CardDescription>
              Generate personalized learning paths for any skill or topic.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interactive Learning</CardTitle>
            <CardDescription>
              Flashcards, quizzes, and projects tailored to your progress.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Smart Recommendations</CardTitle>
            <CardDescription>
              AI-powered suggestions for your next learning steps.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}