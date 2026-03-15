import Form_header from "./form_header_2.jsx"
import Log_with from "./logIn_with_2.jsx";
import Form_tag from "./formTag_2.jsx";
import Question_tag from "./question_tag_2.jsx";


export default function Right_side_2() {
    
	return (
			<div className="flex w-full lg:w-1/2 items-center justify-center lg:justify-end px-4 sm:px-6">
				<div className="w-full max-w-md">
					<Form_header />
					<Log_with />
					<Form_tag/>
					<Question_tag />
				</div>
			</div>
	);
}