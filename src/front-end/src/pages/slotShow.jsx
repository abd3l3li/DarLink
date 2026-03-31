import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ShowGallery from "../components/stays/showGallery.jsx";
import CreatePost from "./createPost";
import mapLogo from "../components/ui/map-pinned.svg";
import slotsCircle from "../components/ui/slotsCircle.svg";
import deleteButton from "../components/ui/deleteButton.svg";
import editButton from "../components/ui/editButton.svg";
import checkMark from "../components/ui/checkMark.svg";
import { useNotifications, NOTIFICATION_TYPES } from "../components/utils/notificationContext.jsx";
import { deleteStay, fetchMe, fetchStayById } from "../lib/staysApi.js";

export default function SlotShow({ isOwner = false }) {
    const params = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    const [editMode, setEditMode] = useState(false);
    const [stay, setStay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [meState, setMeState] = useState(null);

    const token = localStorage.getItem("token");
    const stayId = Number(params.slotId);
    const me = token ? meState : null;
    const isViewerOwner = Boolean(me?.id != null && stay?.owner?.id != null && me.id === stay.owner.id);
    const isAuthResolving = Boolean(token && meState == null);

    const loadMe = async () => {
        if (!token) return;
        const data = await fetchMe(token);
        setMeState(data);
    };

    const loadStay = async () => {
        setError("");
        setLoading(true);

        if (!Number.isFinite(stayId)) {
            setStay(null);
            setError("Invalid stay id");
            setLoading(false);
            return;
        }

        try {
            const data = await fetchStayById(stayId);
            setStay(data);
        } catch (e) {
            setStay(null);
            setError(e instanceof Error ? e.message : "Failed to load stay");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        loadMe().catch(() => {
            if (!cancelled) setMeState(null);
        });
        return () => {
            cancelled = true;
        };
    }, [token]);

    useEffect(() => {
        let cancelled = false;
        loadStay().catch(() => {
            if (!cancelled) {
                setStay(null);
                setLoading(false);
                setError("Failed to load stay");
            }
        });
        return () => {
            cancelled = true;
        };
    }, [stayId]);

    const editHandler = () => {
        setEditMode(true);
    }
    const deleteHandler = async () => {
        if (!stay?.id) return;
        if (!token) {
            setError("You must be logged in to delete a listing.");
            return;
        }
        try {
            await deleteStay(stay.id, token);
            navigate("/my-listings");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to delete stay");
        }
    }
    const reqHandle = () => {
        if (!stay?.id || !stay?.owner?.id) return;
        if (isViewerOwner) return;
        const displayType = stay.type || stay.roomType || "Room";
        const displayPrice = stay.price ?? stay.pricePerNight;
        const autoMessage = `Hi! Is the stay in ${stay.city} (${displayType}, ${displayPrice ?? "N/A"} MAD) still available?`;

        sessionStorage.setItem("pendingChatMessage", JSON.stringify({
            id: `${stay.owner.id}:${stay.id}`,
            ownerId: stay.owner?.id,
            stayId: stay.id,
            message: autoMessage,
        }));

        addNotification({
            type: NOTIFICATION_TYPES.SLOT_REQUEST,
            message: `New slot request for ${stay.city}`,
            link: `/chat/${stay.owner?.id}/${stay.id}`,
        });

        navigate(`/chat/${stay.owner?.id}/${stay.id}`);
    }

    const canManage = Boolean(
        stay && (isOwner || stay.admin || isViewerOwner || isAuthResolving),
    );

    const getInitial = (name) => {
        if (!name) return "?";
        return String(name).trim().charAt(0).toUpperCase() || "?";
    };


    return (
        <>
            {
                editMode ? 
                (
                    <CreatePost
                        stay={stay}
                        onSuccess={(updated) => {
                            setEditMode(false);
                            if (updated) setStay(updated);
                        }}
                        onCancel={() => setEditMode(false)}
                    />
                ) :
                (
                    <div className="min-h-screen flex flex-col">
                        <main className="flex-1 flex flex-col items-start md:mt-10
                                            justify-center text-left gap-10 py-10 max-w-7xl ">

                        {loading && (
                            <div className="w-full px-5 text-(--color-muted)">Loading stay…</div>
                        )}
                        {!loading && error && (
                            <div className="w-full px-5 text-red-500">{error}</div>
                        )}
                        {!loading && !error && !stay && (
                                <div className="w-full px-5 text-(--color-muted)">
                                Stay not found. <Link className="underline" to="/slots">Back to slots</Link>
                            </div>
                        )}
                            
                            {stay && (
                            <>
                            <div className="flex flex-col md:flex-row items-center justify-start gap-10 w-full max-w-7xl px-5 text-left">

                                <ShowGallery photos={stay.photos || []} />
                                <div className="space-y-2 flex flex-col items-start gap-3 ml-2 w-full md:w-xl max-w-md">
                                    <img src={mapLogo} alt="map" className="mr-4 w-7 h-7 opacity-80" draggable={false} />
                                        <span className="text-2xl font-semibold text-(--color-text)">
                                        {stay.city}
                                    </span>

                                    <div className="my-2 border-t border-(--color-muted) opacity-50 w-full"></div>

                                    <span className="ml-1 text-2xl font-semibold text-(--color-text)">
									{(stay.price ?? stay.pricePerNight) != null ? `${stay.price ?? stay.pricePerNight} MAD` : "N/A"}
                                    </span>

                                    <div className="my-2 border-t border-(--color-muted) opacity-50 w-full"></div>

                                    <div className="relative">
                                        <p className="mb-2 text-sm text-(--color-muted)">Available Slots</p>
                                        <span className="relative flex items-center gap-2 text-lg font-bold text-(--color-text)">
                                            <img src={slotsCircle} alt="slots" draggable={false}/>
                                            <span className="absolute left-1/2 top-1/2 -ml-4 -translate-x-1/2 -translate-y-1/2 text-(--color-text)">
										{stay.avSlots ?? stay.availableSlots ?? 0}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="my-2 border-t border-(--color-muted) opacity-50 w-full"></div>

                                    <div>
                                        <p className="text-sm text-(--color-muted)">Type</p>

                                            <button className="flex items-center gap-2 text-lg mt-2 ml-1 font-semibold text-(--color-text) bg-(--color-border-gray) px-3 py-2 rounded-lg">
											<input type="checkbox" checked={true} value="type" disabled />
											{stay.type || stay.roomType || "N/A"}
                                            </button>
                                    </div>

                                    <div className="my-2 border-t border-(--color-muted) opacity-50 w-full"></div>

                                    <div className="Buttons flex flex-col items-center justify-center w-full">
                                        {
                                            // edit and delete buttons for admin (post owner)
                                            canManage ? (

                                                <div className="flex items-center gap-7 mt-12">
                                                    <img src={deleteButton} alt="Delete" className="hover:scale-103 active:scale-98 transition-transform duration-200" onClick={deleteHandler} draggable={false}/>
                                                    <img src={editButton} alt="Edit" className="hover:scale-103 active:scale-98 transition-transform duration-208" onClick={editHandler} draggable={false}/>
                                                </div>
                                            ) :
                                            (
                                                <button className="flex items-center gap-2 text-lg mt-2 ml-1 
                                                    font-semibold text-(--color-surface) bg-(--color-secondary) 
                                                        px-18 py-2 rounded-2xl hover:scale-103 active:scale-98 
                                                        transition-transform duration-200 border-none"
                                                        onClick={reqHandle}>
                                                    Request Slot</button>
                                            )
                                        }
                                    </div>

                                </div>

                            </div>

                            <div className=" md:max-w-1/2 w-full px-5 mt-10 md:mx-30 
                                            flex flex-col items-start justify-center gap-5">
                                {/* next here */}
                                    <div className="my-2 border-t border-(--color-muted) opacity-80 w-full "></div>

                                    <div className="flex flex-col items-start mb-3 gap-10">
                                        <h2 className="text-xl text-left font-bold text-(--color-text)">What’s Included</h2>
                                        <div>
                                        {
                                            (stay.included && stay.included.length > 0) ? (
                                                <ul className="text-(--color-text) space-y-2">
                                                    {stay.included.map((item, index) => (
                                                        <li key={index}>
                                                            <img src={checkMark} alt="check" className="inline w-4 h-4 mr-2 opacity-80" draggable={false}/>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-(--color-muted)">No information provided.</p>
                                            )
                                        }
                                        </div>
                                    </div>

                                    <div className="my-2 border-t border-(--color-muted) opacity-80 w-full "></div>

                                    <div className="flex flex-col items-start mb-3 gap-10">
                                        <h2 className="text-xl text-left font-bold text-(--color-text)">House Rules & Expectations</h2>
                                        <div>
                                        {
                                            (stay.expectations && stay.expectations.length > 0) ? (
                                                <ul className="text-(--color-text) space-y-2">
                                                    {stay.expectations.map((item, index) => (
                                                        <li key={index}>
                                                            <img src={checkMark} alt="check" className="inline w-4 h-4 mr-2 opacity-80" draggable={false}/>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-(--color-muted)">No information provided.</p>
                                            )
                                        }
                                        </div>
                                    </div>
                                
                                    <div className="my-2 border-t border-(--color-muted) opacity-80 w-full "></div>

                                    <div className="flex flex-col items-start mb-3 gap-10">
                                        <h2 className="text-xl text-left font-bold text-(--color-text)">Room Details</h2>
                                        <div>
                                        {
                                            stay.details ? (
                                                <p className="text-italic font-semibold text-(--color-text)">{stay.details}</p>
                                            ) : (
                                                <p className="text-italic font-semibold text-(--color-muted)">No information provided.</p>
                                            )
                                        }
                                        </div>
                                    </div>
                                    
                                    <div className="my-2 border-t border-(--color-muted) opacity-80 w-full "></div>

                                    <div className="flex flex-col items-start mb-3 gap-10">
                                        <h2 className="text-xl text-left font-bold text-(--color-text)">Owner</h2>
                                        <div className="flex items-center gap-5">
                                            {stay.owner?.image && String(stay.owner.image).trim().length > 0 ? (
                                                <img
                                                    src={stay.owner.image}
                                                    alt={stay.owner?.name || "Owner"}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-(--color-border-gray)"
                                                    draggable={false}
                                                />
                                            ) : (
                                                <div
                                                    className="w-16 h-16 rounded-full border-2 border-(--color-border-gray) bg-(--color-bg) flex items-center justify-center text-2xl font-semibold text-(--color-text)"
                                                >
                                                    {getInitial(stay.owner?.name)}
                                                </div>
                                            )}
                                            <p className="text-italic font-semibold text-(--color-text)">{stay.owner?.name || "N/A"}</p>

                                            {!canManage && (
                                                <Link to={`/chat/${stay.owner?.id}/${stay.id}`}>
                                                    <button className="bg-(--color-secondary) text-(--color-surface) px-6 py-2 
                                                                        rounded-full ml-4 hover:bg-(--color-secondary-hover) 
                                                                        hover:scale-103 transition-transform duration-300"
                                                    >Contact</button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                            </div>
                            </>
                            )}
                        </main>
                    </div>   
                )
            }     
        
        </>
    );
}