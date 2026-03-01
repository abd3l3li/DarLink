
import ReqButton from "../utils/ReqButton.jsx";
import mapLogo from "../ui/map-pinned.svg";
import bedLogo from "../ui/bedLogo.svg";
import stateLogo from "../ui/stateLogo.svg";

export default function Card({ stay }) {

    return (

        <div className=" w-full rounded-2xl overflow-hidden col-span-1
        bg-[var(--color-border-gray)] shadow-md hover:shadow-xl 
        transition-all duration-300 max-w-sm"
        >
            
            <div className="relative">
                <img
                    src={stay.photo}
                    alt={stay.city}
                    className="w-full h-60 object-cover"
                    draggable={false}
                />
            </div>

                <div className="p-5 space-y-4">
                
                    <div className="flex items-center gap-2">
                        <img src={mapLogo} alt="map" className="w-5 h-5 opacity-70" draggable={false}/>
                        <span className="text-lg font-semibold text-[var(--color-text)]">
                        {stay.city}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-[var(--color-muted)]">

                        <div className="flex items-center gap-2">
                            <img src={bedLogo} alt="bed" className="w-5 h-5 opacity-70" draggable={false}/>
                            <span>
                                {stay.avSlots
                                ? stay.avSlots > 1
                                    ? `${stay.avSlots} Slots`
                                    : `${stay.avSlots} Slot`
                                : "0 Slots"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <img src={stateLogo} alt="state" className="w-5 h-5 opacity-80" draggable={false}/>
                            <span>{stay.state}</span>
                        </div>

                    </div>

                    <div className="border-t border-[var(--color-muted)] opacity-50"></div>

                    <div className="flex items-center justify-between">
                        <ReqButton />
                        <span className="text-lg font-bold text-[var(--color-text)]">
                        {stay.price ? `${stay.price} MAD` : "N/A"}
                        </span>
                    </div>

                </div>
        </div>
    );
}
