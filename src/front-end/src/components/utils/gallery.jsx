import { useEffect } from "react";
import PhotoSystem from "./photoSystem";
import Upload from "./upload";

export default function Gallery({ photos = [], fetchPhotos = () => {} }) {
    

    useEffect(() => {
        fetchPhotos();
    }, []);

    return (
        <div className="
            gallery 
            w-full
            min-h-screen
            lg:min-h-[600px]
            flex 
            flex-col lg:flex-row 
            items-center 
            justify-center 
            gap-10 md:gap-8
            p-4
        ">

            <Upload photos={photos} onUpload={fetchPhotos} />
            <PhotoSystem photos={photos} />
        </div>
    );
}