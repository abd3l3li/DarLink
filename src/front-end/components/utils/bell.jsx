import bell from "../ui/bell.svg";

export default function Bell({ className = "" }) {

    return (
        <div className={`bg-[var(--color-bg)] w-15 h-15  flex items-center justify-center rounded-full ${className}`}>
            <img 
                src={bell} 
                alt="Notifications" 
                className="cursor-pointer w-7 h-7 md:w-9 md:h-9 duration-500 hover:[filter:invert(67%)_sepia(52%)_saturate(521%)_hue-rotate(93deg)_brightness(92%)_contrast(89%)]" 
            />
        </div>
    );
}