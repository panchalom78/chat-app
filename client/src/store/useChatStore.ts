import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib";
import { useAuthStore } from "./useAuthStore";

type ChatStore = {
    messages: any[];
    users: any[];
    requestedUsers: any[];
    searchedUsers: any[];
    selectedUser: any | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    isSearchedUsersLoading: boolean;
    setSelectedUser: (user: any) => void;
    getUsers: () => Promise<void>;
    getSearchedUsers: (query: string) => Promise<void>;
    getRequstedUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendRequest: (requestId: string) => Promise<void>;
    acceptRequest: (requestId: string) => Promise<void>;
    rejectRequest: (requestId: string) => Promise<void>;
    sendMessage: (message: { text: string; image: string }) => void;
    subscribeToMessage: () => void;
    unsubscribeToMessage: () => void;
    addRequestChecker: () => void;
    removeRequestChecker: () => void;
    acceptRequestChecker: () => void;
    removeAcceptRequestChecker: () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    requestedUsers: [],
    searchedUsers: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSearchedUsersLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            const modifiedUsers = res.data.map((userData: any) => ({
                ...userData,
                isNewNotificationReceived: false,
            }));
            set({ users: modifiedUsers });
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    setSelectedUser: (user: any) => {
        if (user !== null && user.isNewNotificationReceived === true) {
            const modifiedUsers = get().users;
            modifiedUsers.forEach((userData) => {
                if (userData._id === user._id) {
                    userData.isNewNotificationReceived = false;
                    return;
                }
            });
            set({ users: modifiedUsers });
        }
        set({ selectedUser: user });
    },

    sendMessage: async (message) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(
                `/message/send/${selectedUser._id}`,
                message
            );
            set({ messages: [...messages, res.data] });
            // if(selectedUser._id == import.meta.env.VITE_REACT_APP_CHATBOT_ID){
            //     set({messages:[...messages,{senderId:selectedUser._id,receiverId:useAuthStore.getState().authUser?._id,text:"<span></span>"}]})
            // }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
    getSearchedUsers: async (query) => {
        set({ isSearchedUsersLoading: true });
        try {
            const res = await axiosInstance.post("/request/search", { query });
            set({ searchedUsers: res.data });
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSearchedUsersLoading: false });
        }
    },
    getRequstedUsers: async () => {
        try {
            const res = await axiosInstance.get("/request");
            set({ requestedUsers: res.data });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
    sendRequest: async (requestId) => {
        try {
            const { searchedUsers } = get();
            set({
                searchedUsers: searchedUsers.filter(
                    (user) => user._id !== requestId
                ),
            });
            const res = await axiosInstance.post(`/request/send/${requestId}`);
            toast.success(res.data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
    acceptRequest: async (requestId) => {
        try {
            const { requestedUsers } = get();
            const requestUser = requestedUsers.find(
                (user) => user._id === requestId
            );
            set({
                requestedUsers: requestedUsers.filter(
                    (user) => user._id !== requestId
                ),
                users: [requestUser, ...get().users],
            });
            const res = await axiosInstance.post(
                `/request/accept/${requestId}`
            );
            toast.success(res.data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
    rejectRequest: async (requestId) => {
        try {
            const { requestedUsers } = get();
            set({
                requestedUsers: requestedUsers.filter(
                    (user) => user._id !== requestId
                ),
            });
            const res = await axiosInstance.post(
                `/request/reject/${requestId}`
            );
            2;
            toast.success(res.data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (message: any) => {
            console.log("socket message", message);

            if (
                get().selectedUser === null ||
                get().selectedUser._id.toString() !==
                    message.senderId.toString()
            ) {
                const index = get().users.findIndex(
                    (user: any) =>
                        user._id.toString() === message.senderId.toString()
                );
                console.log("index", index);

                if (index !== -1) {
                    const modifiedUsers = get().users;
                    const [user] = modifiedUsers.splice(index, 1);
                    user.isNewNotificationReceived = true;
                    toast(`New message received from - ${user.fullName}`, {
                        icon: "💬",
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                    });
                    modifiedUsers.unshift(user);
                    set({ users: modifiedUsers });
                }
                return;
            }

            set({ messages: [...get().messages, message] });
        });
    },
    unsubscribeToMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    addRequestChecker: () => {
        const socket = useAuthStore.getState().socket;
        socket.on("addRequest", (user: any) => {
            set({ requestedUsers: [user, ...get().requestedUsers] });
            toast.success(user.fullName + " sent you a request");
        });
    },
    removeRequestChecker: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("addRequest");
    },
    acceptRequestChecker: () => {
        const socket = useAuthStore.getState().socket;
        socket.on("acceptRequest", (user: any) => {
            set({ users: [user, ...get().users] });
            toast.success(user.fullName + " accepted your request");
        });
    },
    removeAcceptRequestChecker: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("acceptRequest");
    },
}));
