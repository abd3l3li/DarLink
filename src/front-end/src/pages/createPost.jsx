import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer.jsx";
import Gallery from "@/components/utils/gallery";


export default function CreatePost() {

    return (
        <div className="create-post h-screen flex flex-col relative ">

            <Navbar isLoggedIn={true} />

            <div className="">
                <Gallery />
            </div>

            <div>
                <span>
                    <h1></h1>
                    <span></span>
                </span>
            </div>
            <div>
                <span>
                    <h1></h1>
                    <span></span>
                </span>                
            </div>
            <div>
                <span>
                    <h1></h1>
                    <span></span>
                </span>                
            </div>

            <div>
                <span>

                </span>
                <span>

                </span>
            </div>
            
            <Footer />
        </div>
    );
}