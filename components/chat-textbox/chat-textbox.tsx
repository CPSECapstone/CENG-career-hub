export default function ChatTextBox() {
  const chatbot: string[] = [
    "Absolutely! I've found a few roles that match your interests. Let me show you some options.",
  ];
  const user: string[] = [
    "Hi, I'm looking for a new job in the tech industry. Can you help me find some opportunities?",
  ];
  return (
    <div className=" card rounded-xl bg-white p-8 min-w-[60%] max-h-[calc(150vh-220px)] shadow-md">
      <div className="flex flex-col gap-2 h-full">
        <h2 className="text-poly-green font-bold">Recent Conversations</h2>
        <div className="flex-1 flex flex-col gap-6 mt-6 overflow-y-auto min-h-[calc(20vh-220px)]">
          <div className="ml-auto flex flex-col w-full max-w-[calc(150vh-220px)] leading-1.5 p-4 bg-light-gray text-dark-gray right-4 rounded-2xl rounded-br-sm">
            <div className="flex flex-row gap-2">
              <h3 className="text-sm font-semibold text-heading">User</h3>
              <span className="text-sm text-body">6:05PM</span>
            </div>
            <span className="text-sm text-body">{user[0]}</span>
          </div>
          <div className="flex flex-col w-full min-w-[calc(100vh-220px)] max-w-[calc(150vh-220px)] leading-1.5 p-4 bg-poly-green rounded-2xl rounded-bl-sm">
            <div className="flex flex-row gap-2">
              <h3 className="text-sm font-semibold text-heading">AI Agent</h3>
              <span className="text-sm text-body">6:05PM</span>
            </div>
            <span className="text-sm text-body">{chatbot[0]}</span>
          </div>
        </div>
        <div>
          <textarea
            className=" bg-light-gray text-dark-gray rounded-2xl w-full p-4"
            placeholder="Type your message here..."
          />
        </div>
      </div>
    </div>
  );
}
