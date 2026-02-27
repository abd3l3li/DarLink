import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer.jsx";
import Gallery from "@/components/utils/gallery";
import letterIcon from "@/components/ui/letter.svg";
import cancelButton from "@/components/ui/cancelButton.svg";
import publishButton from "@/components/ui/publishButton.svg";
import { useState } from "react";





const Options = [
    { name: "location", label: "Location", placeholder: "Select City", options: ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Oujda", "Kenitra", "Ben Guerir"] },
    { name: "type", label: "Room Type", placeholder: "Shared or Private", options: ["Private Room", "Shared Room", "Both"] },
];

const INCLUDED_OPTIONS = [
    "Wi-Fi included", "Washing machine", "Fridge", "Shared living room access",
    "Access to kitchen + appliances", "Water & electricity shared"
];

const EXPECTATION_OPTIONS = [
    "Quiet at night", "Smoking not allowed", "Guests allowed",
    "Pets allowed", "Clean shared spaces", "Respect common areas & noise levels"
];

const INITIAL_VALUES = { location: "", type: "", price: "" };






export default function CreatePost() {

    const [values, setValues] = useState(INITIAL_VALUES);
    const [included, setIncluded] = useState([]);
    const [expectations, setExpectations] = useState([]);
    const [details, setDetails] = useState("");

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
    };

    const publishHandler = () => {

        if (!values.location || !values.type || !values.price) {
            alert("Please fill in location, room type, and price.");
            return;
        }

        const postData = {
            location: values.location,
            type: values.type,
            price: parseFloat(values.price),
            included,
            expectations,
            details,
            photos: [] // Placeholder
        };

        console.log("Publishing post:", postData);
        // TODO: await api.post("/listings", postData);
        resetForm();
    };

    return (
        <>
            <Navbar isLoggedIn={true} isCreating={true} />

            <div className="flex flex-col items-center max-w-7xl mx-auto px-4 py-10 gap-30">

                <Gallery />

                {/* Filter bar */}
                <div className="flex items-center justify-around w-full h-[8rem] bg-[var(--color-surface)] 
                                rounded-4xl shadow-lg py-40 md:py-3 px-6">
                    <div className="flex items-center justify-around w-full gap-4 flex-wrap">
                        {Options.map(({ name, label, placeholder, options }) => (
                            <div key={name} className="flex flex-col text-left">
                                <label className="mb-2 pl-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                    {label}
                                </label>
                                <select
                                    name={name}
                                    value={values[name]}
                                    onChange={handleChange}
                                    className="bg-[var(--color-bg)] px-4 py-4 font-medium shadow-sm rounded-lg transition-all focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
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
                            <label className="mb-2 pl-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                Price Range
                            </label>
                            <div className="flex items-center bg-[var(--color-bg)] rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-secondary)]">
                                <input
                                    type="number"
                                    name="price"
                                    value={values.price}
                                    onChange={handleChange}
                                    className="bg-transparent px-4 py-4 font-medium focus:outline-none w-36"
                                    placeholder="e.g. 1500"
                                    min="0"
                                />
                                <span className="pr-4 text-sm font-semibold text-[var(--color-muted)]">MAD</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What's Included */}
                <SectionBlock title="What's Included:" icon={letterIcon}>
                    <div className="grid grid-cols-1 md:grid-cols-3 space-y-3 md:space-y-0 w-full bg-[var(--color-surface)] rounded-4xl py-3 px-6 md:px-0 shadow-lg min-h-[9rem]">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 space-y-3 md:space-y-0 w-full bg-[var(--color-surface)] rounded-4xl py-3 px-6 md:px-0 shadow-lg min-h-[9rem]">
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
                        className="w-full h-36 bg-[var(--color-surface)] rounded-4xl shadow-lg p-6 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none resize-none"
                        placeholder="E.g., Spacious private room with a queen-size bed, desk, and wardrobe. Shared access to a fully equipped kitchen and living room."
                    />
                </SectionBlock>

                {/* Actions */}
                <div className="flex items-center justify-center w-full mb-10 gap-16">
                    <img
                        src={cancelButton} alt="Cancel"
                        className="cursor-pointer hover:opacity-80 hover:scale-103 transition-transform duration-300 active:scale-95"
                        onClick={resetForm}
                    />
                    <img
                        src={publishButton} alt="Publish"
                        className="cursor-pointer hover:opacity-80 hover:scale-103 transition-transform duration-300 active:scale-95"
                        onClick={publishHandler}
                    />
                </div>
            </div>

            <Footer />
        </>
    );
}


function SectionBlock({ title, icon, subtitle, children }) {
    return (
        <div className="flex flex-col items-start w-full gap-4">
            <span className="flex items-center ml-5 gap-4">
                <img src={icon} alt="" />
                <h1 className="text-lg font-bold">{title}</h1>
            </span>
            {subtitle && <p className="text-sm font-semibold text-[var(--color-muted)] ml-5">{subtitle}</p>}
            {children}
        </div>
    );
}

function CheckboxItem({ item, checked, onChange }) {
    return (
        <label className="flex items-center ml-7 text-[var(--color-text)] cursor-pointer">
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