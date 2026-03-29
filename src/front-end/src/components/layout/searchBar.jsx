import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const filterOptions = [
	{ name: "location", label: "Location", placeholder: "Select City", options: ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Oujda", "Kenitra", "Ben Guerir"] },
	{ name: "type", label: "Room Type", placeholder: "Shared or Private", options: ["Private", "Shared", "Both"] },
	{ name: "price", label: "Price Range", placeholder: "Select range", options: ["0 - 1000 DH", "1000 - 2000 DH", "2000+ DH"] },
];

const EMPTY_FILTERS = { location: "", type: "", price: "" };

export default function FloatingSearchBar({ onSearch, initialFilters }) {
	const navigate = useNavigate();
	const [filters, setFilters] = useState(initialFilters ?? EMPTY_FILTERS);

	useEffect(() => {
		setFilters(initialFilters ?? EMPTY_FILTERS);
	}, [initialFilters]);

	const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

	const triggerSearch = () => {
		if (typeof onSearch === "function") {
			onSearch(filters);
			return;
		}

		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value == null) return;
			const str = String(value).trim();
			if (!str) return;
			params.set(key, str);
		});
		navigate(`/slots${params.toString() ? `?${params.toString()}` : ""}`);
	};

	return (

		<div className="z-20 mt-16 w-auto rounded-2xl bg-(--color-surface) p-6 shadow-2xl">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-6">

				{filterOptions.map(({ name, label, placeholder, options }) => (
					<div key={name} className="flex flex-col text-left">
						<label className="mb-2 pl-2 text-xs font-bold uppercase tracking-wider text-(--color-muted)">
							{label}
						</label>
						<select
							name={name}
							value={filters[name]}
							onChange={handleChange}
							className="bg-(--color-bg) px-4 py-4 font-medium shadow-sm rounded-lg transition-all focus:ring-2 focus:ring-(--color-secondary) focus:outline-none"
						>
							<option value="">{placeholder}</option>
							{options.map((opt) => (
									<option key={opt} value={opt}>{opt}</option>
									)
								)
							}
						</select>
					</div>
					))
				}

				<div className="flex items-end">
					<button
						onClick={triggerSearch}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-secondary) px-8 py-4 font-bold text-(--color-surface) shadow-lg shadow-(--color-secondary)/30 transition-all hover:scale-[1.01] active:scale-100"
					>
						{/* <span className="material-symbols-outlined">search</span> */}
						Search
					</button>
				</div>

			</div>
		</div>

	);
}
