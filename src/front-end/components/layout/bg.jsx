import title from "../ui/text.svg";
import bg from "../ui/bg.svg";

export default function Background() {
    
    return (
        <>
            <div className="flex-1 flex items-end justify-center pb-[20vh] md:items-center md:pb-0">
                <img src={title} alt="Title" className="z-10 w-[90%] md:w-1/2 h-auto" />
            </div>
            <img src={bg} alt="Background" className="absolute bottom-0 left-0 w-full h-[50vh] md:h-[80vh] object-cover object-top -z-10" />
        </>
    );
}