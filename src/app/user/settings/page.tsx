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

function DeleteAccountConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
        <div className="flex items-start justify-between mb-4">
          <div className="text-left">
            <h2 className="text-lg font-bold mb-2">Delete Account</h2>
            <p className="text-sm text-gray-600">
              This will take you to the registration page.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-2xl text-gray-500 hover:text-gray-900 leading-none"
          >
            ×
          </button>
        </div>

        <p className="font-semibold mb-6 text-black">
          Are you sure you want to delete your account?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded font-semibold"
          >
            Yes
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-200 text-black px-4 py-2 rounded font-semibold"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();

  const [showLogout, setShowLogout] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [openSection, setOpenSection] =
    useState("");

  /* ===================== USER ===================== */
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } =
        await supabase.auth.getUser();

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

  return (
    <>
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
            onClick={() =>
              router.push("/user/profile")
            }
            className="mb-6 cursor-pointer text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-white overflow-hidden flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  className="w-full h-full object-cover"
                  alt="Profile"
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
              onClick={() =>
                router.push("/user/dashboard")
              }
              className="text-left p-2 hover:bg-white/10 rounded"
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                router.push("/user/inbox")
              }
              className="text-left p-2 hover:bg-white/10 rounded"
            >
              Inbox
            </button>

            <button
              onClick={() =>
                router.push("/user/wallet")
              }
              className="text-left p-2 hover:bg-white/10 rounded"
            >
              Wallet
            </button>

            <button
              onClick={() =>
                router.push("/user/notifications")
              }
              className="text-left p-2 hover:bg-white/10 rounded"
            >
              Notifications
            </button>

            <button
              onClick={() =>
                router.push("/user/settings")
              }
              className="text-left p-2 bg-white/20 rounded font-semibold"
            >
              Settings
            </button>

            <div className="mt-auto pt-6 flex flex-col gap-2">
              <button
                onClick={() =>
                  router.push("/user/help")
                }
                className="text-left p-2 hover:bg-white/10 rounded"
              >
                Help & Support
              </button>

              <button
                onClick={() =>
                  setShowLogout(true)
                }
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

          {/* ===================== SETTINGS ===================== */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">
              Settings
            </h1>

            <div className="space-y-6">
              {/* APPEARANCE */}
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <button
                  onClick={() =>
                    setOpenSection(
                      openSection ===
                        "appearance"
                        ? ""
                        : "appearance"
                    )
                  }
                  className="w-full flex justify-between items-center p-6"
                >
                  <div className="text-left">
                    <h2 className="text-xl font-bold">
                      Appearance
                    </h2>

                    <p className="text-sm text-gray-600 mt-1">
                      Customize the look and
                      feel.
                    </p>
                  </div>

                  <span className="text-2xl">
                    {openSection ===
                    "appearance"
                      ? "−"
                      : "+"}
                  </span>
                </button>

                {openSection ===
                  "appearance" && (
                  <div className="px-6 pb-6 border-t space-y-3 pt-4">
                    <button className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                      Dark Mode
                    </button>

                    <button className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                      Language & Region
                    </button>

                    <button className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                      Currency Selector
                    </button>

                    <button className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                      Date Format
                    </button>

                    <button className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                      Time Format
                    </button>
                  </div>
                )}
              </div>

              {/* BOOKING DEFAULTS */}
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <button
                  onClick={() =>
                    setOpenSection(
                      openSection ===
                        "booking"
                        ? ""
                        : "booking"
                    )
                  }
                  className="w-full flex justify-between items-center p-6"
                >
                  <div className="text-left">
                    <h2 className="text-xl font-bold">
                      Booking Defaults
                    </h2>

                    <p className="text-sm text-gray-600 mt-1">
                      Manage your booking
                      preferences.
                    </p>
                  </div>

                  <span className="text-2xl">
                    {openSection ===
                    "booking"
                      ? "−"
                      : "+"}
                  </span>
                </button>

                {openSection === "booking" && (
                  <div className="px-6 pb-6 border-t space-y-3 pt-4">
                    <button className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                      Number of Guest/s
                    </button>

                    <button className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                      Bed Type
                    </button>
                  </div>
                )}
              </div>

              {/* LEGAL */}
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <button
                  onClick={() =>
                    setOpenSection(
                      openSection ===
                        "legal"
                        ? ""
                        : "legal"
                    )
                  }
                  className="w-full flex justify-between items-center p-6"
                >
                  <div className="text-left">
                    <h2 className="text-xl font-bold">
                      Legal
                    </h2>

                    <p className="text-sm text-gray-600 mt-1">
                      View legal information
                      and support.
                    </p>
                  </div>

                  <span className="text-2xl">
                    {openSection ===
                    "legal"
                      ? "−"
                      : "+"}
                  </span>
                </button>

                {openSection === "legal" && (
                  <div className="px-6 pb-6 border-t space-y-3 pt-4">
                    <button
                      onClick={() =>
                        router.push("/terms")
                      }
                      className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      Terms & Conditions
                    </button>

                    <button
                      onClick={() =>
                        router.push("/privacy")
                      }
                      className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      Privacy Policy
                    </button>

                    <button
                      onClick={() =>
                        router.push("/user/help")
                      }
                      className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      Help & Support
                    </button>

                    <button
                      onClick={() =>
                        router.push("/cookies")
                      }
                      className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      Cookie Policy
                    </button>
                  </div>
                )}
              </div>

              {/* DELETE ACCOUNT */}
              <div className="bg-white rounded-2xl shadow border border-red-200 overflow-hidden">
                <button
                  onClick={() =>
                    setOpenSection(
                      openSection ===
                        "delete"
                        ? ""
                        : "delete"
                    )
                  }
                  className="w-full flex justify-between items-center p-6"
                >
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-red-600">
                      Delete Account
                    </h2>

                    <p className="text-sm text-gray-600 mt-1">
                      Permanently delete your
                      account.
                    </p>
                  </div>

                  <span className="text-2xl text-red-600">
                    {openSection ===
                    "delete"
                      ? "−"
                      : "+"}
                  </span>
                </button>

                {openSection === "delete" && (
                  <div className="px-6 pb-6 border-t pt-4">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                      Delete My Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteAccountConfirmModal
          onConfirm={async () => {
            await supabase.auth.signOut();
            router.push("/auth/user");
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* ===================== FOOTER ===================== */}
      <footer className="fixed bottom-0 left-56 right-0 bg-[#3a4659] text-white text-xs py-4 px-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/terms")}
        >
          Terms & Conditions
        </button>

        <button
          onClick={() => router.push("/privacy")}
        >
          Privacy Policy
        </button>

        <button
          onClick={() => router.push("/cookies")}
        >
          Cookie Policy
        </button>
      </footer>
    </>
  );
}