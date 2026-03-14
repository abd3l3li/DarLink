import LeftSide_2 from "../utils/Left_Side_2.jsx";
import RightSide_2 from "../utils/Right_Side_2.jsx";

export default function Log_page() {

	return (
		<div className="flex min-h-[calc(100vh-4rem)]  mt-20 max-w-[103rem]"> 
			<LeftSide_2 />
            <RightSide_2 />
			{/* <RightSide /> */}
		</div>
  );
}