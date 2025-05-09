import { UserPlus, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import SideBarSkeleton from "./skeletons/SideBarSkeleton";
import { useEffect } from "react";
import RequestDialog from "./RequestDialog";
import UserCard from "./UserCard";
function SideBar() {
    const { users, isUsersLoading, getUsers, getRequstedUsers } =
        useChatStore();

    useEffect(() => {
        getUsers();
        getRequstedUsers();
    }, []);

    if (isUsersLoading) return <SideBarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full gap-2 flex items-center p-5 justify-center lg:justify-normal">
                <Users className="size-6" />
                <span className="ml-3 font-medium hidden lg:block">
                    Friends
                </span>
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
                className="border-b border-base-300 w-full gap-2 flex items-center p-4 border-t cursor-pointer justify-center lg:justify-normal"
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

            <RequestDialog />
        </aside>
    );
}

export default SideBar;
