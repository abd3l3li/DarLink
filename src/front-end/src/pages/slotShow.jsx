import { useState, useEffect } from "react";
import Gallery from "../components/utils/gallery";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer.jsx";
import mapLogo from "../components/ui/map-pinned.svg";
import slotsCircle from "../components/ui/slotsCircle.svg";

export default function SlotShow() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar isLoggedIn={true} />
            <main className="flex-1 flex flex-col items-start justify-center text-left gap-10 py-10">
                
                <div className="flex items-center justify-start gap-10 w-full max-w-7xl px-5 text-left">
                    <Gallery orientation="horizontal" />    
                    <div className="flex flex-col items-center gap-2 w-1/5">
                        <img src={mapLogo} alt="map" className="mr-4 w-5 h-5 opacity-70" />
                        <span className="text-lg font-semibold text-[var(--color-text)]">
                            {/* {stay.city} */}City
                        </span>

                        <div className="border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                        <span className="ml-4 text-lg font-bold text-[var(--color-text)]">
                             {/* {stay.price ? `${stay.price} MAD` : "N/A"} */}Price
                        </span>

                        <div className="border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                        <div>
                            <p className="text-sm text-[var(--color-muted)]">Available Slots</p>
                            <span>
                                {/* {stay.avSlots ? `${stay.avSlots} slots` : "N/A"} */}
                                <img src={slotsCircle} alt="slots" />
                            </span>
                        </div>

                        <div className="border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                        <div>
                            <p className="text-sm text-[var(--color-muted)]">Type</p>
                            <span>
                                <label >
                                    <input type="checkbox" value="Private" className="rounded-full" />
                                        Private
                                </label>
                                <label >
                                    <input type="checkbox" value="Shared" />
                                        Shared
                                </label>
                                <label >
                                    <input type="checkbox" value="Both" />
                                        Both
                                </label>
                            </span>
                        </div>

                        <div className="border-t border-[var(--color-muted)] opacity-50 w-full"></div>
        
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}