import { useState, useRef, useEffect } from "react";
import returnButton from "../components/ui/returnHome.svg";

/* ------------------- data ------------------- */

const CONTACTS = [
  { id: 1, name: "qamar al-din", preview: "Yes, there are two rooms.", unread: 0, online: true, friendStatus: "friend", location: "Marrakech", listings: 1 },
  { id: 2, name: "khalid kashmiri", preview: "need food", unread: 1, online: false, friendStatus: "friend", location: "Casablanca", listings: 2 },
  { id: 3, name: "ismail kanabawi", preview: "need food", unread: 1, online: false, friendStatus: "none", location: "Rabat", listings: 0 },
  { id: 4, name: "usman shisha", preview: "need food", unread: 5, online: false, friendStatus: "pending", location: "Fès", listings: 3 },
];

const MESSAGES = {
  1: [
    { id: 1, text: "Hey There!", from: "them" },
    { id: 2, text: "Is there any tuna... I mean is the room available?", from: "them" },
    { id: 3, text: "Hello!?", from: "me" },
    { id: 4, text: "Yes, there are two rooms.", from: "me" },
  ],
  2: [{ id: 5, text: "need food", from: "them" }],
  3: [{ id: 6, text: "need food", from: "them" }],
  4: [{ id: 7, text: "need food", from: "them" }],
};

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

function ProfileModal({ contact, onClose }) {
  if (!contact) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/20"
      onClick={onClose}
    >
      <div
        className="relative w-72 rounded-3xl bg-[var(--color-surface)] 
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
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-[var(--color-muted)]">Location:</p>
            <p className="font-semibold text-[var(--color-secondary)]">
              {contact.location || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-[var(--color-muted)]">Listings:</p>
            <p className="font-semibold text-[var(--color-secondary)]">
              {contact.listings ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingPlaceholder({ contact, onBack }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-[var(--color-bg)] p-6">
      <div className="w-full max-w-sm rounded-3xl bg-[var(--color-surface)] 
                        shadow-[0_0_0_1px_rgba(37,99,235,0.25)] p-6 flex flex-col 
                        items-center text-center">
        <h2 className="text-sm font-semibold mb-4 text-[var(--color-text)]">
          Listing (placeholder)
        </h2>
        <p className="text-base font-semibold text-[var(--color-text)] mb-2">
          Room with {contact.name}
        </p>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Location: <span className="text-[var(--color-secondary)]">{contact.location}</span>
        </p>
        <p className="text-sm text-[var(--color-muted)] mb-6">
          This is a temporary preview. Real details will come from the backend later.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="bg-[var(--color-primary)] text-[var(--color-surface)] 
                      px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Back to chat
        </button>
      </div>
    </div>
  );
}







export default function ChatPage() {

  const [contacts, setContacts] = useState(CONTACTS);
  const [messages, setMessages] = useState(MESSAGES);
  const [activeId, setActiveId] = useState(1);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [view, setView] = useState("chat"); // "chat" or "listing"

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const activeContact = contacts.find((c) => c.id === activeId);
  const chatMessages = messages[activeId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [chatMessages, activeId]);




  function selectContact(id) {
    setActiveId(id);
    setView("chat");
    // Clear unread count
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

    // Update sidebar preview
    setContacts((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, preview: text } : c))
    );

    setInput("");
  }




  return (
    <div className="h-screen max-w-7xl mx-auto p-4 flex flex-col bg-[var(--color-bg)] overflow-hidden">

      {/* return */}
      <div className="flex justify-end mb-4">
        <img
          src={returnButton}
          alt="Return home"
          className="cursor-pointer hover:scale-103 active:scale-98 transition-transform"
          draggable={false}
          onClick={() => (window.location.href = "/")}
        />
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
                  Chat about{" "}
                  <button
                    type="button"
                    onClick={() => setView("listing")}
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
            <ListingPlaceholder contact={activeContact} onBack={() => setView("chat")} />
          )}
        </main>
      </div>

      {showProfile && (
        <ProfileModal contact={activeContact} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}
