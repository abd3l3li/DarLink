import { Link } from "react-router-dom";
import Card from "../components/stays/card.jsx";
import { stays } from "../components/stays/staysTemp.js";

const myListings = stays.filter((stay) => stay.admin === true);

export default function MyListings() {
    return (
        
        <div className="slots min-h-screen flex flex-col relative">
            <div className="w-full max-w-7xl mx-auto px-5 mt-9 md:mt-22 flex items-center gap-4">
                <Link
                    to="/"
                    className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Your Listings</h1>
            </div>

            {myListings.length > 0 ? (
                <div className="grid grid-cols-1 place-items-center md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-15 gap-5 mt-10 px-5 w-full max-w-7xl mx-auto pb-10">
                    {myListings.map((stay) => (
                        <Link key={stay.id} to={`/slot-show/${stay.id}`} className="block">
                            <Card stay={stay} isOwner={true} />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-5 w-full max-w-7xl mx-auto">
                    <svg className="w-20 h-20 text-[var(--color-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-lg text-[var(--color-muted)] mb-4">You don't have any listings yet</p>
                    <Link
                        to="/create-post"
                        className="px-6 py-2 bg-[var(--color-secondary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Create your first listing
                    </Link>
                </div>
            )}
        </div>
    );
}
