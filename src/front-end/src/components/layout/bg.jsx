import title from "../ui/text.svg";
import bg from "../ui/bg.svg";
import SearchBar from "./searchBar.jsx";

export default function Background() {
    
    return (
        <>
            <div className="flex-1 flex flex-col-reverse md:flex-col md:mt-20 items-center justify-end md:justify-center gap-5">
                <img src={title} alt="Title" className="z-10 w-[90%] md:w-1/2 h-auto" />
                <div className="h-16 md:h-0" />
                <SearchBar />
            </div>
            <img src={bg} alt="Background" className="absolute bottom-0  w-full h-[55vh] md:h-[80vh] object-cover object-top -z-10" />
        </>
    );
}