import Form_heder from "../utils/form_heder.jsx"
import Log_with from "../utils/log_with.jsx";
import Form_tag from "../utils/formTag.jsx";
import Question_tag from "../utils/question_tag.jsx";


export default function Right_side() {

    return (
			<div className="flex w-full lg:w-1/2 items-center justify-center lg:justify-end">
				<div className="w-full max-w-md ">
					<Form_heder />
					<Log_with />
					<Form_tag/>
					<Question_tag />
				</div>
			</div>
    );
}