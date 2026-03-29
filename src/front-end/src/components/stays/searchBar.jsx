import { useState } from "react";

const filterOptions = [
	{ name: "location", label: "Location", placeholder: "Select City", options: ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Oujda", "Kenitra", "Ben Guerir"] },
	{ name: "type", label: "Room Type", placeholder: "Shared or Private", options: ["Private", "Shared", "Both"] },
	{ name: "price", label: "Price Range", placeholder: "Select range", options: ["0 - 1000 DH", "1000 - 2000 DH", "2000+ DH"] },
];

export default function FloatingSearchBar({ onSearch, initialFilters }) {
	const [filters, setFilters] = useState(initialFilters ?? { location: "", type: "", price: "" });

	const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

	return (

		<div className="mt-16 w-full max-w-7xl z-30 rounded-2xl bg-[var(--color-surface)] p-7 shadow-2xl">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-6">

				{filterOptions.map(({ name, label, placeholder, options }) => (
					<div key={name} className="flex flex-col text-left">
						<label className="mb-2 pl-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
							{label}
						</label>
						<select
							name={name}
							value={filters[name]}
							onChange={handleChange}
							className="bg-[var(--color-bg)] px-4 py-4 font-medium shadow-sm rounded-lg transition-all focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
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
						onClick={() => (typeof onSearch === "function" ? onSearch(filters) : console.log("Selected filters:", filters))}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-secondary)] px-8 py-4 font-bold text-[var(--color-surface)] shadow-lg shadow-[var(--color-secondary)]/30 transition-all hover:scale-[1.01] active:scale-100"
					>
						{/* <span className="material-symbols-outlined">search</span> */}
						Search
					</button>
				</div>

			</div>
		</div>

	);
}