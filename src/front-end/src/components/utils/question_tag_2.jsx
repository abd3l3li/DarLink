import Log_in from "../ui/log_in.svg";

export default function Question_tag() {
    return (
        <div className="mt-10">

        <button 
            className="bg-[var(--color-primary)] text-[var(--color-surface)] px-4 py-2 flex items-center justify-center
                    rounded-full font-bold
                    transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                    h-11 w-34">
        LOG IN
        </button>
            <p className="mt-6 text-gray-600">
                No Account yet?{" "}
                <a
                    href="/login"
                    className="text-blue-600 font-medium hover:underline"
                >
                SIGN UP
                </a>
            </p>
        </div>
    );
}