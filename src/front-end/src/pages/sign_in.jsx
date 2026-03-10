import Logbar from "../components/layout/logbar.jsx";
import Sin_page from "../components/layout/Sinbg.jsx";

export default function Sign_in() {
    return (
        <div className=" home h-screen overflow-hidden flex flex-col relative">
            <Logbar isLoggedIn={false} isCreating={false} />
            <Sin_page />
        </div>
    );
}