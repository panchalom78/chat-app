export const formatMessageTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

export function addFlAttachment(url: string, filename = "") {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) {
        console.error("Invalid Cloudinary URL: missing '/upload/'");
        return url; // Return unchanged if not a valid Cloudinary URL
    }

    const beforeUpload = url.substring(0, uploadIndex + "/upload/".length);
    const afterUpload = url.substring(uploadIndex + "/upload/".length);

    // If filename provided, set fl_attachment:filename, else just fl_attachment
    const flAttachment = filename
        ? `fl_attachment:${encodeURIComponent(filename)}`
        : "fl_attachment";

    return `${beforeUpload}${flAttachment}/${afterUpload}`;
}
