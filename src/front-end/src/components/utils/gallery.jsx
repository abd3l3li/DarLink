import { useEffect } from "react";
import PhotoSystem from "./photoSystem";
import Upload from "./upload";

const orientationConfig = {
    vertical: {
        flex: "flex-col lg:flex-row ",
    },
    horizontal: {
        flex: "flex-col mt-4",
    },
};

export default function Gallery({ photos = [], fetchPhotos = () => {}, orientation }) {
    
    const config = orientationConfig[orientation];

    useEffect(() => {
        fetchPhotos();
    }, []);

    return (
        <div className={`
            gallery 
            w-full
            min-h-screen
            lg:min-h-[600px]
            flex
            ${config.flex}
            items-center 
            justify-center 
            gap-10 md:gap-8
            p-4
        `}>

            <Upload photos={photos} onUpload={fetchPhotos} />
            <PhotoSystem photos={photos} orientation={orientation} />
        </div>
    );
}