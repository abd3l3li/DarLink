export default function formTag() {
    return (
        <>
		<div className="mt-10 space-y-8">
			<div className="relative">
				<label className="text-sm text-gray-500">Email or User</label>
				<input
					type="text"
					placeholder="abel-baz"
					className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-(--color-secondary) transition-colors duration-300" />
			</div>
		</div>
		<div className="mt-10 space-y-8">
			<div className="relative">
				<label className="text-sm text-gray-500">Password</label>
				<input
					type="password"
					placeholder="********"
					className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-(--color-secondary) transition-colors duration-300" />
			</div>
		</div>
			</>
    );
}