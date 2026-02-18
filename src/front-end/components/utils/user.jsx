import usr from "../ui/usr.svg";

export default function User() {

    return (
        <div className="bg-[var(--color-bg)] w-15 h-15 flex items-center justify-center rounded-full">
            <img 
                src={usr} 
                alt="User Profile" 
                className="cursor-pointer w-9 h-9 duration-500 hover:[filter:invert(67%)_sepia(52%)_saturate(521%)_hue-rotate(93deg)_brightness(92%)_contrast(89%)]" 
            />
        </div>
    );
}