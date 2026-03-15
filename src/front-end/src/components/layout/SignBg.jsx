import LeftSide from "../utils/signUpDesign.jsx";
import RightSide from "../utils/signUpForm.jsx";

export default function Logpage() {

	return (
		<div className="flex  min-h-[calc(100vh-4rem)]  mt-20 max-w-[103rem]" >
			<LeftSide />
			<RightSide />
		</div>
  );
}