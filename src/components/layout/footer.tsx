// components/layout/footer.tsx
export function Footer() {
  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SkillForge AI. All rights reserved.
      </div>
    </footer>
  );
}