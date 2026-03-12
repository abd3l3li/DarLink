import Form_heder from "../utils/form_heder_2.jsx"
import Log_with from "../utils/log_with_2.jsx";
import Form_tag from "../utils/formTag_2.jsx";
import Question_tag from "../utils/question_tag_2.jsx";


export default function Right_side_2() {
    
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