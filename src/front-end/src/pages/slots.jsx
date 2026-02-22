import Search from "../components/utils/searchBar.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import Card from "../components/stays/card.jsx";
import { stays } from "../components/stays/staysTemp.js";

export default function Slots() {
    return (
        <div className="slots h-screen flex flex-col relative">
            <Navbar isLoggedIn={true} />
            <div className="flex justify-center items-center mt-9 mx-auto md:mt-22 w-full max-w-7xl p-2">
                <Search />
            </div>

                <div className="grid grid-cols-1 place-items-center md:grid-cols-2 md:gap-10 
                    lg:grid-cols-3 lg:gap-15 gap-5 mt-10 px-5 w-full max-w-7xl mx-auto">
                    {stays.map((item) => (
                        <Card key={item.id} stay={item} />
                    ))}
                </div>

        </div>
    );
}