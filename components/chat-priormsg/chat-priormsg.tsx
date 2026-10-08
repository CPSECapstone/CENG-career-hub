//import "@components/chat-priormsg/chat-priormsg.css";




export default function ChatPriorMsg() {
    const items : String[] = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9", "Item 10", "Item 11", "Item 12", "Item 13", "Item 14", "Item 15", "Item 16", "Item 17", "Item 18", "Item 19", "Item 20"];
    return(
        <div className=" rounded-xl bg-white p-8 shadow-md min-h-0">
            <div className="flex flex-col gap-2 ">
                <h2 className= "text-poly-green font-bold">Previous Chat</h2>
                <h3 className= "text-gray">Continue conversations with your AI assistant</h3>
                <div className= "flex-1 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {items.map((item, index) => (
                    <div key={index} className= "flex flex-col gap-2 items-start hover:cursor-pointer p-4 rounded-xl hover:shadow-md overflow-scroll">
                        <h2 className="text-black font-bold text-md">{item}</h2>
                        <h3 className="text-gray">This is a test....</h3>
                    </div>
                ))}
                </div>
                
            </div>
            
        </div>
    )
}