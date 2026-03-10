import carton from "../components/ui/About_img/carton.jpg";
import team1  from "../components/ui/About_img/team1.jpg";
import team2  from "../components/ui/About_img/team2.jpg";
import team3  from "../components/ui/About_img/team3.jpg";
import team4  from "../components/ui/About_img/team4.jpg";
export default function About() {
    return (
        <>
                <div className="home h-screen overflow-hidden bg-[var(--color-bg)]  flex flex-col relative mt-20">

                {/* HERO SECTION */}
                <section className="max-w-7xl mx-auto p-5">
                    <div className="bg-[var(--color-bg)] rounded-xl p-8 flex items-center gap-10 shadow-sm">
                        {/* Image */}
                        <img
                        src={carton}
                        alt="about"
                        className="w-96 h-52 object-cover rounded-lg"
                        />

                        {/* Text */}
                        <div>
                            <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">
                                About DarLink
                            </h1>

                            <p className="text-gray-500 mb-6">
                                Connecting people with spaces through a modern platform
                        </p>

                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                            Learn More
                        </button>
                        </div>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="text-center py-7">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-10">
                        What We Offer
                    </h2>

                    <div className="flex justify-center gap-8">

                        {/* Card 1 */}
                        <div className="bg-white p-6 w-64 rounded-lg shadow-sm">
                        <div className="text-blue-600 text-3xl mb-3">📅</div>
                        <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
                        <p className="text-gray-500 text-sm">
                            Find and reserve spaces quickly with our simple booking system.
                        </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-6 w-64 rounded-lg shadow-sm">
                        <div className="text-blue-600 text-3xl mb-3">🛡️</div>
                        <h3 className="font-semibold text-lg mb-2">Community</h3>
                        <p className="text-gray-500 text-sm">
                            DarLink connects people, businesses and spaces.
                        </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-6 w-64 rounded-lg shadow-sm">
                        <div className="text-blue-600 text-3xl mb-3">👥</div>
                        <h3 className="font-semibold text-lg mb-2">Secure Platform</h3>
                        <p className="text-gray-500 text-sm">
                            Your information and transactions are protected.
                        </p>
                        </div>

                    </div>
                </section>

                {/* TEAM */}
                <section className="text-center py-7">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-10">
                    Our Team
                </h2>

                <div className="flex justify-center gap-16">

                    <div>
                        <a href="https://github.com/abdelouahedait" target="_blank">
                            <img
                                src={team1}
                                className="w-20 h-20 rounded-full object-cover mx-auto flex items-center justify-center
                                rounded-full border bg-white
                                transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                                </img>
                                <p className="mt-2 text-gray-700">a-ait-bo</p>
                        </a>
                    </div>

                    <div>
                        <a href="https://github.com/abd3l3li" target="_blank">
                            <img
                                src={team2}
                                    className="w-20 h-20 rounded-full object-cover mx-auto flex items-center justify-center
                                    rounded-full border bg-white
                                    transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                            />
                            <p className="mt-2 text-gray-700">abel-baz</p>
                        </a>
                    </div>

                    <div>
                        <a href="https://github.com/Lc0d3r" target="_blank">
                            <img
                                src={team3}
                                className="w-20 h-20 rounded-full object-cover mx-auto flex items-center justify-center
                                    rounded-full border bg-white
                                    transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                            />
                            <p className="mt-2 text-gray-700">ysahraou</p>
                        </a>
                    </div>

                    <div>
                        <a href="https://github.com/TGK1921" target="_blank">
                    <img
                        src={team4}
                        className="w-20 h-20 rounded-full object-cover mx-auto flex items-center justify-center
                            rounded-full border bg-white
                            transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    />
                    <p className="mt-2 text-gray-700">her-rehy</p>
                    </a>
                    </div>

                </div>
                </section>

                </div>
        </>
        
    );
}