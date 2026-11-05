import { useState } from "react";
import ChatBox from "./chatbox";
import ChatPopUp from "./chat-popup";

export default function ChatShell() {
  const [chatBoxState, setChatBoxState] = useState(false);

  return (
    <div>
      {chatBoxState ? (
        <ChatBox minimize={() => setChatBoxState(false)} />
      ) : (
        <ChatPopUp maximize={() => setChatBoxState(true)} />
      )}
    </div>
  );
}
