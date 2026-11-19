import { Circle, MessageSquare, X } from "lucide-react";

type ChatBoxProps = {
  minimize: (state: boolean) => void;
};

export default function ChatBox({ minimize }: ChatBoxProps) {
  return (
    <div className="home-chat-box">
      <div className="home-chat-header">
        <div className="home-chat-title">
          <Circle size={22} fill="#d9d9d9" color="#d9d9d9" />
          <span>ChatBot</span>
        </div>

        <button
          className="home-chat-icon-button"
          type="button"
          onClick={() => minimize(false)}
          aria-label="Minimize chat"
        >
          <X size={16} />
        </button>
      </div>

      <div className="home-chat-messages">
        <div className="home-chat-message home-chat-message-bot">
          Absolutely! Here are some upcoming club events and internship
          opportunities that might interest you.
        </div>

        <div className="home-chat-message home-chat-message-user">
          Hi, I’m looking for an internship. Can you help me find opportunities?
        </div>
      </div>

      <div className="home-chat-input">
        <MessageSquare size={16} aria-hidden="true" />
        <input type="text" placeholder="Send a message..." aria-label="Message" />
      </div>
    </div>
  );
}