import PhotoSystem from "./photoSystem";
import { useState } from "react";

export default function ShowGallery({ photos = [] }) {

    const [photo, setPhoto] = useState(photos[0] || null);

    const handlePhotoClick = (index) => {
        setPhoto(photos[index]);
    }

    return (
        
        <div className="
            showGallery 
            select-none
            w-full
            min-h-screen
            lg:min-h-[600px]
            flex
            flex-col mt-4
            items-center 
            justify-center 
            gap-10 md:gap-8
            p-4
            ">

            <div className="upload-section flex flex-col gap-3 w-full max-w-[600px]">
                <div className=" w-full h-[250px] sm:h-[350px] lg:h-[400px] bg-[var(--color-border-surface)] flex items-center 
                                justify-center rounded-xl border-2 border-dashed border-[var(--color-border-gray)]">
                    {photo ? (
                        <img src={photo.url} alt={photo.alt || "selected photo"} className="w-full h-full object-cover rounded-xl" draggable={false} />
                    ) : (
                        <span className="text-sm text-[var(--color-muted)]">Click a photo to preview</span>
                    )}
                </div>
            </div>
            <PhotoSystem photos={photos} orientation="horizontal" onClick={handlePhotoClick} />
        </div>
    );
}