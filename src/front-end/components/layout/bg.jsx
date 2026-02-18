import title from "../ui/text.svg";
import bg from "../ui/bg.svg";
import Search from "./Search.jsx";

export default function Background() {
    
    return (
        <>
            <div className="flex-1 flex flex-col items-center justify-end pb-[25vh] md:justify-center md:pb-0 gap-6">
                <img src={title} alt="Title" className="z-10 w-[90%] md:w-1/2 h-auto" />
                <Search />
            </div>
            <img src={bg} alt="Background" className="absolute bottom-0 left-0 w-full h-[50vh] md:h-[80vh] object-cover object-top -z-10" />
        </>
    );
}