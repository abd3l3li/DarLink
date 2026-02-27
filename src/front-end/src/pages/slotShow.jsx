import { useState, useEffect } from "react";
import Gallery from "../components/utils/gallery";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer.jsx";

export default function SlotShow() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar isLoggedIn={true} />
            <main className="flex-1 flex flex-col items-center justify-center gap-10 py-10">
                <Gallery orientation="horizontal" />
            </main>
            <Footer />
        </div>
    );
}