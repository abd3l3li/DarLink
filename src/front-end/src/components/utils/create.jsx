import create from "../ui/create.svg";


export default function Create() {

    return (
            /* drop-shadow follows the shape of svg */
            <img 
                src={create} 
                alt="Create" 
                className="cursor-pointer h-9 duration-500 hover:opacity-80 hover:drop-shadow-md 
                hover:scale-[1.01] active:scale-100"
                draggable={false}
            />
    );
}