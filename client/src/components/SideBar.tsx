import { UserPlus, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import SideBarSkeleton from "./skeletons/SideBarSkeleton";
import { useEffect } from "react";
import RequestDialog from "./RequestDialog";
import UserCard from "./UserCard";
function SideBar() {
    const { users, isUsersLoading, getUsers, getRequstedUsers, selectedUser } =
        useChatStore();

    useEffect(() => {
        getUsers();
        getRequstedUsers();
    }, []);

    if (isUsersLoading) return <SideBarSkeleton />;

    return (
        <aside
            className={`h-full sm:w-50 md:w-60 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-300 overflow-hidden ${
                selectedUser ? "w-0" : "w-full"
            }`}
        >
            <div className="border-b border-base-300 w-full gap-2 flex items-center p-5 justify-normal">
                <Users className="size-6" />
                <span className="ml-3 font-medium">Friends</span>
            </div>

            <div className="overflow-y-auto w-full py-3 flex-1">
                {users.map((user) => (
                    <UserCard user={user} key={user._id} />
                ))}
                {/* {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )} */}
            </div>

            <button
                className="border-b border-base-300 w-full gap-2 hidden sm:flex items-center p-4 border-t cursor-pointer justify-center lg:justify-normal"
                onClick={() => {
                    (
                        document.getElementById(
                            "my_modal_1"
                        ) as HTMLDialogElement
                    )?.showModal();
                }}
            >
                <UserPlus className="size-6" />
                <span className="font-medium hidden lg:block">Add Friends</span>
            </button>

            <button
                className={`sm:hidden gap-2 p-4 absolute bottom-5 right-5 bg-black/50 rounded-4xl cursor-pointer ${
                    selectedUser ? "hidden" : "flex"
                }`}
                onClick={() => {
                    (
                        document.getElementById(
                            "my_modal_1"
                        ) as HTMLDialogElement
                    )?.showModal();
                }}
            >
                <UserPlus className="size-6" />
                <span className="font-medium">Add</span>
            </button>

            <RequestDialog />
        </aside>
    );
}

export default SideBar;
