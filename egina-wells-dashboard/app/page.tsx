"use client"; // Needed for client-side hooks

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/production-kpi");
    }, 3000); // 10 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-black">EGINA WELL PERFORMANCE</h1>
      </div>
  );
}