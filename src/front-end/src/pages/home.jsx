import Navbar from "../components/layout/Navbar.jsx";
import Background from "../components/layout/bg.jsx";
import Card from "../components/stays/card.jsx";

const stays = [
    {
        id: 1,
        city: "Rabat",
        state: "Private",
        avSlots: 3,
        price: 500,
        photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    },
    {
        id: 2,
        city: "Casablanca",
        state: "Available",
        avSlots: 1,
        price: 700,
        photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    },
    {
        id: 3,
        city: "Marrakech",
        state: "Unavailable",
        avSlots: 0,
        price: 600,
        photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    }
]; 

export default function Home() {
    return (
        <div className="home h-screen overflow-hidden flex flex-col relative">
            {/* <Navbar isLoggedIn={true} /> */}
            {/* <Background /> */}
            <Card stay={stays[0]} />
        </div>
    );
}