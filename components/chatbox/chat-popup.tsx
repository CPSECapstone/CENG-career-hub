import { Circle, MoveDiagonal } from "lucide-react";

type PopUpProps = {
  maximize: (state: boolean) => void;
};

export default function ChatPopUp({ maximize }: PopUpProps) {
  return (
    <div className="home-chat-popup">
      <div className="home-chat-title">
        <Circle size={22} fill="#d9d9d9" color="#d9d9d9" />
        <span>ChatBot</span>
      </div>

      <button
        className="home-chat-icon-button"
        type="button"
        onClick={() => maximize(true)}
        aria-label="Open chat"
      >
        <MoveDiagonal size={16} />
      </button>
    </div>
  );
}