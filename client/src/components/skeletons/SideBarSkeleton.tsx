import { UserPlus, Users } from "lucide-react";

const SidebarSkeleton = () => {
    // Create 8 skeleton items
    const skeletonContacts = Array(8).fill(null);

    return (
        <aside
            className={`h-full sm:w-50 md:w-60 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-300 overflow-hidden w-full`}
        >
            {/* Header */}
            <div className="border-b border-base-300 w-full gap-2 flex items-center p-5 justify-normal">
                <Users className="size-6" />
                <span className="ml-3 font-medium">Friends</span>
            </div>

            {/* Skeleton Contacts */}
            <div className="overflow-y-auto w-full py-3 flex-1">
                {skeletonContacts.map((_, idx) => (
                    <div
                        key={idx}
                        className="w-full p-3 flex items-center gap-3"
                    >
                        {/* Avatar skeleton */}
                        <div className="relative mx-auto lg:mx-0">
                            <div className="skeleton size-12 rounded-full" />
                        </div>

                        {/* User info skeleton - only visible on larger screens */}
                        <div className="text-left min-w-0 flex-1">
                            <div className="skeleton h-4 w-3/4 sm:w-4/5 mb-2" />
                            <div className="skeleton h-3 w-2/4 sm:w-3/5" />
                        </div>
                    </div>
                ))}
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
                <span className="font-medium">Add Friends</span>
            </button>
        </aside>
    );
};

export default SidebarSkeleton;
