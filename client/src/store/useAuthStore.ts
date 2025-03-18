import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
    import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

type AuthStore = {
    authUser: any;
    isSigningIn: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
    signup: (data: {
        fullName: string;
        email: string;
        password: string;
    }) => void;
    logout: () => void;
    login: (data: { email: string; password: string }) => void;
    updateProfile: (data: { profilePic: string }) => void;
    onlineUsers: any[];
    socket: any;
    connectSocket: () => void;
    disconnectSocket: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
    authUser: null,
    isSigningIn: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log(error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        try {
            set({ isSigningIn: true });
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data });
            get().connectSocket();
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningIn: false });
        }
    },
    logout: async () => {
        const response = await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success(response.data.message);
        get().disconnectSocket();
    },
    login: async (data) => {
        try {
            set({ isLoggingIn: true });
            const response = await axiosInstance.post("/auth/login", data);
            set({ authUser: response.data });
            get().connectSocket();
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile Updated Succesfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to Update Profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();
        set({ socket: socket });

        socket.on("online", (userId) => {
            set({ onlineUsers: [...get().onlineUsers, ...userId] });
        });

        socket.on("offline", (userId) => {
            set({
                onlineUsers: get().onlineUsers.filter((id) => id !== userId),
            });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket?.disconnect();
    },
}));
