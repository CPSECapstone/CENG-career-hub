"use client";

import { useState } from "react";
import ChatBox from "./chatbox";
import ChatPopUp from "./chat-popup";
import "./chatbox.css";

export default function ChatShell() {
  const [chatBoxState, setChatBoxState] = useState(false);

  return (
    <div className="home-chat">
      {chatBoxState ? (
        <ChatBox minimize={() => setChatBoxState(false)} />
      ) : (
        <ChatPopUp maximize={() => setChatBoxState(true)} />
      )}
    </div>
  );
}