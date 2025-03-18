import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
const ChatContainer = () => {
    const {
        selectedUser,
        messages,
        isMessagesLoading,
        getMessages,
        subscribeToMessage,
        unsubscribeToMessage,
    } = useChatStore();
    const { authUser } = useAuthStore();

    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageEndRef.current && messages)
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessage();
        return () => {
            unsubscribeToMessage();
        };
    }, [
        selectedUser._id,
        getMessages,
        subscribeToMessage,
        unsubscribeToMessage,
    ]);
    if (isMessagesLoading)
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`chat ${
                            authUser._id === msg.senderId
                                ? "chat-end"
                                : "chat-start"
                        }`}
                        ref={messageEndRef}
                    >
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(msg.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble rounded-md">
                            {msg.image && (
                                <img
                                    src={msg.image}
                                    alt="image"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {msg.text && <p>{msg.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
