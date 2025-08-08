// app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Roadmap</CardTitle>
            <CardDescription>
              Generate a personalized learning roadmap for any topic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Create Roadmap</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Roadmaps</CardTitle>
            <CardDescription>
              View and continue your existing learning roadmaps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">View Roadmaps</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Learning Stats</CardTitle>
            <CardDescription>
              Track your progress and achievements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">View Stats</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}