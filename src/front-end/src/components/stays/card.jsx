import ReqButton from "../utils/ReqButton.jsx";


export default function Card({ stay }) {

    return (
        <div className="card w-85 h-110 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-[var(--color-border-gray)]">
            <img src={stay.photo} alt={stay.city} className="w-full h-53 object-cover" />

        <div className="mb-1">
            <div className="city p-4 flex items-center">
                    {/* <img src={logo} alt="logo" className="w-6 h-6 inline-block mr-2" /> */}
                    <span className="text-lg text-[var(--color-text)] font-bold">{stay.city}</span>
                </div>

                <div className="details flex justify-between items-center">
                    <div className="p-4 flex items-center">
                        {/* <img src={bedLogo} alt="bed logo" className="w-4 h-4 inline-block mr-1" /> */}
                        <span className="text-sm text-[var(--color-muted)]">
                            {stay.avSlots ? ( stay.avSlots > 1 ? `${stay.avSlots} slots` : `${stay.avSlots} slot`) : '0 slots'}
                        </span>
                    </div>
                    <div className="p-4 flex items-center">
                        {/* <img src={stateLogo} alt="state logo" className="w-4 h-4 inline-block mr-1" /> */}
                        <span className="text-sm text-[var(--color-muted)]">{stay.state}</span>
                    </div>
                </div>

                <div className="price p-3 gap-4 flex items-center justify-between mt-13">
                    <ReqButton />
                    <span className=" text-lg font-bold">{stay.price ? `${stay.price} MAD` : 'N/A'}</span>
                </div>
            </div>
            
        </div>

    );
}