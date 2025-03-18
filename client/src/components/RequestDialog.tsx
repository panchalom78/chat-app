import { Check, Plus, Search, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useChatStore } from "../store/useChatStore";

const RequestDialog = () => {
    const [isRequestSelected, setIsRequestSelected] = useState(true);
    const [search, setSearch] = useState("");
    const {
        requestedUsers,
        searchedUsers,
        getSearchedUsers,
        sendRequest,
        acceptRequest,
        rejectRequest,
    } = useChatStore();

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!search.trim()) return;
        await getSearchedUsers(search);
        setIsRequestSelected(false);
        setSearch("");
    };

    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>
                <div className="flex flex-col gap-2 items-center">
                    <h1 className="text-2xl font-bold">Add Contacts</h1>
                    <div className="flex items-center justify-around w-full">
                        <button
                            className={`px-4 py-2 rounded-3xl border-1 cursor-pointer ${
                                isRequestSelected
                                    ? "border-base-300"
                                    : "border-base-400"
                            }`}
                            onClick={() => {
                                setIsRequestSelected(false);
                            }}
                        >
                            Search
                        </button>
                        <button
                            className={`px-4 py-2 rounded-3xl border-1 cursor-pointer ${
                                isRequestSelected
                                    ? "border-base-400"
                                    : "border-base-300"
                            }`}
                            onClick={() => {
                                setIsRequestSelected(true);
                            }}
                        >
                            Requests
                        </button>
                    </div>
                    <form
                        className="relative w-full flex items-center"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            className="w-full p-2 border-1 border-secondary-content rounded-md"
                            placeholder="Search New Contacts"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                        />
                        <button
                            className="absolute right-2 size-6 rounded-full"
                            type="submit"
                        >
                            <Search className="size-5" />
                        </button>
                    </form>
                    <div className="flex-1 flex flex-col w-full gap-2 rounded-lg min-h-[300px] max-h-[300px] overflow-y-auto">
                        {isRequestSelected &&
                            (requestedUsers.length > 0 ? (
                                requestedUsers.map((user) => (
                                    <div
                                        className="w-full flex items-center gap-2 p-3 bg-base-300 rounded-lg"
                                        key={user._id}
                                    >
                                        <img
                                            src={
                                                user.profilePic || "/avatar.png"
                                            }
                                            alt="profile"
                                            className="size-6 rounded-full"
                                        />

                                        <p className="text-sm flex-1">
                                            {user.fullName}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <button
                                                className="p-2 hover:bg-red-500 transition-colors rounded-lg cursor-pointer"
                                                onClick={() => {
                                                    rejectRequest(user._id);
                                                }}
                                            >
                                                <X className="size-5" />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-green-500 transition-colors rounded-lg cursor-pointer"
                                                onClick={() => {
                                                    acceptRequest(user._id);
                                                }}
                                            >
                                                <Check className="size-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full flex-1 text-xl text-primary flex items-center justify-center">
                                    <p>No Friend Requests Found</p>
                                </div>
                            ))}

                        {!isRequestSelected &&
                            (searchedUsers.length > 0 ? (
                                searchedUsers.map((user) => (
                                    <div
                                        className="w-full flex items-center gap-2 p-3 bg-base-300 rounded-lg"
                                        key={user._id}
                                    >
                                        <img
                                            src={
                                                user.profilePic || "/avatar.png"
                                            }
                                            alt="profile"
                                            className="size-6 rounded-full"
                                        />

                                        <p className="text-sm flex-1">
                                            {user.fullName}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <button
                                                className="p-2 hover:bg-red-500 transition-colors rounded-lg cursor-pointer"
                                                onClick={() => {
                                                    sendRequest(user._id);
                                                }}
                                            >
                                                <Plus className="size-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full flex-1 text-xl text-primary flex items-center justify-center">
                                    <p>No Searched User Found</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default RequestDialog;
