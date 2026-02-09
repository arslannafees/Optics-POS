import React from "react";
import Image from "next/image";

const NoData = ({ message = "No data", className = "" }) => {
    return (
        <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
            <div className="relative w-13 h-13 opacity-60">
                <Image
                    src="/Images/no-data.png"
                    alt="No data"
                    fill
                    sizes="52px"
                    className="object-contain"
                    priority={true}
                />
            </div>
            <p className="text-gray-400 text-sm font-medium">{message}</p>
        </div>
    );
};
export default NoData;