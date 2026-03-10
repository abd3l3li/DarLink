import House from "../ui/design.svg";

export default function Left_Side() {
    
    return (
        <div className="hidden lg:flex w-1/2 items-center justify-center ">
				<div className="max-w-150 ml-10 w-full">
					<img
					src={House}
					alt="House"
					className="w-full h-full rounded-lg shadow-lg"
                    draggable={false}
					/>
				</div>
			</div>
    );
}