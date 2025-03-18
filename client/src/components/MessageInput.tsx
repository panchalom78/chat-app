import { Image, Send, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { sendMessage } = useChatStore();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (!file?.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview as string,
            });

            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full p-4">
            {imagePreview && (
                <div className="mb-3 flex items-center gap=2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="image preview"
                            className="size-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                            onClick={removeImage}
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}
            <form
                className="flex items-center justify-evenly gap-4 p-1"
                onSubmit={handleSendMessage}
            >
                <input
                    type="text"
                    className="flex-1 w-full p-4 input input-bordered"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                />
                <button
                    type="button"
                    className={`hidden sm:flex btn btn-circle ${
                        imagePreview ? "text-emerald-500" : "text-zinc-400"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Image size={20} />
                </button>
                <button
                    className="btn btn-circle"
                    type="submit"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
