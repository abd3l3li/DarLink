import Logbar from "../components/layout/logbar.jsx";
import Log_page from "../components/layout/Logbg.jsx";

export default function Log_in() {
    return (
        <div className="home h-screen overflow-hidden flex flex-col relative">
            <Logbar isLoggedIn={false} isCreating={false} />
            <Log_page />
        </div>
    );
}