import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const UserCard = ({ user }: any) => {
    const { setSelectedUser, selectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    return (
        <button
            onClick={() => setSelectedUser(user)}
            className={`
                            w-full p-3 flex items-center gap-2 hover:bg-base-300 transition-colors ${
                                selectedUser?._id === user._id
                                    ? "bg-base-300 ring-1 ring-base-300"
                                    : ""
                            }`}
        >
            <div className="relative lg:mx-0">
                <div
                    className={`size-13  rounded-full flex justify-center items-center ${
                        onlineUsers.includes(user._id) && "bg-green-500"
                    }`}
                >
                    <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.name}
                        className="size-12 object-cover rounded-full"
                    />
                </div>
                {user.isNewNotificationReceived && (
                    <span
                        className="absolute bottom-0 right-0 size-3 bg-primary
                                    rounded-full ring-2 ring-zinc-900 lg:hidden"
                    />
                )}
            </div>
            <div className="block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400 truncate">
                    {import.meta.env.VITE_REACT_APP_CHATBOT_ID == user?._id
                        ? "Your AI-Powered Assistant"
                        : onlineUsers.includes(user._id)
                        ? "Online"
                        : "Offline"}
                </div>
            </div>

            {user.isNewNotificationReceived && (
                <div className=" justify-end items-center h-100% flex-1 p-3 hidden lg:flex">
                    <div className="bg-primary h-3 w-3 rounded-full"></div>
                </div>
            )}
        </button>
    );
};

export default UserCard;
