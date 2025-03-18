const RequestSearchSkeleton = () => {
    const skeletonMessages = Array(6).fill(null);
    return (
        <div className="flex-1 flex flex-col w-full gap-2 rounded-lg min-h-[300px] max-h-[300px] overflow-y-auto">
            {skeletonMessages.map((_, idx) => (
                <div
                    className="w-full flex items-center gap-2 p-3 bg-base-300 rounded-lg skeleton min-h-7"
                    key={idx}
                ></div>
            ))}
        </div>
    );
};

export default RequestSearchSkeleton;
