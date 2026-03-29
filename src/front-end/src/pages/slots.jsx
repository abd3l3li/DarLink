import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../components/stays/searchBar.jsx";
import Card from "../components/stays/card.jsx";
import { fetchStays } from "../lib/staysApi.js";
import { getDisplaySlots } from "../lib/stays.js";

const PAGE_SIZE = 6;

export default function Slots() {
    const [page, setPage] = useState(0);

    const [filters, setFilters] = useState({ location: "", type: "", price: "" });
    const [stays, setStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async (nextFilters) => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchStays(nextFilters);
            setStays(data);
        } catch (e) {
            setStays([]);
            setError(e instanceof Error ? e.message : "Failed to load stays");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearch = (nextFilters) => {
        setFilters(nextFilters);
        setPage(0);
        load(nextFilters);
    };
    
    const availableStays = stays.filter((item) => getDisplaySlots(item) > 0);
    const start = page * PAGE_SIZE;
    const pageStays = availableStays.slice(start, start + PAGE_SIZE);
    const totalPages = Math.ceil(availableStays.length / PAGE_SIZE);
    const hasPrev = page > 0;
    const hasNext = page < totalPages - 1;

    return (
        <div className="slots min-h-screen flex flex-col relative">
            <div className="flex justify-center items-center mt-9 mx-auto md:mt-22 w-full max-w-7xl p-2">
                <Search onSearch={onSearch} initialFilters={filters} />
            </div>

            {loading && (
                <div className="w-full max-w-7xl mx-auto px-5 mt-6 text-[var(--color-muted)]">Loading stays…</div>
            )}
            {!loading && error && (
                <div className="w-full max-w-7xl mx-auto px-5 mt-6 text-red-500">{error}</div>
            )}
            {!loading && !error && availableStays.length === 0 && (
                <div className="w-full max-w-7xl mx-auto px-5 mt-6 text-[var(--color-muted)]">No stays found.</div>
            )}

            <div className="grid grid-cols-1 place-items-center md:grid-cols-2 md:gap-10 
                lg:grid-cols-3 lg:gap-15 gap-5 mt-10 px-5 w-full max-w-7xl mx-auto pb-10">
                {pageStays.map((item) => (
                    <Link to={`/slot-show/${item.id}`} key={item.id}>
                        <Card stay={item} isOwner={false} />
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