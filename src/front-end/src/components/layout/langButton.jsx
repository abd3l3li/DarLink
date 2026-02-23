import { useState, useEffect } from "react";

export default function LangButton() {

    const [lang, setLang] = useState(localStorage.getItem("preferredLanguage") || "en");
    const [showSelect, setShowSelect] = useState(false);
    const [visibleButtons, setVisibleButtons] = useState([false, false, false]);

    const handleLangClick = (value) => {
        setLang(value);
        setShowSelect(false);
        setVisibleButtons([false, false, false]);
        console.log("Language changed to:", value);
    };

    useEffect(() => {
        if (showSelect) {
            setVisibleButtons([false, false, false]);
            setTimeout(() => setVisibleButtons([true, false, false]), 60);
            setTimeout(() => setVisibleButtons([true, true, false]), 140);
            setTimeout(() => setVisibleButtons([true, true, true]), 220);
        } else {
            setVisibleButtons([false, false, false]);
        }

        localStorage.setItem("preferredLanguage", lang);

    }, [showSelect, lang]);

    return (

        <div
            className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
            onMouseEnter={() => setShowSelect(true)}
            onMouseLeave={() => setShowSelect(false)}
            onClick={() => setShowSelect(!showSelect)}
        >
        {/* Main Button */}
            <button
                type="button"
                className="w-9 h-9 pl-1 md:w-10 md:h-10 flex items-center justify-center
                            bg-[var(--color-surface)]
                            border border-[var(--color-muted)]/20
                            text-sm font-semibold
                            rounded-md rounded-bl-none rounded-tl-none
                            shadow-lg
                            hover:bg-[var(--color-primary)]
                            hover:text-[var(--color-surface)]
                            transition-all duration-100 text-[var(--color-primary)]"
                >
                    {/* '?' the optional chaining operator */}
                {localStorage.getItem("preferredLanguage")?.toUpperCase()}
            </button>

        {/* Dropdown */}
            {showSelect && (
                <div
                    className="absolute right-0 w-9 md:w-10
                                bg-[var(--color-surface)]
                                border border-[var(--color-muted)]/20
                                rounded-md shadow-md
                                flex flex-col overflow-hidden"
                >

                    {["en", "es", "ar"].map((code, idx) => (
                    <button
                        key={code}
                        type="button"
                        onClick={() => handleLangClick(code)}
                        className={`h-8 md:h-9 text-sm font-medium
                                    hover:text-[var(--color-secondary)]
                                    rounded transition-all duration-200
                                    cursor-pointer
                                    ${visibleButtons[idx] ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
                    style={{ transitionDelay: `${80 * (idx + 1)}ms` }}
                    >
                        {code.toUpperCase()}
                    </button>
                    ))}
                </div>
            )}
        </div>
    );
}
