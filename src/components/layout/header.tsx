// components/layout/header.tsx
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          SkillForge AI
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}