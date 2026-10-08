//import "@components/chat-priormsg/chat-priormsg.css";




export default function ChatPriorMsg() {
    const items : String[] = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
    return(
        <div className=" rounded-xl bg-white p-8 shadow-md ">
            <div className="flex flex-col gap-2 ">
                <h2 className= "text-poly-green font-bold">Previous Chat</h2>
                <h3 className= "text-gray">Continue conversations with your AI assistant</h3>
                <div className= "relative overflow-y-scroll min-h[100px] max-h-[30%]">
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