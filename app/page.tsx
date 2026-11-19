"use client";

import Navbar from "@/components/navbar/navbar";
import SearchBar from "@/components/search-bar/search-bar";
import ChatShell from "@/components/chatbox/chat-shell";
import "./home.css";

export default function Home() {
  return (
    <main className="home-hero cover-photo">
      <Navbar />
      <div className="home-content">
        <h1>Welcome, [name]!</h1>
        <SearchBar />
      </div>
      <div className="home-chat">
        <ChatShell />
      </div>
    </main>
  );
}
