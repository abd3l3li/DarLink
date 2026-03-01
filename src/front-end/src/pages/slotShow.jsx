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
            <main className="flex-1 flex flex-col items-start 
                                justify-center text-left gap-10 py-10 max-w-7xl ">
                
                <div className="flex items-center justify-start gap-10 w-full max-w-7xl px-5 text-left">
                    <Gallery orientation="horizontal" />    
                    <div className="space-y-2 flex flex-col items-start gap-3 ml-2 w-xl max-w-md s">
                        <img src={mapLogo} alt="map" className="mr-4 w-7 h-7 opacity-80" draggable={false} />
                        <span className="text-lg font-semibold text-[var(--color-text)]">
                            {/* {stay.city} */}City
                        </span>

                        <div className="border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                        <span className="ml-1 text-lg font-bold text-[var(--color-text)]">
                             {/* {stay.price ? `${stay.price} MAD` : "N/A"} */}Price
                        </span>

                        <div className="border-t border-[var(--color-muted)] opacity-50 w-full"></div>

                        <div className="relative">
                            <p className="mb-2 text-sm text-[var(--color-muted)]">Available Slots</p>
                            <span className="relative flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
                                <img src={slotsCircle} alt="slots" draggable={false}/>
                                <span className="absolute left-1/2 top-1/2 -ml-4 -translate-x-1/2 -translate-y-1/2 text-[var(--color-text)]">
                                    {/* Your text here, e.g. slot count */}
                                    5
                                </span>
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
                        
                        <button>a</button>
                        <button>a</button>
                        <button>a</button>        
                    </div>


                </div>
            </main>
            <Footer />
        </div>
    );
}