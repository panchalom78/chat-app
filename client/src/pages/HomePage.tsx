import { useEffect } from "react";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import SideBar from "../components/SideBar";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
    const {
        addRequestChecker,
        removeRequestChecker,
        acceptRequestChecker,
        removeAcceptRequestChecker,
    } = useChatStore();
    const { selectedUser } = useChatStore();
    useEffect(() => {
        addRequestChecker();
        acceptRequestChecker();
        return () => {
            removeRequestChecker();
            removeAcceptRequestChecker();
        };
    }, []);
    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <SideBar />

                        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
