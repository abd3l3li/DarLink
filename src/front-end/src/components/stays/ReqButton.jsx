
export default function ReqButton() {

    return (
        <button 
        className="bg-[var(--color-border-gray)] text-[var(--color-secondary)] px-4 py-2 rounded-full 
        hover:bg-[var(--color-secondary)] hover:text-white transition-all duration-400 border-2 
        border-[var(--color-secondary)] font-bold hover:scale-[1.05] active:scale-100 hover:shadow-md
        h-11 w-34 flex items-center justify-center">
        Request Slot
        </button>
    );
}