import { useState } from "react";
import { Link } from "react-router-dom";
import Search from "../components/stays/searchBar.jsx";
import Card from "../components/stays/card.jsx";
import { stays } from "../components/stays/staysTemp.js";

const PAGE_SIZE = 6;

export default function Slots() {
    const [page, setPage] = useState(0);
    
    const availableStays = stays.filter((item) => item.avSlots > 0);
    const start = page * PAGE_SIZE;
    const pageStays = availableStays.slice(start, start + PAGE_SIZE);
    const totalPages = Math.ceil(availableStays.length / PAGE_SIZE);
    const hasPrev = page > 0;
    const hasNext = page < totalPages - 1;

    return (
        <div className="slots min-h-screen flex flex-col relative">
            <div className="flex justify-center items-center mt-9 mx-auto md:mt-22 w-full max-w-7xl p-2">
                <Search />
            </div>

            <div className="grid grid-cols-1 place-items-center md:grid-cols-2 md:gap-10 
                lg:grid-cols-3 lg:gap-15 gap-5 mt-10 px-5 w-full max-w-7xl mx-auto pb-10">
                {pageStays.map((item) => (
                    <Link to={`/slot-show/${item.id}`} key={item.id}>
                        <Card key={item.id} stay={item} isOwner={item.admin === true} />
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-4 pb-10">
                    <button
                        type="button"
                        onClick={() => setPage((p) => p - 1)}
                        disabled={!hasPrev}
                        className="px-4 py-2 rounded-md bg-[var(--color-secondary)] text-white 
                                    disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-300"
                    >
                        Previous
                    </button>
                    <span className="py-2 text-[var(--color-muted)]">
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!hasNext}
                        className="px-4 py-2 rounded-md bg-[var(--color-secondary)] text-white 
                                    disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-300"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}