import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { uploadImages } from "@/lib/uploadsApi.js";
import { clearStoredAuth, getStoredToken, handleAuthRejected } from "@/lib/auth.js";


export default function ProfileDropdown({ isOpen, onClose }) {

    const [showEditProfile, setShowEditProfile] = useState(false);


    const [profile, setProfile] = useState({
        name: "",
        email: "",
        image: "",
        twoFactorEnabled: false,
        twoFactorVerified: false,
    });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "************",
        image: "",
    });

    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

    useEffect(() => {

        const token = getStoredToken();
        if (!token) return;

        fetch("/api/users/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (handleAuthRejected(res)) {
                return null;
            }
            if (!res.ok) {
                throw new Error("Failed to fetch user profile");
            }
            return res;
        })
        .then(res => (res ? res.json() : null))
        .then(data => {
            if (!data) return;
            setProfile({
                name: data.username,
                email: data.email,
                image: data.avatarUrl || "",
                twoFactorEnabled: data.twoFactorEnabled || false,
                twoFactorVerified: data.twoFactorVerified || false,
            });
            setFormData((prev) => ({
                ...prev,
                name: data.username,
                email: data.email,
                image: data.avatarUrl || "",
            }));
            setSelectedAvatarFile(null);
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
            password: "",
        }));
        setSelectedAvatarFile(null);
        setShowEditProfile(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedAvatarFile(file);

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
            password: "",
        }));
        setSelectedAvatarFile(null);
        setShowEditProfile(false);
    };

    const handleSaveChanges = async () => {

        const token = localStorage.getItem("token");
        console.log("token:", token);
        try {
            if (!token) throw new Error("Missing token");

            const emailChanged =
                typeof formData.email === "string" &&
                formData.email.trim().length > 0 &&
                formData.email.trim() !== (profile.email || "").trim();

            const passwordChanged =
                typeof formData.password === "string" &&
                formData.password.trim().length > 0 &&
                formData.password !== "************";

            const logoutAndRedirect = async () => {
                try {
                    await fetch("/api/users/me/logout", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } catch {
                    // if server logout fails, we still clear local auth below.
                } finally {
                    clearStoredAuth();
                    window.location.href = "/log-in";
                }
            };

            const uploadedUrls = selectedAvatarFile
                ? await uploadImages([selectedAvatarFile], token)
                : [];
            const avatarUrl = uploadedUrls[0] || profile.image || "";

            const res = await fetch("/api/users/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: formData.name,
                    email: formData.email,
                    avatarUrl,
                    newPassword: passwordChanged ? formData.password : undefined
                }),
            });

            if (handleAuthRejected(res)) return;

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || "Failed to update profile");
            }
            const data = await res.json().catch(() => null);
            console.log("Profile updated successfully:", data);

            // if credentials changed, force a fresh login for safety.
            const serverEmail = data?.email;
            const serverEmailChanged = emailChanged && typeof serverEmail === "string" && serverEmail !== profile.email;
            if (serverEmailChanged || passwordChanged) {
                await logoutAndRedirect();
                return;
            }

            setProfile((prev) => ({
                ...prev,
                name: formData.name,
                email: formData.email,
                image: avatarUrl,
            }));
            setFormData((prev) => ({
                ...prev,
                image: avatarUrl,
            }));
            setSelectedAvatarFile(null);
        } catch (err) {
            console.error("Failed", err);
            alert(err instanceof Error ? err.message : "Failed to update profile");
        }

        setShowEditProfile(false);
        onClose();
    };

    const handleLogout = () => {
        console.log("Logging out...");
        const token = getStoredToken();
    // best-effort server logout; always clear local auth to avoid being stuck.
        fetch("/api/users/me/logout", {
            method: "POST",
            headers: token
                ? {
                    Authorization: `Bearer ${token}`
                }
                : {},
        })
            .catch(() => {
                // ignore logout network errors and always clear local auth.
            })
            .finally(() => {
                clearStoredAuth();
                window.location.href = "/log-in";
            });
        onClose();
    };

    const handleEnable2FA = () => {
        window.location.href = "/2fa-setup";
    };

    const handleDisable2FA = async () => {
        const token = getStoredToken();
        try {
            const res = await fetch("/api/auth/2fa/disable", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (handleAuthRejected(res)) return;

            if (res.ok) {
                setProfile(prev => ({ ...prev, twoFactorEnabled: false, twoFactorVerified: false }));
                alert("2FA disabled successfully");
            } else {
                const errorText = await res.text();
                alert("Failed to disable 2FA: " + errorText);
            }
        } catch (error) {
            console.error("Error disabling 2FA:", error);
            alert("An error occurred while disabling 2FA");
        }
    };

    const getInitial = (name) => {
        if (!name) return "?";
        return name.trim().charAt(0).toUpperCase();
    };

    const displayProfileImage = profile.image && profile.image.trim().length > 0 ? profile.image : null;

    if (!isOpen) return null;

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

                    <div className="pt-2 border-t border-[var(--color-border-gray)]">
                        <label className="text-sm font-medium text-[var(--color-text)]">Two-Factor Authentication</label>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-[var(--color-muted)]">
                                {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                            </span>
                            <button
                                onClick={profile.twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
                                className="px-3 py-1 text-xs bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
                            >
                                {profile.twoFactorEnabled ? "Disable" : "Enable"}
                            </button>
                        </div>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2M7 7h10" />
                    </svg>
                    <span className="text-[var(--color-text)]">Show your listings</span>
                </Link>

                <Link
                    to="/chat"
                    state={{ fromProfileChat: true }}
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-left"
                >
                    <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6a5 5 0 005-5V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4a5 5 0 005 5z" />
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
