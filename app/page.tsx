'use client'; 

import EmailExtractor from "@/components/EmailExtractor";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">Dashboard Guru</h1>
        <EmailExtractor />
      </div>
    </main>
  );
}