import { Image, Laugh, Send, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import EmojiPicker, { Theme } from "emoji-picker-react";

const MessageInput = () => {
    const [text, setText] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { sendMessage } = useChatStore();

    function insertEmojiAtCursor(input: HTMLInputElement, emoji: string) {
        if (!input) return;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const text = input.value;

        const before = text.slice(0, start);
        const after = text.slice(end);

        const newText = before + emoji + after;
        setText(newText);

        // Update cursor position after emoji
        requestAnimationFrame(() => {
            input.focus();
            input.setSelectionRange(start + emoji.length, start + emoji.length);
        });
    }

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
        <div className="w-full sm:p-4 p-1">
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
                <div className="relative">
                    <button
                        className="size-7 sm:size-10 rounded-full bg-black/10 flex items-center justify-center"
                        type="button"
                        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    >
                        <Laugh className="size-4 sm:size-5 text-zinc-400" />
                    </button>

                    {isEmojiPickerOpen && (
                        <div className="absolute -top-115 left-0 z-50">
                            <EmojiPicker
                                theme={Theme.DARK}
                                onEmojiClick={(emojiData) => {
                                    if (inputRef.current) {
                                        insertEmojiAtCursor(
                                            inputRef.current,
                                            emojiData.emoji
                                        );
                                    }
                                    setIsEmojiPickerOpen(false);
                                }}
                            />
                        </div>
                    )}
                </div>
                <input
                    ref={inputRef}
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
                    className={`size-7 sm:size-10 rounded-full bg-black/10 flex items-center justify-center ${
                        imagePreview ? "text-emerald-500" : "text-zinc-400"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Image className="size-4 sm:size-5" />
                </button>
                <button
                    className="size-7 sm:size-10 rounded-full bg-black/10 flex items-center justify-center"
                    type="submit"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send className="size-4 sm:size-5 text-zinc-400" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
