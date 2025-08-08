// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'SkillForge AI',
  description: 'Personalized Skill Roadmap Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}