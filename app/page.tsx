"use client";
import Navbar from "@/components/navbar/navbar";
import ChatShell from "@/components/chatbox/chat-shell";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white text-black">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="cover-photo">
          <Navbar />
          <div className="page-header">
            <h1> Welcome, [Name]! </h1>
          </div>
          <ChatShell />
        </div>
        <section className="w-full px-6" aria-labelledby="recommended-heading">
          <h2 id="recommended-heading" className="text-3xl font-bold text-black">
            Recommended For You
          </h2>
        </section>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
