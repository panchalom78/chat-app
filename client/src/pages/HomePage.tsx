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
    const { selectedUser, subscribeToMessage, unsubscribeToMessage } =
        useChatStore();
    useEffect(() => {
        addRequestChecker();
        acceptRequestChecker();
        subscribeToMessage();
        return () => {
            removeRequestChecker();
            removeAcceptRequestChecker();
            unsubscribeToMessage();
        };
    }, []);
    return (
        <div className="flex-1 flex items-center bg-base-200">
            <div className="h-full w-full flex items-center justify-center md:px-4 px-0">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)]">
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
