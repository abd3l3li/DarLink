import Form_heder from "./form_header.jsx"
import Log_with from "./logIn_with.jsx";
import Form_tag from "../utils/formTag.jsx";
import Question_tag from "../utils/question_tag.jsx";


export default function Right_side() {
    
	return (
			<div className="flex w-full lg:w-1/2 items-center justify-center lg:justify-end px-4 sm:px-6">
				<div className="w-full max-w-md">
					<Form_heder />
					<Log_with />
					<Form_tag/>
					<Question_tag />
				</div>
			</div>
	);
}