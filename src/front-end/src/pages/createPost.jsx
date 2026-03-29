import Gallery from "@/components/stays/gallery.jsx";
import letterIcon from "@/components/ui/letter.svg";
import cancelButton from "@/components/ui/cancelButton.svg";
import publishButton from "@/components/ui/publishButton.svg";
import { useState, useEffect } from "react";



const Options = [
    { name: "location", label: "Location", placeholder: "Select City", options: ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Oujda", "Kenitra", "Ben Guerir"] },
    { name: "type", label: "Room Type", placeholder: "Shared or Private", options: ["Private", "Shared", "Both"] },
];

const INCLUDED_OPTIONS = [
    "Wi-Fi included", "Washing machine", "Fridge", "Shared living room access",
    "Access to kitchen + appliances", "Water & electricity shared"
];

const EXPECTATION_OPTIONS = [
    "Quiet at night", "Smoking not allowed", "Guests allowed",
    "Pets allowed", "Clean shared spaces", "Respect common areas & noise levels"
];

const INITIAL_VALUES = { location: "", type: "", price: "", avSlots: "" };





export default function CreatePost( { stay } ) {

    const [values, setValues] = useState(INITIAL_VALUES);
    const [included, setIncluded] = useState([]);
    const [expectations, setExpectations] = useState([]);
    const [details, setDetails] = useState("");
    // lifted up from Gallery.jsx
    const [photos, setPhotos] = useState([]);

    // Prefill logic
    useEffect(() => {
        if (stay && Object.keys(stay).length > 0) {
            setValues({
                location: stay.city || "",
                type: stay.type || "",
                price: stay.price || "",
                avSlots: stay.avSlots || "",
            });
            setIncluded(stay.included || []);
            setExpectations(stay.expectations || []);
            setDetails(stay.details || "");
            setPhotos(stay.photos || []);
        }
    }, [stay]);

    const handlePhotoAdd = (dataUrl) => {
        setPhotos((prev) => (prev.length < 5 ? [...prev, dataUrl] : prev));
    };

    const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

    // for both included and expectations
    const toggleCheckbox = (setter, list, value) => {
        setter(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
    };

    const resetForm = () => {
        setValues(INITIAL_VALUES);
        setIncluded([]);
        setExpectations([]);
        setDetails("");
        setPhotos([]);
    };

    const publishHandler = async () => {

        if (!values.location || !values.type || !values.price || !values.avSlots) {
            alert("Please fill in location, room type, price, and available slots.");
            return;
        }
        // if (photos.length === 0) {
        //     alert("Please upload at least one photo.");
        //     return;
        // }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to publish a post.");
            return;
        }

        const pricePerNight = Number(values.price);
        const availableSlots = Number.parseInt(values.avSlots, 10) || 0;
        const city = values.location;

        const payload = {
            name: `${values.type} room in ${city}`,
            description: details,
            city,
            address: "",
            pricePerNight: Number.isFinite(pricePerNight) ? pricePerNight : 0,
            photoUrl: photos[0] || "",
        };

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:1337";

        try {
            const res = await fetch(`${apiBaseUrl}/api/stays/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                const message =
                    typeof data === "string"
                        ? data
                        : data?.message || `Failed to publish (HTTP ${res.status})`;
                throw new Error(message);
            }

            console.log("Stay created:", data);
            console.log("Extra UI-only fields not sent:", { availableSlots, included, expectations, photos });
            resetForm();
            alert("Published successfully!");
        } catch (err) {
            alert(err.message || "Failed to publish");
        }
    };

    return (
        <>
            <div className="flex flex-col items-center max-w-7xl mx-auto px-4 py-10 gap-30">

                <Gallery photos={photos} orientation="vertical" onPhotoAdd={handlePhotoAdd} />

                {/* Filter bar */}
                <div className="flex items-center justify-around w-full md:h-32 
                                bg-(--color-surface) 
                                rounded-4xl shadow-lg py-40 md:py-3 px-6">
                    <div className="grid grid-cols-2 md:flex md:items-center md:justify-around w-full gap-4">
                        {Options.map(({ name, label, placeholder, options }) => (
                            <div key={name} className="flex flex-col text-left">
                                <label className="mb-2 pl-2 text-xs font-bold uppercase tracking-wider text-(--color-muted)">
                                    {label}
                                </label>
                                <select
                                    name={name}
                                    value={values[name]}
                                    onChange={handleChange}
                                    required
                                    className="bg-(--color-bg) px-4 py-4 font-medium shadow-sm rounded-lg transition-all focus:ring-2 focus:ring-(--color-secondary) focus:outline-none"
                                >
                                    <option value="">{placeholder}</option>
                                    {options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        {/* Price */}
                        <div className="flex flex-col text-left">
                            <label className="mb-2 pl-2 text-xs font-bold uppercase tracking-wider text-(--color-muted)">
                                Price Range
                            </label>
                            <div className="flex items-center bg-(--color-bg) rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-(--color-secondary)">
                                <input
                                    type="number"
                                    name="price"
                                    value={values.price}
                                    onChange={handleChange}
                                    required
                                    className="bg-transparent px-4 py-4 font-medium focus:outline-none w-36"
                                    placeholder="e.g. 1500"
                                    min="0"
                                />
                                <span className="pr-4 text-sm font-semibold text-(--color-muted) hidden md:inline">MAD</span>
                            </div>
                        </div>

                        {/* Available Slots */}
                        <div className="flex flex-col text-left">
                            <label className="mb-2 pl-2 text-xs font-bold uppercase tracking-wider text-(--color-muted)">
                                Available Slots
                            </label>
                            <div className="flex items-center bg-(--color-bg) rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-(--color-secondary)">
                                <input
                                    type="number"
                                    name="avSlots"
                                    value={values.avSlots}
                                    onChange={handleChange}
                                    required
                                    className="bg-transparent px-4 py-4 font-medium focus:outline-none w-36"
                                    placeholder="e.g. 3"
                                    min="0"
                                />
                            </div>
                        </div>                        
                    </div>
                </div>

                {/* What's Included */}
                <SectionBlock title="What's Included:" icon={letterIcon}>
                    <div className="grid grid-cols-1 md:grid-cols-3 space-y-3 md:space-y-0 w-full bg-(--color-surface) rounded-4xl py-3 px-6 md:px-0 shadow-lg min-h-36">
                        {INCLUDED_OPTIONS.map((item) => (
                            <CheckboxItem
                                key={item}
                                item={item}
                                checked={included.includes(item)}
                                onChange={() => toggleCheckbox(setIncluded, included, item)}
                            />
                        ))}
                    </div>
                </SectionBlock>

                {/* House Rules */}
                <SectionBlock title="House Rules & Expectations:" icon={letterIcon}>
                    <div className="grid grid-cols-1 md:grid-cols-3 space-y-3 md:space-y-0 w-full bg-(--color-surface) rounded-4xl py-3 px-6 md:px-0 shadow-lg min-h-36">
                        {EXPECTATION_OPTIONS.map((item) => (
                            <CheckboxItem
                                key={item}
                                item={item}
                                checked={expectations.includes(item)}
                                onChange={() => toggleCheckbox(setExpectations, expectations, item)}
                            />
                        ))}
                    </div>
                </SectionBlock>

                {/* Room Details */}
                <SectionBlock title="Room Details:" icon={letterIcon} subtitle="Describe the rooms available, size, furniture, and anything important to know.">
                    <textarea
                        value={details} // so resetForm() actually clears it
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full h-36 bg-(--color-surface) rounded-4xl shadow-lg p-6 text-(--color-text) focus:ring-2 focus:ring-(--color-secondary) focus:outline-none resize-none"
                        placeholder="E.g., Spacious private room with a queen-size bed, desk, and wardrobe. Shared access to a fully equipped kitchen and living room."
                    />
                </SectionBlock>

                {/* Actions */}
                <div className="flex items-center justify-center w-full mb-10 gap-16">
                    <img
                        src={cancelButton} alt="Cancel"
                        className="cursor-pointer hover:opacity-80 hover:scale-103 transition-transform duration-300 active:scale-95"
                        onClick={resetForm}
                        draggable={false}
                    />
                    <img
                        src={publishButton} alt="Publish"
                        className="cursor-pointer hover:opacity-80 hover:scale-103 transition-transform duration-300 active:scale-95"
                        onClick={publishHandler}
                        draggable={false}
                    />
                </div>
            </div>
        </>
    );
}


function SectionBlock({ title, icon, subtitle, children }) {
    return (
        <div className="flex flex-col items-start w-full gap-4">
            <span className="flex items-center ml-5 gap-4">
                <img src={icon} alt="" draggable={false}/>
                <h1 className="text-lg font-bold">{title}</h1>
            </span>
            {subtitle && <p className="text-sm font-semibold text-(--color-muted) ml-5">{subtitle}</p>}
            {children}
        </div>
    );
}

function CheckboxItem({ item, checked, onChange }) {
    return (
        <label className="flex items-center ml-7 text-(--color-text) cursor-pointer">
            <input
                type="checkbox"
                className="mr-2 w-3 h-3 md:w-5 md:h-5"
                value={item}
                checked={checked}
                onChange={onChange} // onChange not onClick
            />
            <span className="text-lg">{item}</span>
        </label>
    );
}