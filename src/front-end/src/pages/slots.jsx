import Search from "../components/utils/searchBar.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import NotLogged from "../components/stays/card.jsx";

export default function Slots() {
    return (
        <div className="slots h-screen overflow-hidden flex flex-col relative">
            <Navbar isLoggedIn={true} />
            <Search />

        </div>
    );
}