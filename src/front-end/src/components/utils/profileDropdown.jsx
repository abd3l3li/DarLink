import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function ProfileDropdown({ isOpen, onClose }) {

    const [showEditProfile, setShowEditProfile] = useState(false);


    const [profile, setProfile] = useState({
        name: "",
        email: "",
        image: "",
    });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "************",
        image: "",
    });

    useEffect(() => {

        const res = fetch("https://localhost:1337/api/users/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch user profile");
            }
            return res;
        })
        .then(res => res.json())
        .then(data => {
            setProfile({
                name: data.username,
                email: data.email,
                image: data.avatarUrl || "",
            });
            setFormData((prev) => ({
                ...prev,
                name: data.username,
                email: data.email,
                image: data.avatarUrl || "",
            }));
        })
        .catch(err => {
            console.error("Failed to fetch user profile:", err);
        });
    }, []);

    const handleEditClick = () => {

        setFormData((prev) => ({
            ...prev,
            name: profile.name,
            email: profile.email,
            image: profile.image || "",
        }));
        setShowEditProfile(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleCancelEdit = () => {

        setFormData((prev) => ({
            ...prev,
            name: profile.name,
            email: profile.email,
            image: profile.image || "",
        }));
        setShowEditProfile(false);
    };

    const handleSaveChanges = () => {

        setProfile((prev) => ({
            ...prev,
            name: formData.name,
            email: formData.email,
            image: formData.image || "",
        }));

        const token = localStorage.getItem("token");
        console.log("token:", token);
        fetch("https://localhost:1337/api/users/me", {
            
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                username: formData.name,
                email: formData.email,
                avatarUrl: formData.image,
                password: formData.password
            }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to update profile");
            }
            return res.json();
        })
        .then(data => {
            console.log("Profile updated successfully:", data);
        })
        .catch(err => {
            console.error("Failed", err);
        });

        setShowEditProfile(false);
        onClose();
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem("token");
        window.location.href = "/";
        onClose();
    };

    const getInitial = (name) => {
        if (!name) return "?";
        return name.trim().charAt(0).toUpperCase();
    };

    const displayProfileImage = profile.image && profile.image.trim().length > 0 ? profile.image : null;

    if (!isOpen) return null;

    // edit mode view
    if (showEditProfile) {
        return (
            <div 
                className="absolute right-0 top-14 w-72 bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border-gray)] z-50 overflow-hidden"
                data-dropdown
                onClick={(e) => e.stopPropagation()}
            >
                

                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-gray)]">
                    <button
                        onClick={handleCancelEdit}
                        className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-xl"
                    >
                        ×
                    </button>
                    <span className="font-semibold text-[var(--color-text)]">Edit Profile</span>
                    <div className="w-5"></div>
                </div>

                <div className="flex flex-col items-center py-4">
                    <label className="relative cursor-pointer">
                        {formData.image && formData.image.trim().length > 0 ? (
                            <img
                                src={formData.image}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-border-gray)]"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full border-2 border-[var(--color-border-gray)] bg-[var(--color-bg)] 
                                            flex items-center justify-center text-2xl font-semibold text-[var(--color-text)]">
                                {getInitial(formData.name)}
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">＋</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>


                <div className="px-4 pb-4 space-y-3">
                    <div>
                        <label className="text-sm font-medium text-[var(--color-text)]">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--color-border-gray)] 
                                        bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-secondary)]"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-[var(--color-text)]">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--color-border-gray)] 
                                        bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-secondary)]"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-[var(--color-text)]">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--color-border-gray)] 
                                        bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-secondary)]"
                        />
                    </div>

                    <button
                        onClick={handleSaveChanges}
                        className="w-full mt-3 py-2 bg-[var(--color-secondary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        );
    }

    // default dropdown view
    return (
        <div 
            className="absolute right-0 top-14 w-64 bg-[var(--color-surface)] rounded-2xl shadow-xl 
                        border border-[var(--color-border-gray)] z-50 overflow-hidden"
            data-dropdown
            onClick={(e) => e.stopPropagation()}
        >
            
            <div className="flex items-center px-4 py-3 border-b border-[var(--color-border-gray)]">
                <button
                    onClick={onClose}
                    className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                    <span className="text-lg">‹</span>
                </button>
                <span className="ml-3 font-semibold text-[var(--color-text)]">Profile</span>
            </div>

            {/* info */}
            <div className="flex flex-col items-center py-4">
                {displayProfileImage ? (
                    <img
                        src={displayProfileImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-border-gray)]"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full border-2 border-[var(--color-border-gray)] bg-[var(--color-bg)] 
                                    flex items-center justify-center text-2xl font-semibold text-[var(--color-text)]">
                        {getInitial(profile.name)}
                    </div>
                )}
                <span className="mt-2 font-medium text-[var(--color-text)]">{profile.name}</span>
            </div>

            {/* menu */}
            <div className="px-2 pb-3">
                <button
                    onClick={handleEditClick}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-left"
                >
                    <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[var(--color-text)]">Edit profile</span>
                </button>

                <Link
                    to="/my-listings"
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
                >
                    <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 
                                                012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-[var(--color-text)]">Show your listings</span>
                </Link>

                <Link
                    to="/chat/owner-1"
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-left"
                >
                    <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6a5 5 0 005-5V7a2 2 0 00-2-2H6a2 
                                                2 0 00-2 2v4a5 5 0 005 5z" />
                    </svg>
                    <span className="text-[var(--color-text)]">Chat</span>
                </Link>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-left"
                    onClick={() => {
                        const footer = document.querySelector('footer');
                        if (footer) {
                            footer.scrollIntoView({ behavior: 'smooth' });
                        }
                        onClose();
                    }}
                >
                    <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[var(--color-text)]">Terms and Policies</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-left"
                >
                    <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-[var(--color-text)] hover:text-red-400">Log out</span>
                </button>
            </div>

        </div>
    );
}
