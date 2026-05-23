"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  sender: "hotel" | "user";
  text: string;
};

type Chat = {
  id: number;
  name: string;
  handler: string;
  messages: Message[];
};

export default function InboxPage() {
  const router = useRouter();

  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [showNewChat, setShowNewChat] = useState(false);

  const [messageInput, setMessageInput] = useState("");

  const [newHotel, setNewHotel] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [hasNewBooking, setHasNewBooking] = useState(true);

  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "Hotel Cebu Grand",
      handler: "Juan D. Cruz",
      messages: [
        { sender: "hotel", text: "Your room is ready for check-in." },
        { sender: "user", text: "Okay thank you!" },
      ],
    },
    {
      id: 2,
      name: "Shangri-La Cebu",
      handler: "Maria S. Reyes",
      messages: [
        { sender: "hotel", text: "Do you need airport pickup?" },
        { sender: "user", text: "Yes please." },
      ],
    },
    {
      id: 3,
      name: "Radisson Blu",
      handler: "Carlos M. Lim",
      messages: [
        { sender: "hotel", text: "Your booking has been confirmed." },
        { sender: "user", text: "Nice!" },
      ],
    },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      const userId = userData.user.id;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single();

      if (data) {
        setUserName(data.full_name);
        setAvatar(data.avatar_url);
      }
    };

    fetchUser();
  }, []);

  // ================= NEW BOOKING ALERT =================
  useEffect(() => {
    if (!hasNewBooking) return;

    const timer = setTimeout(() => {
      setChats((prev) => [
        {
          id: Date.now(),
          name: "New Booking Alert",
          handler: "System",
          messages: [
            {
              sender: "hotel",
              text: "New guest booked Radisson Blu Cebu - Deluxe Room.",
            },
          ],
        },
        ...prev,
      ]);

      setHasNewBooking(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [hasNewBooking]);

  const activeChat = chats.find((c) => c.id === selectedChat);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { sender: "user", text: messageInput },
              ],
            }
          : chat
      )
    );

    setMessageInput("");

    setTimeout(() => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    sender: "hotel",
                    text: "Hotel received your message.",
                  },
                ],
              }
            : chat
        )
      );
    }, 900);
  };

  // ================= CREATE CHAT =================
  const createNewChat = () => {
    if (!newHotel.trim() || !newMessage.trim()) return;

    const newChat: Chat = {
      id: Date.now(),
      name: newHotel,
      handler: "Hotel Staff",
      messages: [
        { sender: "user", text: newMessage },
        {
          sender: "hotel",
          text: `Welcome to ${newHotel}. How can we help you?`,
        },
      ],
    };

    setChats((prev) => [...prev, newChat]);
    setSelectedChat(newChat.id);

    setNewHotel("");
    setNewMessage("");
    setShowNewChat(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <div className="w-56 bg-[#3a4659] text-white p-4 flex flex-col">
        <div
          onClick={() => router.push("/user/profile")}
          className="mb-6 cursor-pointer text-center"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-white overflow-hidden flex items-center justify-center">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              "U"
            )}
          </div>
          <p className="mt-2 font-semibold">{userName || "User"}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm flex-1">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="text-left p-2 hover:bg-white/10 rounded"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/user/inbox")}
            className="text-left p-2 bg-white text-black rounded font-semibold"
          >
            Inbox
          </button>

          <button
            onClick={() => router.push("/user/wallet")}
            className="text-left p-2 hover:bg-white/10 rounded"
          >
            Wallet
          </button>

          <button
            onClick={() => router.push("/user/notifications")}
            className="text-left p-2 hover:bg-white/10 rounded"
          >
            Notifications
          </button>

          <button
            onClick={() => router.push("/user/settings")}
            className="text-left p-2 hover:bg-white/10 rounded"
          >
            Settings
          </button>

          <div className="mt-auto pt-6 flex flex-col gap-2">
            <button
              onClick={() => router.push("/user/help")}
              className="text-left p-2 hover:bg-white/10 rounded"
            >
              Help & Support
            </button>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/auth/user");
              }}
              className="text-left p-2 hover:bg-white/10 rounded text-red-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 pb-32 overflow-y-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Inn Sync</h1>
          <div className="flex justify-center mt-2">
            <div className="w-1/2 border-b border-gray-400"></div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Inbox</h1>
        </div>

        <div className="flex gap-6">
          <div className="w-1/3 bg-white border-r p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-black">Messages</h2>
              <button
                onClick={() => setShowNewChat(true)}
                className="ml-auto bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 font-semibold transition"
              >
                + New Chat
              </button>
            </div>

            <div className="space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`text-left w-full p-3 border rounded-xl transition ${
                    selectedChat === chat.id ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
                  }`}
                >
                  <p className="font-bold text-black text-base">{chat.name}</p>
                  <p className="text-xs text-gray-800 font-medium">Handled by {chat.handler}</p>
                  <p className="text-sm text-gray-700 mt-1 truncate font-medium">
                    {chat.messages[chat.messages.length - 1]?.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 bg-white rounded-2xl shadow-sm">
            {!activeChat ? (
              <p className="text-gray-600 font-semibold">Select a conversation</p>
            ) : (
              <div className="flex flex-col h-full">
                <div className="border-b pb-3 mb-4">
                  <h2 className="text-lg font-bold text-black">{activeChat.name}</h2>
                  <p className="text-sm text-gray-700 font-medium">Handled by: {activeChat.handler}</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                  {activeChat.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl max-w-[75%] border text-base font-medium ${
                        msg.sender === "user"
                          ? "bg-white text-black ml-auto border-gray-300"
                          : "bg-[#90a1b9] text-black border-[#7d8aa1]"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex gap-2 items-center">
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full border-2 border-gray-400 p-3 rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-600 font-medium"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 font-semibold transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-56 right-0 bg-[#3a4659] text-white text-xs py-4 px-6 flex justify-between items-center">
        <p className="text-sm font-medium">© 2026 Inn Sync. All rights reserved.</p>
        <div className="flex gap-5 text-sm">
          <button className="hover:underline" onClick={() => router.push("/privacy")}>Privacy Policy</button>
          <button className="hover:underline" onClick={() => router.push("/terms")}>Terms & Conditions</button>
        </div>
      </footer>

      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg text-black">
            <h2 className="text-lg font-bold mb-3">Start New Chat</h2>
            <input
              value={newHotel}
              onChange={(e) => setNewHotel(e.target.value)}
              placeholder="Hotel name..."
              className="w-full border p-2 rounded mb-3 text-black font-medium"
            />
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              className="w-full border p-2 rounded mb-3 text-black font-medium"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={createNewChat}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
