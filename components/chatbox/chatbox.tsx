import { Circle, X } from "lucide-react";

type ChatBoxProps = {
  minimize: (state: boolean) => void;
};
export default function ChatBox({ minimize }: ChatBoxProps) {
  const chatbot: string[] = [
    "Absolutely! Here's some upcoming club events that offer networking opportunities, and some job applications for your summer internship.",
  ];
  const user: string[] = [
    "Hi, I'm a third-year mechanical engineering student and I want to find an internship this summer. Can you help me find some opportunities?",
  ];
  return (
    <div className="place-items-end">
      <div className="card rounded-xl bg-white p-8 min-w-[20%] max-w-[50%] max-h-[calc(150vh-220px)] shadow-md">
        <div className="flex flex-col gap-2 h-full">
          <div className="m-2 inline-flex items-center justify-between">
            <span className="inline-flex items-center">
              <Circle size={20} fill="#8e9089c8" />
              <h2 className="m-1 text-black font-semibold">ChatBot</h2>
            </span>
            <button
              className="m-2 p-1 text-white bg-poly-green rounded-xl hover:cursor-pointer"
              type="button"
              onClick={() => minimize(false)}
            >
              <X size={17} />
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-6 mt-6 overflow-y-auto min-h-[calc(20vh-220px)]">
            <div className="ml-auto flex flex-col w-full max-w-[calc(150vh-220px)] leading-1.5 p-4 bg-light-green text-black right-4 rounded-2xl rounded-br-sm">
              <div className="flex flex-row gap-2">
                <h3 className="text-sm font-semibold text-heading">User</h3>
                <span className="text-sm text-body">6:05PM</span>
              </div>
              <span className="text-sm text-body">{user[0]}</span>
            </div>
            <div className="flex flex-col w-full min-w-[calc(100vh-220px)] max-w-[calc(150vh-220px)] leading-1.5 p-4 bg-light-gray text-black rounded-2xl rounded-bl-sm">
              <div className="flex flex-row gap-2">
                <h3 className="text-sm font-semibold text-heading">AI Agent</h3>
                <span className="text-sm text-body">6:05PM</span>
              </div>
              <span className="text-sm text-body">{chatbot[0]}</span>
            </div>
          </div>
          <div>
            <textarea
              className="bg-light-gray text-dark-gray rounded-2xl w-full p-4"
              placeholder="Type your message here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
