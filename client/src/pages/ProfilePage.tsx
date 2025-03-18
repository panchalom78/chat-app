import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

const ProfilePage = () => {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState<
        string | ArrayBuffer | null
    >(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
            if (typeof base64Image === "string") {
                await updateProfile({ profilePic: base64Image });
            }
        };
    };
    return (
        <div className="h-screen mt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Profile</h1>
                        <p className="mt-3">Your Profie Information</p>
                    </div>

                    <div className="flex flex-col items-center gap-4 p-4">
                        <div className="relative">
                            <img
                                src={
                                    selectedImage ||
                                    authUser.profilePic ||
                                    "/avatar.png"
                                }
                                alt="Profile"
                                className="size-32 rounded-full object-cover border-4 p-1"
                            />

                            <label
                                htmlFor="avatar-upload"
                                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full transition-all duration-200 ${
                                    isUpdatingProfile
                                        ? "animate-pulse pointer-events-none"
                                        : ""
                                }`}
                            >
                                <Camera className="size-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    disabled={isUpdatingProfile}
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {isUpdatingProfile
                                ? "Uploading"
                                : "Click the camera icon to update your photo"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1 text-zinc-400">
                                <User className="size-4" />
                                Full Name
                            </div>
                            <div className="px-4 py-2 border bg-base-200 rounded-lg">
                                {authUser?.fullName}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1 text-zinc-400">
                                <Mail className="size-4" />
                                Email Address
                            </div>
                            <div className="px-4 py-2 border bg-base-200 rounded-lg">
                                {authUser?.email}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="px-5 mx-auto text-zinc-500">
                            <h1>Account Information</h1>
                            <div className="flex items-center justify-between border-b border-zinc-500 text-sm mt-2 py-2">
                                <p>Member Since</p>
                                <p>{authUser.createdAt?.split("T")[0]}</p>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2 py-  2 ">
                                <p>Account Status</p>
                                <p className="text-green-500">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
