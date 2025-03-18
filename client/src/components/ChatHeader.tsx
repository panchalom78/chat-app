import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img
                                src={selectedUser?.profilePic || "/avatar.png"}
                                alt={selectedUser.fullName}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="font-medium">
                            {selectedUser.fullName}
                        </div>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id)
                                ? "Online"
                                : "Offline"}
                        </p>
                    </div>
                </div>
                <button className="p-2" onClick={() => setSelectedUser(null)}>
                    <X className="size-6 text-base-content/60" />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
