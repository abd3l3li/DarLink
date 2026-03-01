import { useState, useEffect } from "react";
import ShowGallery from "../components/utils/showGallery";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer.jsx";
import mapLogo from "../components/ui/map-pinned.svg";
import slotsCircle from "../components/ui/slotsCircle.svg";
import deleteButton from "../components/ui/deleteButton.svg";
import editButton from "../components/ui/editButton.svg";

export default function SlotShow({stay = {}}) {

    const reqHandle = (type) => {

        type === "slotReq" ? console.log("slot request sent") : 
        type === "deleteReq" ? console.log("delete request sent") :
        // redirect to edit page with stay data
        type === "editReq" ? console.log("edit request sent") :
        console.log("unknown request type");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar isLoggedIn={true} />
            <main className="flex-1 flex flex-col items-start 
                                justify-center text-left gap-10 py-10 max-w-7xl ">
                
                <div className="flex items-center justify-start gap-10 w-full max-w-7xl px-5 text-left">

                    <ShowGallery photos={stay.photos || []} />
                    <div className="space-y-2 flex flex-col items-start gap-3 ml-2 w-xl max-w-md s">
                        <img src={mapLogo} alt="map" className="mr-4 w-7 h-7 opacity-80" draggable={false} />
                        <span className="text-2xl font-semibold text-[var(--color-text)]">
                            {/* {stay.city} */}City
                        </span>

                        <div className="my-2 border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                        <span className="ml-1 text-2xl font-bold text-[var(--color-text)]">
                            {/* {stay.price ? `${stay.price} MAD` : "N/A"} */}
                                Price
                        </span>

                        <div className="my-2 border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                        <div className="relative">
                            <p className="mb-2 text-sm text-[var(--color-muted)]">Available Slots</p>
                            <span className="relative flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
                                <img src={slotsCircle} alt="slots" draggable={false}/>
                                <span className="absolute left-1/2 top-1/2 -ml-4 -translate-x-1/2 -translate-y-1/2 text-[var(--color-text)]">
                                    {/* stay.avSlots */}
                                    5
                                </span>
                            </span>
                        </div>

                        <div className="my-2 border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                        <div>
                            <p className="text-sm text-[var(--color-muted)]">Type</p>

                                <button className="flex items-center gap-2 text-lg mt-2 ml-1 font-semibold text-[var(--color-text)] bg-[var(--color-border-gray)] px-3 py-2 rounded-lg">
                                    <input type="checkbox" checked={true} value="type" disabled="true"/>
                                    {/* stay.type */}
                                        Private
                                </button>
                        </div>

                        <div className="my-2 border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                        <div className="Buttons flex flex-col items-center justify-center w-full">
                            {
                                // edit and delete buttons for admin
                                (stay.admin) ? (

                                    <div className="flex items-center gap-7 mt-12">
                                        <img src={deleteButton} alt="Delete" className="hover:scale-103 active:scale-98 transition-transform duration-200" draggable={false}/>
                                        <img src={editButton} alt="Edit" className="hover:scale-103 active:scale-98 transition-transform duration-208" draggable={false}/>
                                    </div>
                                ) :
                                (
                                    <button className="flex items-center gap-2 text-lg mt-2 ml-1 
                                            font-semibold text-[var(--color-surface)] bg-[var(--color-secondary)] 
                                            px-18 py-2 rounded-2xl hover:scale-103 active:scale-98 
                                            transition-transform duration-200 border-none"
                                            onClick={() => reqHandle("slotReq")}>
                                        Request Slot</button>
                                )
                            }
                        </div>

                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}