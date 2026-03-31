import { useNavigate } from "react-router-dom";
import { useNotifications, NOTIFICATION_TYPES } from "../utils/notificationContext";

export default function ReqButton({ stay }) {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    const queueAutoMessageForRequest = () => {
        const ownerId = stay?.owner?.id;
        const stayId = stay?.id;
        if (!ownerId || !stayId) return;

        const displayType = stay?.type || stay?.roomType || "Room";
        const displayPrice = stay?.price ?? stay?.pricePerNight;
        const autoMessage = `Hi! Is the stay in ${stay.city} (${displayType}, ${displayPrice ?? "N/A"} MAD) still available?`;

        sessionStorage.setItem("pendingChatMessage", JSON.stringify({
            id: `${ownerId}:${stayId}`,
            ownerId,
            stayId,
            message: autoMessage,
        }));
    };

    const handleRequest = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!stay) return;

    queueAutoMessageForRequest();

        // sending to yourself for now
        addNotification({
            type: NOTIFICATION_TYPES.SLOT_REQUEST,
            message: `New slot request for ${stay.city}`,
            link: `/chat/${stay.owner?.id}/${stay.id}`,
        });

        navigate(`/chat/${stay.owner?.id}/${stay.id}`);
    };

    return (
        <button 
            onClick={handleRequest}
            className="bg-[var(--color-border-gray)] text-[var(--color-secondary)] px-4 py-2 rounded-full 
            hover:bg-[var(--color-secondary)] hover:text-white transition-all duration-400 border-2 
            border-[var(--color-secondary)] font-bold hover:scale-[1.05] active:scale-100 hover:shadow-md
            h-11 w-34 flex items-center justify-center">
            Request Slot
        </button>
    );
}