import bell from "../ui/bell.svg";

export default function Bell({ className = "" }) {

    return (
        <div className={`bg-[var(--color-bg)] w-11 h-11  flex items-center justify-center rounded-full ${className}`}>
            <img 
                src={bell} 
                alt="Notifications" 
                className="cursor-pointer w-6 h-6  duration-500 
                    hover:[filter:invert(67%)_sepia(52%)_saturate(521%)_hue-rotate(93deg)_brightness(92%)_contrast(89%)]"
                    draggable={false}
            />
        </div>
    );
}