import { useParams, Link } from "react-router-dom";
import { contacts as INITIAL_CONTACTS, messages as INITIAL_MESSAGES, getOwnerById,
  getStaysByOwnerId, getStayById } from "../components/stays/staysTemp.js";
  import Return from "../components/utils/retutn_home.jsx";
  
import { useState, useRef, useEffect, useMemo } from "react";

/* ------------------- helper functions ------------------- */

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ name, online }) {
  return (
    <div className="relative">
      <div className="w-10 h-10 rounded-full bg-blue-100 text-[var(--color-primary)] flex 
                        items-center justify-center font-semibold text-sm">
        {getInitials(name)}
      </div>

      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full 
                          bg-[var(--color-secondary)] border-2 border-[var(--color-surface)]" />
      )}
    </div>
  );
}

function FriendButton({ status, onAction }) {
  const config = {
    friend: { label: "Delete", action: "unfriend", color: "bg-red-500 hover:bg-red-600" },
    pending: { label: "Pending", action: "cancel", color: "bg-yellow-500 hover:bg-yellow-600" },
    none: { label: "Add Friend", action: "request", color: "bg-green-500 hover:bg-green-600" },
  };

  const { label, action, color } = config[status] || config.none;

  return (
    <button
      onClick={() => onAction(action)}
      className={`${color} text-white px-5 py-2 rounded-full text-sm font-semibold`}
    >
      {label}
    </button>
  );
}

function ProfileModal({ contact, onClose, onSelectListing }) {
  if (!contact) return null;

  // Get listings for this contact
  const listings = getStaysByOwnerId(contact.id);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/20"
      onClick={onClose}
    >
      <div
        className="relative w-80 max-h-[80vh] overflow-y-auto rounded-3xl bg-[var(--color-surface)] 
                    shadow-[0_0_0_1px_rgba(37,99,235,0.25)] p-6 flex 
                    flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* x */}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-lg text-[var(--color-text)] hover:opacity-70"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-sm font-semibold mb-6 text-[var(--color-text)]">Profile</h2>

        {/* avatar */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full 
                        bg-[var(--color-bg)] border border-[var(--color-primary)] 
                        text-lg font-semibold text-[var(--color-text)]">
          {getInitials(contact.name)}
        </div>

        <p className="text-base font-semibold text-[var(--color-text)] mb-4">
          {contact.name}
        </p>

        {/* info */}
        <div className="space-y-4 text-sm w-full">
          <div>
            <p className="text-[var(--color-muted)]">Location:</p>
            <p className="font-semibold text-[var(--color-secondary)]">
              {contact.location || "Unknown"}
            </p>
          </div>
          
          {/* listings section*/}
          <div>
            <p className="text-[var(--color-muted)] mb-2">Listings ({listings.length}):</p>
            {listings.length > 0 ? (
              <div className="space-y-2">
                {listings.map((listing) => (
                  <button
                    key={listing.id}
                    onClick={() => onSelectListing(listing)}
                    className="w-full p-3 bg-[var(--color-bg)] rounded-xl text-left 
                              hover:bg-[var(--color-primary)] hover:text-[var(--color-surface)]
                              transition-colors duration-200"
                  >
                    <p className="font-semibold text-sm">{listing.city}</p>
                    <p className="text-xs opacity-80">
                      {listing.type} • {listing.avSlots} slots • {listing.price} MAD
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-muted)] text-xs">No listings available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingView({ listing, onBack }) {
  if (!listing) return null;

  return (
    <div className="flex-1 flex items-center justify-center bg-[var(--color-bg)] p-6 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-[var(--color-surface)] 
                        shadow-[0_0_0_1px_rgba(37,99,235,0.25)] p-6 flex flex-col 
                        items-center text-center">
        
        {listing.photos?.[0] && (
          <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
            <img 
              src={listing.photos[0]} 
              alt={listing.city} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h2 className="text-lg font-semibold mb-2 text-[var(--color-text)]">
          {listing.city}
        </h2>
        
        <p className="text-sm text-[var(--color-muted)] mb-4">
          {listing.type} • {listing.avSlots} slots available • {listing.price} MAD
        </p>

        {listing.details && (
          <p className="text-sm text-[var(--color-text)] mb-4 text-left w-full">
            {listing.details}
          </p>
        )}

        {listing.included && listing.included.length > 0 && (
          <div className="w-full text-left mb-4">
            <p className="text-sm font-semibold text-[var(--color-text)] mb-2">What's Included:</p>
            <ul className="text-xs text-[var(--color-muted)] space-y-1">
              {listing.included.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        )}

        {listing.expectations && listing.expectations.length > 0 && (
          <div className="w-full text-left mb-4">
            <p className="text-sm font-semibold text-[var(--color-text)] mb-2">House Rules:</p>
            <ul className="text-xs text-[var(--color-muted)] space-y-1">
              {listing.expectations.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          type="button"
          onClick={onBack}
          className="bg-[var(--color-primary)] text-[var(--color-surface)] 
                      px-4 py-2 rounded-lg text-sm hover:opacity-90 mt-2"
        >
          Back to chat
        </button>
      </div>
    </div>
  );
}







export default function ChatPage() {
  
  const params = useParams();
  const { ownerId, stayId } = params;
  
  // from staysTemp.js
  const targetOwner = getOwnerById(ownerId);
  const contextListing = stayId ? getStayById(stayId) : null;
  
  // initialize contacts
  // Boolean for tracking falsy values
  const initialContacts = useMemo(() => {
    const contactsList = targetOwner 
      ? [INITIAL_CONTACTS.find(c => c.id === ownerId), ...INITIAL_CONTACTS.filter(c => c.id !== ownerId)].filter(Boolean)
      : [...INITIAL_CONTACTS];
    
    if (contactsList.length > 0) {
      contactsList[0] = { ...contactsList[0], unread: 0 };
    }
    return contactsList;
  }, [ownerId, targetOwner]);

  const [contacts, setContacts] = useState(initialContacts);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeId, setActiveId] = useState(ownerId || initialContacts[0]?.id);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [view, setView] = useState("chat"); // "chat" or "listing"
  const [selectedListing, setSelectedListing] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const activeContact = contacts.find((c) => c.id === activeId) || contacts[0];
  const chatMessages = messages[activeId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [chatMessages, activeId]);

  // no contacts
  if (!activeContact) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <p className="text-[var(--color-muted)]">No contacts available</p>
      </div>
    );
  }

  function selectContact(id) {
    setActiveId(id);
    setView("chat");
    setSelectedListing(null);

    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }

  function handleFriendAction(action) {
    const nextStatus = { request: "pending", cancel: "none", unfriend: "none" };
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, friendStatus: nextStatus[action] } : c
      )
    );
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const newMsg = { id: Date.now(), text, from: "me" };

    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));

    setContacts((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, preview: text } : c))
    );

    setInput("");
  }

  function handleClickHere() {
    if (contextListing) {
      // a specific listing
      setSelectedListing(contextListing);
    } else {
      // first listing of this owner
      const ownerListings = getStaysByOwnerId(activeContact.id);
      if (ownerListings.length > 0) {
        setSelectedListing(ownerListings[0]);
      }
    }
    setView("listing");
  }

  // selecting listing from profile modal
  function handleSelectListingFromProfile(listing) {
    setShowProfile(false);
    setSelectedListing(listing);
    setView("listing");
  }


  return (
    <div className="h-screen max-w-7xl mx-auto p-4 flex flex-col bg-[var(--color-bg)] overflow-hidden">

      <div className="flex justify-end mb-4">
          <Link to="/"> 
              <Return className="cursor-pointer" />
          </Link>
      </div>

      <div className="flex-1 flex flex-col md:flex-row bg-[var(--color-surface)] 
                        rounded-2xl shadow-xl overflow-hidden">

        {/* friends list */}
        <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r 
                          border-[var(--color-border-gray)] flex flex-col">
          <h2 className="text-lg font-bold p-4 border-b 
                          text-[var(--color-text)]">People</h2>

          <div className="flex-1 overflow-y-auto">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => selectContact(c.id)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--color-bg)] transition
                  ${c.id === activeId ? "bg-[var(--color-bg)] border-l-4 border-[var(--color-secondary)]" : ""}`}
              >
                <Avatar name={c.name} online={c.online} />
                <div className="flex-1 min-w-0"> {/* min-w-0 allows text to truncate properly */}
                  <span className="block font-semibold text-sm text-[var(--color-text)]">{c.name}</span>
                  <span className="block text-xs text-[var(--color-muted)] truncate">{c.preview}</span>
                </div>
                {c.unread > 0 && (
                  <span className="bg-[var(--color-secondary)] text-[var(--color-surface)] 
                                    text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* the chat */}
        <main className="flex-1 flex flex-col">

          {/* header */}
          <header className="flex justify-between items-center p-5 border-b border-[var(--color-border-gray)]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className="rounded-full focus:outline-none"
                aria-label="Open profile"
              >
                <Avatar name={activeContact.name} online={activeContact.online} />
              </button>
              <div>
                <p className="font-semibold text-[var(--color-text)]">{activeContact.name}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {contextListing ? `Chat about: ` : `View listing: `}
                  <button
                    type="button"
                    onClick={handleClickHere}
                    className="text-[var(--color-primary)] hover:underline hover:text-[var(--color-secondary)]"
                  >
                    Click here
                  </button>
                </p>
              </div>
            </div>
            <FriendButton status={activeContact.friendStatus} onAction={handleFriendAction} />
          </header>

          {view === "chat" ? (
            <>
              {/* messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--color-bg)]">
                {chatMessages.length === 0 ? (
                  <p className="h-full flex items-center justify-center text-sm text-[var(--color-muted)]">
                    Start a conversation...
                  </p>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] sm:max-w-[70%] break-words break-all whitespace-pre-wrap
                          ${msg.from === "me"
                            ? "bg-[var(--color-primary)] text-[var(--color-surface)] rounded-br-md"
                            : "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-gray)] rounded-bl-md"
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* input field */}
              <div className="p-4 border-t border-[var(--color-border-gray)] bg-[var(--color-surface)]">
                <div className="flex items-center gap-3 bg-[var(--color-bg)] rounded-xl px-4 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent outline-none text-sm text-[var(--color-text)]"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-[var(--color-primary)] hover:opacity-90 
                              text-[var(--color-surface)] px-4 py-2 rounded-lg text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <ListingView listing={selectedListing} onBack={() => setView("chat")} />
          )}
        </main>
      </div>

      {showProfile && (
        <ProfileModal 
          contact={activeContact} 
          onClose={() => setShowProfile(false)} 
          onSelectListing={handleSelectListingFromProfile}
        />
      )}
    </div>
  );
}
