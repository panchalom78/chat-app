import { Download, X } from "lucide-react";
import { addFlAttachment } from "../lib/utils";

const ImagePreview = ({
    imageLink,
    onClick,
}: {
    imageLink: string;
    onClick: () => void;
}) => {
    const downloadImageLink = addFlAttachment(imageLink);
    return (
        <div className="absolute w-full bg-black/80 h-full overflow-hidden z-20 flex justify-center items-center">
            <div className="flex flex-col gap-2 absolute top-0 right-0 p-2">
                <X
                    className="bg-black/50 size-13 p-3 cursor-pointer hover:bg-black/80"
                    onClick={onClick}
                />
                <a href={downloadImageLink} download>
                    <Download className="bg-black/50 size-13 p-3" />
                </a>
            </div>
            <img src={imageLink} alt="image" className="object-contain p-5" />
        </div>
    );
};

export default ImagePreview;
