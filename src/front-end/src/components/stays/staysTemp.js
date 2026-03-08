// Owners data - single source of truth for owner information
export const owners = [
    {
        id: "owner-1",
        name: "Mohamed Sonbol",
        image: "https://preview.redd.it/new-cat-reaction-meme-v0-9w0fho1j6luf1.png?width=1080&crop=smart&auto=webp&s=ad1615470e1ee3b38d8dd17b1872be32440d9ddb",
        location: "Rabat",
        listings: 2,
        online: true,
    },
    {
        id: "owner-2",
        name: "Jane Doe",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        location: "Casablanca",
        listings: 3,
        online: false,
    },
    {
        id: "owner-3",
        name: "John Doe",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        location: "Marrakech",
        listings: 1,
        online: true,
    },
    {
        id: "owner-4",
        name: "Khalid Kashmiri",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        location: "Fès",
        listings: 2,
        online: false,
    },
];

// Contacts for chat - derived from owners with additional chat-specific info
export const contacts = owners.map((owner, index) => ({
    id: owner.id,
    name: owner.name,
    preview: index === 0 ? "Yes, there are two rooms." : "Looking forward to hearing from you!",
    unread: index === 1 ? 1 : index === 3 ? 5 : 0,
    online: owner.online,
    friendStatus: index === 0 ? "friend" : index === 1 ? "friend" : index === 2 ? "none" : "pending",
    location: owner.location,
    listings: owner.listings,
}));

// Messages for chat - keyed by owner ID
export const messages = {
    "owner-1": [
        { id: 1, text: "Hey There!", from: "them" },
        { id: 2, text: "Is there any tuna... I mean is the room available?", from: "them" },
        { id: 3, text: "Hello!?", from: "me" },
        { id: 4, text: "Yes, there are two rooms.", from: "me" },
    ],
    "owner-2": [{ id: 5, text: "Looking forward to hearing from you!", from: "them" }],
    "owner-3": [{ id: 6, text: "Hi, let me know if you have questions!", from: "them" }],
    "owner-4": [{ id: 7, text: "The room is still available.", from: "them" }],
};

export const stays = [
    {
        id: "stay-1",
        city: "Rabat",
        type: "Private",
        avSlots: 2,
        price: 800,
        admin: true,
        photos: ["https://preview.redd.it/new-cat-reaction-meme-v0-9w0fho1j6luf1.png?width=1080&crop=smart&auto=webp&s=ad1615470e1ee3b38d8dd17b1872be32440d9ddb", 
                    "https://preview.redd.it/new-cat-reaction-meme-v0-naz8jdui6luf1.png?width=1080&crop=smart&auto=webp&s=45763ffcfac1b0ec914d7c8ca9718380ba85cac6",
                    "https://preview.redd.it/new-cat-reaction-meme-v0-ynzuox7j6luf1.png?width=1080&crop=smart&auto=webp&s=34b1c473a4399f5024d457182b89c340c915f803",
                    "https://preview.redd.it/new-cat-reaction-meme-v0-9w0fho1j6luf1.png?width=1080&crop=smart&auto=webp&s=ad1615470e1ee3b38d8dd17b1872be32440d9ddb", 
                    "https://preview.redd.it/new-cat-reaction-meme-v0-naz8jdui6luf1.png?width=1080&crop=smart&auto=webp&s=45763ffcfac1b0ec914d7c8ca9718380ba85cac6",
                    "https://preview.redd.it/new-cat-reaction-meme-v0-ynzuox7j6luf1.png?width=1080&crop=smart&auto=webp&s=34b1c473a4399f5024d457182b89c340c915f803"],
        owner: {
            id: "owner-1",
            name: "Mohamed Sonbol",
            image: "https://preview.redd.it/new-cat-reaction-meme-v0-9w0fho1j6luf1.png?width=1080&crop=smart&auto=webp&s=ad1615470e1ee3b38d8dd17b1872be32440d9ddb"
        },
        details: "A cozy private room in the heart of Rabat, perfect for solo travelers. Enjoy the vibrant city life while having a peaceful retreat to come back to.",
        expectations: [
            "Quiet at night",
            "Smoking not allowed",
            "Guests allowed",
            "Respect common areas & noise levels"
        ],
        included: [
            "Wi-Fi included",
            "Washing machine",
            "Fridge",
            "Access to kitchen + appliances",
            "Water & electricity shared"
        ],
    },
    {
        id: "stay-2",
        city: "Casablanca",
        type: "Both",
        avSlots: 2,
        price: 700,
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"],
        owner: {
            id: "owner-1",
            name: "Mohamed Sonbol",
            image: "https://preview.redd.it/new-cat-reaction-meme-v0-9w0fho1j6luf1.png?width=1080&crop=smart&auto=webp&s=ad1615470e1ee3b38d8dd17b1872be32440d9ddb"
        },
        details: "Spacious room in Casablanca with great access to public transport.",
        expectations: ["No pets", "Keep common areas clean"],
        included: ["Wi-Fi included", "Shared bathroom"],
    },
    {
        id: "stay-3",
        city: "Marrakech",
        type: "Shared",
        avSlots: 0,
        price: 600,
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"],
        owner: {
            id: "owner-2",
            name: "Jane Doe",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },
        details: "Shared room near the Medina, perfect for budget travelers.",
        expectations: ["Respect quiet hours"],
        included: ["Wi-Fi included"],
    },
    {
        id: "stay-4",
        city: "Casablanca",
        type: "Both",
        avSlots: 1,
        price: 700,
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"],
        owner: {
            id: "owner-2",
            name: "Jane Doe",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },
        details: "Modern apartment with balcony view.",
        expectations: ["No smoking inside"],
        included: ["Wi-Fi included", "Air conditioning"],
    },
    {
        id: "stay-5",
        city: "Marrakech",
        type: "Shared",
        avSlots: 0,
        price: 600,
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"],
        owner: {
            id: "owner-3",
            name: "John Doe",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },
        details: "Traditional riad experience in the heart of Marrakech.",
        expectations: ["Respect local customs"],
        included: ["Breakfast included", "Wi-Fi"],
    },
    {
        id: "stay-6",
        city: "Casablanca",
        type: "Both",
        avSlots: 1,
        price: 700,
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"],
        owner: {
            id: "owner-2",
            name: "Jane Doe",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },
        details: "Cozy studio near the beach.",
        expectations: ["No parties"],
        included: ["Wi-Fi", "Parking"],
    },
    {
        id: "stay-7",
        city: "Fès",
        type: "Shared",
        avSlots: 0,
        price: 550,
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"],
        owner: {
            id: "owner-4",
            name: "Khalid Kashmiri",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },
        details: "Historic building in the old Medina.",
        expectations: ["Respect quiet hours after 10pm"],
        included: ["Wi-Fi", "Traditional breakfast"],
    },
    {
        id: "stay-8",
        city: "Tangier",
        type: "Private",
        avSlots: 1,
        price: 750,
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"],
        owner: {
            id: "owner-4",
            name: "Khalid Kashmiri",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },
        details: "Sea view apartment with modern amenities.",
        expectations: ["No smoking", "No pets"],
        included: ["Wi-Fi", "AC", "Sea view"],
    },
    {
        id: "stay-9",
        city: "Agadir",
        type: "Shared",
        avSlots: 3,
        price: 500,
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"],
        owner: {
            id: "owner-3",
            name: "John Doe",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYXQlMjBtb2NrJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        },
        details: "Beach house perfect for surfers.",
        expectations: ["Clean up after yourself"],
        included: ["Wi-Fi", "Surfboard storage"],
    }
];

// Helper function to get owner by ID
export const getOwnerById = (ownerId) => owners.find(o => o.id === ownerId);

// Helper function to get stay by ID
export const getStayById = (stayId) => stays.find(s => s.id === stayId);

// Helper function to get all stays by owner ID
export const getStaysByOwnerId = (ownerId) => stays.filter(s => s.owner.id === ownerId); 