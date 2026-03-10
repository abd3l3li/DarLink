import { useParams, Link } from "react-router-dom";
import { getStayById } from "../components/stays/staysTemp.js";

import { useState } from "react";
import ShowGallery from "../components/stays/showGallery.jsx";
import CreatePost from "./createPost";
import mapLogo from "../components/ui/map-pinned.svg";
import slotsCircle from "../components/ui/slotsCircle.svg";
import deleteButton from "../components/ui/deleteButton.svg";
import editButton from "../components/ui/editButton.svg";
import checkMark from "../components/ui/checkMark.svg";

export default function SlotShow() {
    const params = useParams();
    const stay = getStayById(params.slotId) || {};

    const [editMode, setEditMode] = useState(false);

    const editHandler = () => {
        setEditMode(true);
    }
    const deleteHandler = () => {
        console.log("delete request sent");
    }
    const reqHandle = () => {
        console.log("slot request sent");
    }


    return (
        <>
            {
                editMode ? 
                (
                    <CreatePost stay={stay}/>
                ) :
                (
                    <div className="min-h-screen flex flex-col">
                        <main className="flex-1 flex flex-col items-start md:mt-10
                                            justify-center text-left gap-10 py-10 max-w-7xl ">
                            
                            <div className="flex flex-col md:flex-row items-center justify-start gap-10 w-full max-w-7xl px-5 text-left">

                                <ShowGallery photos={stay.photos || []} />
                                <div className="space-y-2 flex flex-col items-start gap-3 ml-2 w-full md:w-xl max-w-md">
                                    <img src={mapLogo} alt="map" className="mr-4 w-7 h-7 opacity-80" draggable={false} />
                                    <span className="text-2xl font-semibold text-[var(--color-text)]">
                                        {stay.city}
                                    </span>

                                    <div className="my-2 border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                                    <span className="ml-1 text-2xl font-semibold text-[var(--color-text)]">
                                        {stay.price ? `${stay.price} MAD` : "N/A"}
                                    </span>

                                    <div className="my-2 border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                                    <div className="relative">
                                        <p className="mb-2 text-sm text-[var(--color-muted)]">Available Slots</p>
                                        <span className="relative flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
                                            <img src={slotsCircle} alt="slots" draggable={false}/>
                                            <span className="absolute left-1/2 top-1/2 -ml-4 -translate-x-1/2 -translate-y-1/2 text-[var(--color-text)]">
                                                {stay.avSlots}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="my-2 border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                                    <div>
                                        <p className="text-sm text-[var(--color-muted)]">Type</p>

                                            <button className="flex items-center gap-2 text-lg mt-2 ml-1 font-semibold text-[var(--color-text)] bg-[var(--color-border-gray)] px-3 py-2 rounded-lg">
                                                <input type="checkbox" checked={true} value="type" disabled="true"/>
                                                {stay.type}
                                            </button>
                                    </div>

                                    <div className="my-2 border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                                    <div className="Buttons flex flex-col items-center justify-center w-full">
                                        {
                                            // edit and delete buttons for admin
                                            (stay.admin) ? (

                                                <div className="flex items-center gap-7 mt-12">
                                                    <img src={deleteButton} alt="Delete" className="hover:scale-103 active:scale-98 transition-transform duration-200" onClick={deleteHandler} draggable={false}/>
                                                    <img src={editButton} alt="Edit" className="hover:scale-103 active:scale-98 transition-transform duration-208" onClick={editHandler} draggable={false}/>
                                                </div>
                                            ) :
                                            (
                                                <button className="flex items-center gap-2 text-lg mt-2 ml-1 
                                                        font-semibold text-[var(--color-surface)] bg-[var(--color-secondary)] 
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
                                    <div className="my-2 border-t border-[var(--color-muted)] opacity-80 w-full "></div>

                                    <div className="flex flex-col items-start mb-3 gap-10">
                                        <h2 className="text-xl text-left font-bold text-[var(--color-text)]">What’s Included</h2>
                                        <div>
                                        {
                                            (stay.included) ? (
                                                <ul className="text-[var(--color-text)] space-y-2">
                                                    {stay.included.map((item, index) => (
                                                        <li key={index}>
                                                            <img src={checkMark} alt="check" className="inline w-4 h-4 mr-2 opacity-80" draggable={false}/>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-[var(--color-muted)]">No information provided.</p>
                                            )
                                        }
                                        </div>
                                    </div>

                                    <div className="my-2 border-t border-[var(--color-muted)] opacity-80 w-full "></div>

                                    <div className="flex flex-col items-start mb-3 gap-10">
                                        <h2 className="text-xl text-left font-bold text-[var(--color-text)]">House Rules & Expectations</h2>
                                        <div>
                                        {
                                            stay.expectations ? (
                                                <ul className="text-[var(--color-text)] space-y-2">
                                                    {stay.expectations.map((item, index) => (
                                                        <li key={index}>
                                                            <img src={checkMark} alt="check" className="inline w-4 h-4 mr-2 opacity-80" draggable={false}/>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-[var(--color-muted)]">No information provided.</p>
                                            )
                                        }
                                        </div>
                                    </div>
                                
                                    <div className="my-2 border-t border-[var(--color-muted)] opacity-80 w-full "></div>

                                    <div className="flex flex-col items-start mb-3 gap-10">
                                        <h2 className="text-xl text-left font-bold text-[var(--color-text)]">Room Details</h2>
                                        <div>
                                        {
                                            stay.details ? (
                                                <p className="text-italic font-semibold text-[var(--color-text)]">{stay.details}</p>
                                            ) : (
                                                <p className="text-italic font-semibold text-[var(--color-muted)]">No information provided.</p>
                                            )
                                        }
                                        </div>
                                    </div>
                                    
                                    <div className="my-2 border-t border-[var(--color-muted)] opacity-80 w-full "></div>

                                    <div className="flex flex-col items-start mb-3 gap-10">
                                        <h2 className="text-xl text-left font-bold text-[var(--color-text)]">Owner</h2>
                                        <div className="flex items-center gap-5">
                                            <img src={stay.owner?.image || ""} alt={stay.owner?.name || ""} className="w-16 h-16 rounded-full" draggable={false}/>
                                            <p className="text-italic font-semibold text-[var(--color-text)]">{stay.owner?.name || "N/A"}</p>

                                            <Link to={`/chat/${stay.owner?.id}/${stay.id}`}>
                                                <button className="bg-[var(--color-secondary)] text-[var(--color-surface)] px-6 py-2 
                                                                    rounded-full ml-4 hover:bg-[var(--color-secondary-hover)] 
                                                                    hover:scale-103 transition-transform duration-300"
                                                >Contact</button>
                                            </Link>
                                        </div>
                                    </div>
                            </div>
                        </main>
                    </div>   
                )
            }     
        
        </>
    );
}