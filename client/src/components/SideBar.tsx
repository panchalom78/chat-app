import { UserPlus, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import SideBarSkeleton from "./skeletons/SideBarSkeleton";
import { useEffect } from "react";
import RequestDialog from "./RequestDialog";
import { useAuthStore } from "../store/useAuthStore";
function SideBar() {
    const {
        users,
        isUsersLoading,
        selectedUser,
        setSelectedUser,
        getUsers,
        getRequstedUsers,
    } = useChatStore();
    const { onlineUsers } = useAuthStore();

    useEffect(() => {
        getUsers();
        getRequstedUsers();
    }, []);

    if (isUsersLoading) return <SideBarSkeleton />;
    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full gap-2 flex items-center p-5">
                <Users className="size-6" />
                <span className="font-medium hidden lg:block">Contacts</span>
            </div>

            <div className="overflow-y-auto w-full py-3 flex-1">
                {users.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`
                            w-full p-3 flex items-center gap-2 hover:bg-base-300 transition-colors ${
                                selectedUser?._id === user._id
                                    ? "bg-base-300 ring-1 ring-base-300"
                                    : ""
                            }`}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.name}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                                    rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">
                                {user.fullName}
                            </div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id)
                                    ? "Online"
                                    : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}
                {/* {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )} */}
            </div>

            <button
                className="border-b border-base-300 w-full gap-2 flex items-center p-4 border-t cursor-pointer"
                onClick={() => {
                    (
                        document.getElementById(
                            "my_modal_1"
                        ) as HTMLDialogElement
                    )?.showModal();
                }}
            >
                <UserPlus className="size-6" />
                <span className="font-medium hidden lg:block">
                    Add Contacts
                </span>
            </button>

            <RequestDialog />
        </aside>
    );
}

export default SideBar;
