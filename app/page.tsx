"use client";
import Navbar from "@/components/navbar/navbar";
import ChatPopUp from "@/components/chat-popup/chat-popup";
import { useState } from "react";
import ChatBox from "@/components/chat-popup/chatbox";

export default function Home() {
  const [chatOpen, setChatOpen] = useState<Event | null>(null);
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="cover-photo">
          <Navbar />
          <div className="page-header">
            <h1>Testing Reusable Components</h1>
          </div>
          {chatOpen && (<ChatPopUp open={true} onClose={() => setChatOpen(null)}/>)}
          <ChatBox onClose={() => setChatOpen(null)} />
          <button className="btn-primary mt-2 mb-2">Button 1</button>
          <button className="btn-secondary mt-2 mb-2">Button 2</button>
          <button className="btn-tertiary mt-2 mb-2">Button 3</button>
          <button className="btn-quaternary mt-2 mb-2">Button 4</button>
          
        </div>
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
