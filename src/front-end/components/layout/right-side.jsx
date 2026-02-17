import create from "../ui/create.svg";
import bell from "../ui/bell.svg";
import usr from "../ui/usr.svg";


export default function RightSide() {
    return (
        <div className="right-side flex items-center gap-7">
            <img 
                src={create} 
                alt="Create" 
                className="cursor-pointer duration-500 hover:opacity-80 hover:scale-105" 
            />
            <img 
                src={bell} 
                alt="Notifications" 
                className="cursor-pointer duration-500 hover:[filter:invert(67%)_sepia(52%)_saturate(521%)_hue-rotate(93deg)_brightness(92%)_contrast(89%)]" 
            />
            <img 
                src={usr} 
                alt="User Profile" 
                className="cursor-pointer duration-500 hover:[filter:invert(67%)_sepia(52%)_saturate(521%)_hue-rotate(93deg)_brightness(92%)_contrast(89%)]" 
            />
        </div>
    );
}