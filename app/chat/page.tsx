
import Navbar from '@/components/navbar/navbar';
import ChatPriorMsg from "@/components/chat-priormsg/chat-priormsg";
import ChatTextBox from '@/components/chat-textbox/chat-textbox';


export default function Chat() {
    return(
        <div className="cover-photo">
            <div >
                <Navbar />
                <div className = "page-header">
                    <h1 >Ask me anything!</h1>
                </div>
            </div>
            <div className="bg-white flex flex-1 flex-row gap-2 justify-center p-8 min-h-20">
                <ChatTextBox />
                <ChatPriorMsg />
            </div>
            
        </div>

    )
}
