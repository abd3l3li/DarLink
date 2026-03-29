const MAX_PHOTOS = 5;

export default function Upload({ photos = [], onPhotoAdd }) {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = "";
        if (photos.length >= MAX_PHOTOS) return;

        const reader = new FileReader();
        reader.onload = () => onPhotoAdd({
            file,
            preview: reader.result,
        });
        reader.readAsDataURL(file);
    };

    const atLimit = photos.length >= MAX_PHOTOS;

    return (
        <div className="upload-section flex flex-col gap-3 w-full max-w-[600px]">
            <p className="text-sm text-(--color-muted)">
                {photos.length}/{MAX_PHOTOS} Photos
            </p>
            <div className="upload-area w-full h-[250px] sm:h-[350px] lg:h-[400px] bg-(--color-border-surface) flex items-center 
                            justify-center rounded-xl border-2 border-dashed border-(--color-border-gray)">
                <label className={`flex flex-col items-center justify-center w-full h-full 
                                    ${atLimit ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                    <span className="text-sm text-(--color-muted)">
                        {atLimit ? "Photo limit reached" : "Upload Area"}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={atLimit}
                        onChange={handleFileChange}
                    />
                </label>
            </div>
        </div>
    );
}
