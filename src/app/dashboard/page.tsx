// app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RoadmapClient from "./roadmap-client";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
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
    </div>
  );
}