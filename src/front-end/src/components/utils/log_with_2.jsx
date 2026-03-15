import Google from "../ui/google.svg";
import Intra from "../ui/intra.svg";

export default function Log_with() {
    const handleClick = () => {
        window.location.href = "/";
    };
    return (
<<<<<<< HEAD
    <div className="flex gap-4 mt-8 ">
        <button
            type="button"
            className="flex items-center justify-center
                    rounded-full border bg-white
                    transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    onClick={handleClick} 
            aria-label="Continue with Google">
            <img src={Google} alt="Google" draggable="false"/>

        </button>
        <button 
            type="button"
            className="flex items-center justify-center
                    rounded-full border bg-white
                    transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            aria-label="Continue with Intra">
            <img src={Intra} alt="Intra" draggable="false" />
        </button>
    </div>
=======
        <div className="flex gap-4 mt-8 ">
            <a href="https://localhost:8443/oauth2/authorization/google">
                <button
                    type="button"
                    className="flex items-center justify-center
                        rounded-full border bg-white
                        transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    aria-label="Continue with Google">
                    <img src={Google} alt="Google" draggable="false"/>
                </button>
            </a>
            <a href="https://localhost:8443/oauth2/authorization/42">
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
>>>>>>> 371ea7607147b17adb44e1ad69e774cb40039e85
    );
}