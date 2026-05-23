"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/* ===================== LOGOUT MODAL ===================== */
function LogoutModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-lg font-bold mb-4">
          Are you sure you want to log out?
        </h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Yes
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== TERMS MODAL ===================== */
function TermsModal({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-3">Terms and Conditions</h1>

        <div className="text-sm text-gray-600 space-y-2 max-h-60 overflow-y-auto border p-3 rounded">
          <p>By using Inn Sync, you agree to hotel booking rules.</p>

          <ul className="list-disc pl-5">
            <li>Bookings depend on availability</li>
            <li>Payments required before confirmation</li>
            <li>Cancellations follow policy</li>
          </ul>
        </div>

        <label className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          I agree
        </label>

        <button
          disabled={!checked}
          onClick={onAccept}
          className={`mt-4 w-full py-2 rounded text-white ${
            checked ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}

/* ===================== HOTEL DATA ===================== */
const cebuHotels = [
  {
    id: 1,
    name: "Radisson Blu Cebu",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    details: "Deluxe Room • Pool • Breakfast • City View",
    sqm: 35,
    guests: 2,
  },
  {
    id: 2,
    name: "Shangri-La Mactan",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    details: "Ocean View • Beach Access • Breakfast",
    sqm: 45,
    guests: 3,
  },
  {
    id: 3,
    name: "Quest Hotel Cebu",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
    rating: 4.3,
    details: "Standard Room • WiFi • City Center",
    sqm: 28,
    guests: 2,
  },
];

/* ===================== MAIN ===================== */
export default function DashboardPage() {
  const router = useRouter();

  const [showTerms, setShowTerms] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [currentBookings, setCurrentBookings] = useState<any[]>([]);
  const [historyBookings, setHistoryBookings] = useState<any[]>([]);

  const [index, setIndex] = useState(0);
  const [hotelIndex, setHotelIndex] = useState(0);

  /* ===================== TERMS ===================== */
  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted");

    if (!accepted) {
      setShowTerms(true);
    }
  }, []);

  const acceptTerms = () => {
    localStorage.setItem("termsAccepted", "true");
    setShowTerms(false);
  };

  /* ===================== USER ===================== */
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

  /* ===================== BOOKINGS ===================== */
  useEffect(() => {
    const fetchBookings = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      const userId = userData.user.id;

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId);

      if (data) {
        setCurrentBookings(data.filter((b) => b.status === "current"));
        setHistoryBookings(data.filter((b) => b.status === "completed"));
      }
    };

    fetchBookings();
  }, []);

  const booking = currentBookings[index];
  const selectedHotel = cebuHotels[hotelIndex];

  return (
    <>
      {/* ===================== TERMS ===================== */}
      {showTerms && <TermsModal onAccept={acceptTerms} />}

      {/* ===================== LOGOUT ===================== */}
      {showLogout && (
        <LogoutModal
          onCancel={() => setShowLogout(false)}
          onConfirm={async () => {
            await supabase.auth.signOut();
            router.push("/auth/user");
          }}
        />
      )}

      <div className="flex min-h-screen bg-gray-100 text-black">
        {/* ===================== SIDEBAR ===================== */}
        <div className="w-56 bg-[#3a4659] text-white p-4 flex flex-col">
          {/* PROFILE */}
          <div
            onClick={() => router.push("/user/profile")}
            className="mb-6 cursor-pointer text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-white overflow-hidden flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  className="w-full h-full object-cover"
                />
              ) : (
                "U"
              )}
            </div>

            <p className="mt-2 font-semibold">
              {userName || "User"}
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="flex flex-col gap-2 text-sm flex-1">
            <button
              onClick={() => router.push("/user/dashboard")}
              className="text-left p-2 hover:bg-white/10 rounded"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/user/inbox")}
              className="text-left p-2 hover:bg-white/10 rounded"
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
                onClick={() => setShowLogout(true)}
                className="text-left p-2 hover:bg-white/10 rounded text-red-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* ===================== MAIN ===================== */}
        <div className="flex-1 p-8 pb-32 overflow-y-auto">
          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold">
              Inn Sync
            </h1>

            <div className="flex justify-center mt-2">
              <div className="w-1/2 border-b border-gray-400"></div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-6">
            Welcome, {userName || "User"}
          </h1>

          {/* ===================== CEBU HOTELS ===================== */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">
              Cebu Hotels
            </h2>
          </div>

          <div className="relative bg-white rounded-2xl shadow p-5 mb-10">
            <button
              onClick={() =>
                setHotelIndex((prev) =>
                  prev === 0
                    ? cebuHotels.length - 1
                    : prev - 1
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-3 py-1 rounded-full text-2xl"
            >
              ‹
            </button>

            <button
              onClick={() =>
                setHotelIndex((prev) =>
                  prev === cebuHotels.length - 1
                    ? 0
                    : prev + 1
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-3 py-1 rounded-full text-2xl"
            >
              ›
            </button>

            <img
              src={selectedHotel.image}
              className="w-full h-72 object-cover rounded-xl"
            />

            <div className="mt-4">
              <h3 className="text-2xl font-bold">
                {selectedHotel.name}
              </h3>

              <p className="text-gray-700 mt-2">
                {selectedHotel.details}
              </p>

              <div className="flex gap-5 mt-3 text-sm text-gray-700">
                <p>⭐ {selectedHotel.rating}</p>
                <p>{selectedHotel.sqm} sqm</p>
                <p>{selectedHotel.guests} Guests</p>
              </div>

              <button
                onClick={() => router.push(selectedHotel?.id ? `/hotels/${selectedHotel.id}` : "#")}
                className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Book Now!
              </button>
            </div>
          </div>

          {/* ===================== BOOKING HISTORY ===================== */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">
              Booking History
            </h2>

            <button
              onClick={() =>
                router.push("/user/booking-history")
              }
              className="text-blue-600 hover:underline"
            >
              See Booking History
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow overflow-hidden">
            {(historyBookings.length > 0
              ? historyBookings
              : [
                  {
                    room: "Deluxe Room",
                    hotel_name: "Radisson Blu Cebu",
                    sqm: 35,
                    guests: 2,
                    rating: 4.8,
                  },
                  {
                    room: "Ocean View Room",
                    hotel_name: "Shangri-La Mactan",
                    sqm: 45,
                    guests: 3,
                    rating: 4.9,
                  },
                ]
            ).map((b: any, i: number) => (
              <div
                key={i}
                className="grid grid-cols-5 gap-4 p-4 border-b text-sm items-center"
              >
                <div className="font-semibold">
                  {b.room}
                </div>

                <div>{b.hotel_name}</div>

                <div>
                  {b.sqm} sqm • {b.guests} guests
                </div>

                <div>⭐ {b.rating}</div>

                <div className="text-right">
                  <button
                    className="text-blue-600 hover:underline"
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== FOOTER ===================== */}
      <footer className="fixed bottom-0 left-56 right-0 bg-[#3a4659] text-white text-xs py-4 px-6 flex justify-between items-center">
        <button onClick={() => router.push("/terms")}>
          Terms & Conditions
        </button>

        <button onClick={() => router.push("/privacy")}>
          Privacy Policy
        </button>

        <button onClick={() => router.push("/cookies")}>
          Cookie Policy
        </button>
      </footer>
    </>
  );
}