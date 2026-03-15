import Google from "../ui/google.svg";
import Intra from "../ui/intra.svg";

export default function Log_with() {
    return (
        <div className="flex gap-4 mt-8 ">
            <a href="http://localhost:8081/oauth2/authorization/google">
                <button
                    type="button"
                    className="flex items-center justify-center
                        rounded-full border bg-white
                        transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    aria-label="Continue with Google">
                    <img src={Google} alt="Google" draggable="false"/>
                </button>
            </a>
            <a href="http://localhost:8081/oauth2/authorization/42">
                <button
                    type="button"
                    className="flex items-center justify-center
                        rounded-full border bg-white
                        transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    aria-label="Continue with Intra">
                    <img src={Intra} alt="Intra" draggable="false" />
                </button>
            </a>
        </div>
    );
}