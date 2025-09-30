
"use client";

import Home from "@/components/user/Home";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
  
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🎉 به فروشگاه آنلاین خوش آمدید
      </h1>

      <section className="w-full max-w-6xl">
        <Home />
      </section>

   
      <footer className="mt-10 text-gray-500 text-sm">
        <p>کلیه حقوق محفوظ است © 2025</p>
      </footer>
    </main>
  );
}




