import title from "../ui/text.svg";
import bg from "../ui/bg.svg";
import SearchBar from "./searchBar.jsx";

export default function Background() {

    return (
    <>
        <div className="absolute z-10 w-full h-full bg-black/13" />
        <div className="flex-1 flex flex-col-reverse md:flex-col mt-4 md:mt-35 items-center justify-end md:justify-center gap-5">
        <img
            src={title}
            alt="Title"
            className="z-10 w-[90%] md:w-auto h-auto max-w-[49rem]"
        />
        <div className="h-16 md:h-0" />
        <div className="w-full p-4 z-20 max-w-4xl md:p-0">
            <SearchBar />
        </div>
        </div>
        <img
        src={bg}
        alt="Background"
        className="absolute bottom-0  w-full h-[55vh] md:h-[80vh] object-cover object-top -z-10"
        />
    </>
    );
}
