import { useState, useEffect } from "react";
import PhotoSystem from "./photoSystem";
import Upload from "./upload";

export default function Gallery() {
    
    const [photos, setPhotos] = useState([]);

    const fetchPhotos = () => {
        fetch("http://localhost:3001/photos")
            .then(res => res.json())
            .then(data => setPhotos(data))
            .catch(() => setPhotos([]));
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    return (
        <div className="
            gallery 
            min-h-screen 
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