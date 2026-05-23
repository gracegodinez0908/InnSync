"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Booking = {
  id: number;
  hotel_name: string;
  status: "confirmed" | "pending" | "cancelled" | "current" | "completed";
  created_at: string;
  total_price?: number;
  payment_method?: string;
  payment_amount?: number;
  used_wallet_cashback?: boolean;
};

export default function NotificationsPage() {
  const router = useRouter();

  const [bookingTab, setBookingTab] = useState<"active" | "finished">("active");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      const userId = userData.user.id;

      const [profileRes, bookingRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", userId)
          .single(),
        supabase
          .from("bookings")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) {
        setUserName(profileRes.data.full_name);
        setAvatar(profileRes.data.avatar_url);
      }

      if (bookingRes.error) {
        setErrorMsg(bookingRes.error.message);
        return;
      }

      setBookings(bookingRes.data ?? []);
    };

    fetchBookings();
  }, []);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "current":
      case "completed":
        return "text-green-700";
      case "pending":
        return "text-yellow-700";
      case "cancelled":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  const activeBookings = bookings.filter((b) =>
    ["confirmed", "pending", "current"].includes(b.status)
  );

  const finishedBookings = bookings.filter((b) =>
    ["completed", "cancelled"].includes(b.status)
  );

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
            className="text-left p-2 bg-white text-black rounded font-semibold"
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
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          {errorMsg && (
            <p className="text-red-600 mb-3 font-medium">{errorMsg}</p>
          )}

          <h2 className="font-bold text-xl mb-4">📝 Booking Updates</h2>

          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setBookingTab("active")}
              className={`px-4 py-2 rounded font-semibold ${
                bookingTab === "active" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              Active
            </button>

            <button
              onClick={() => setBookingTab("finished")}
              className={`px-4 py-2 rounded font-semibold ${
                bookingTab === "finished" ? "bg-gray-700 text-white" : "bg-gray-200"
              }`}
            >
              Finished
            </button>
          </div>

          {bookingTab === "active" ? (
            activeBookings.length === 0 ? (
              <p className="text-gray-600">No active bookings.</p>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((b) => (
                  <div
                    key={b.id}
                    className="border rounded-xl p-5 bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h2 className="text-lg font-bold">{b.hotel_name}</h2>
                        <p className="text-sm text-gray-700">Created: {timeAgo(b.created_at)}</p>
                      </div>
                      <p className={`font-bold ${statusColor(b.status)}`}>{b.status.toUpperCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : finishedBookings.length === 0 ? (
            <p className="text-gray-600">No finished bookings.</p>
          ) : (
            <div className="space-y-4">
              {finishedBookings.map((b) => (
                <div
                  key={b.id}
                  className="border rounded-xl p-5 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-lg font-bold">{b.hotel_name}</h2>
                      <p className="text-sm text-gray-700">Created: {timeAgo(b.created_at)}</p>
                    </div>
                    <p className={`font-bold ${statusColor(b.status)}`}>{b.status.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="fixed bottom-0 left-56 right-0 bg-[#3a4659] text-white text-xs py-4 px-6 flex justify-between items-center">
        <p className="text-sm font-medium">© 2026 Inn Sync. All rights reserved.</p>
        <div className="flex gap-5 text-sm">
          <button className="hover:underline" onClick={() => router.push("/privacy")}>Privacy Policy</button>
          <button className="hover:underline" onClick={() => router.push("/terms")}>Terms & Conditions</button>
        </div>
      </footer>
    </div>
  );
}
