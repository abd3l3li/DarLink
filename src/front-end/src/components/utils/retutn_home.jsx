import returnIcon from "../ui/return.svg";

export default function Return({ className = "" }) {

    return (
        <div className={`flex items-center justify-center rounded-full cursor-pointer${className}`}>
            <img 
                src={returnIcon} 
                alt="Return to Home" 
                className=" w-full h-full  duration-500 
                    hover:[filter:invert(67%)_sepia(52%)_saturate(521%)_hue-rotate(93deg)_brightness(92%)_contrast(89%)]"
                    draggable={false}
            />
        </div>
    );
}