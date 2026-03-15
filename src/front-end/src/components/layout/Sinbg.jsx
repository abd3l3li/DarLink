import LeftSide from "../utils/Left_Side.jsx";
import RightSide from "../utils/Right_Side.jsx";

export default function Logpage() {

	return (
		<div className="flex  min-h-[calc(100vh-4rem)]  mt-20 max-w-[103rem]" >
			<LeftSide />
			<RightSide />
		</div>
  );
}