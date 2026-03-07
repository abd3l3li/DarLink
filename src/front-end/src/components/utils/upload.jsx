const MAX_PHOTOS = 5;

export default function Upload({ photos = [], onUpload }) {

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        fetch('http://backend:3001/upload', {
            method: 'POST',
            body: formData,
        })
            .then(res => res.json())
            .then(() => {
                // both point to the same memory
                if (onUpload) onUpload();
            })
            .catch(err => {
                console.error('Upload failed:', err);
            });
    };

    const atLimit = photos.length >= MAX_PHOTOS;

    return (
        <div className="upload-section flex flex-col gap-3 w-full max-w-[600px]">
            <p className="text-sm text-[var(--color-muted)]">
                {photos.length}/{MAX_PHOTOS} Uploaded Photos
            </p>
            <div className="upload-area w-full h-[250px] sm:h-[350px] lg:h-[400px] bg-[var(--color-border-surface)] flex items-center 
                            justify-center rounded-xl border-2 border-dashed border-[var(--color-border-gray)]">
                <label className={`flex flex-col items-center justify-center w-full h-full 
                                    ${atLimit ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                    <span className="text-sm text-[var(--color-muted)]">
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