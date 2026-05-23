"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/* ================= SIDEBAR ================= */
function Sidebar({
  fullName,
  profilePreview,
}: {
  fullName: string;
  profilePreview: string;
}) {
  const router = useRouter();

  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      {/* LOGOUT MODAL */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4 text-black">
              Are you sure you want to log out?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/auth/user");
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>

              <button
                onClick={() => setShowLogout(false)}
                className="bg-gray-300 px-4 py-2 rounded text-black"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-56 bg-[#3a4659] text-white p-4 flex flex-col fixed left-0 top-0 min-h-screen">
        {/* PROFILE */}
        <div
          onClick={() => router.push("/user/profile")}
          className="mb-6 cursor-pointer text-center"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-white overflow-hidden flex items-center justify-center">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              "U"
            )}
          </div>

          <p className="mt-2 font-semibold">
            {fullName || "User"}
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
    </>
  );
}

/* ================= FOOTER ================= */
function Footer() {
  const router = useRouter();

  return (
    <footer className="fixed bottom-0 left-56 right-0 bg-[#3a4659] text-white text-xs py-4 px-6 flex justify-between items-center z-40">
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
  );
}

/* ================= SAVE CONFIRM ================= */
function SaveConfirm({ onYes, onNo }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <p className="font-bold mb-4 text-black uppercase">
          ARE YOU SURE YOU WANT TO SAVE CHANGES
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onYes}
            className="bg-green-600 text-white px-4 py-2 rounded font-bold"
          >
            Yes
          </button>

          <button
            onClick={onNo}
            className="bg-red-600 text-white px-4 py-2 rounded font-bold"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= EDIT MODAL ================= */
function EditModal({
  type,
  data,
  setData,
  onCancel,
  onConfirm,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] p-6 rounded-xl shadow-lg">
        {/* NAME */}
        {type === "name" && (
          <>
            <p className="font-bold mb-3 text-lg">
              Name
            </p>

            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="First Name"
              value={data.first}
              onChange={(e) =>
                setData({ ...data, first: e.target.value })
              }
            />

            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="Middle Name"
              value={data.middle}
              onChange={(e) =>
                setData({ ...data, middle: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Last Name"
              value={data.last}
              onChange={(e) =>
                setData({ ...data, last: e.target.value })
              }
            />
          </>
        )}

        {/* USERNAME */}
        {type === "username" && (
          <>
            <p className="font-bold mb-3 text-lg">
              Username
            </p>

            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="New Username"
              value={data.new}
              onChange={(e) =>
                setData({ ...data, new: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Confirm Username"
              value={data.confirm}
              onChange={(e) =>
                setData({ ...data, confirm: e.target.value })
              }
            />
          </>
        )}

        {/* PASSWORD */}
        {type === "password" && (
          <>
            <p className="font-bold mb-3 text-lg">
              Password
            </p>

            <input
              type="password"
              className="w-full border p-2 mb-2 rounded"
              placeholder="New Password"
              value={data.new}
              onChange={(e) =>
                setData({ ...data, new: e.target.value })
              }
            />

            <input
              type="password"
              className="w-full border p-2 rounded"
              placeholder="Confirm Password"
              value={data.confirm}
              onChange={(e) =>
                setData({ ...data, confirm: e.target.value })
              }
            />
          </>
        )}

        {/* PHONE */}
        {type === "phone" && (
          <>
            <p className="font-bold mb-3 text-lg">
              Mobile Number
            </p>

            <input
              className="w-full border p-2 rounded"
              value={data.value}
              onChange={(e) =>
                setData({ ...data, value: e.target.value })
              }
            />
          </>
        )}

        {/* BIRTHDAY */}
        {type === "birthday" && (
          <>
            <p className="font-bold mb-3 text-lg">
              Birthdate
            </p>

            <input
              type="date"
              className="w-full border p-2 rounded"
              value={data.value}
              onChange={(e) =>
                setData({ ...data, value: e.target.value })
              }
            />
          </>
        )}

        {/* GENDER */}
        {type === "gender" && (
          <>
            <p className="font-bold mb-3 text-lg">
              Gender
            </p>

            <select
              className="w-full border p-2 rounded"
              value={data.value}
              onChange={(e) =>
                setData({ ...data, value: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Prefer not to say">
                Prefer not to say
              </option>
            </select>
          </>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */
export default function UserProfile() {
  const router = useRouter();

  const fileInputRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [editType, setEditType] = useState("");
  const [editData, setEditData] = useState<any>({});

  const [showSave, setShowSave] = useState(false);

  const [profilePreview, setProfilePreview] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    birthday: "",
    password: "",
    profilePic: "",
  });

  /* LOAD */
  useEffect(() => {
    const load = async () => {
      const { data: user } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.user?.id)
        .single();

      if (data) {
        setForm({
          fullName: data.full_name || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          birthday: data.birthday || "",
          password: "",
          profilePic: data.profile_pic || "",
        });

        setProfilePreview(data.profile_pic || "");
      }

      setLoading(false);
    };

    load();
  }, []);

  /* OPEN EDIT */
  const openEdit = (type: string) => {
    setEditType(type);

    if (type === "name") {
      const [first = "", middle = "", last = ""] =
        form.fullName.split(" ");

      setEditData({
        first,
        middle,
        last,
      });
    } else {
      setEditData({
        value: (form as any)[type],
        new: "",
        confirm: "",
      });
    }

    setShowEdit(true);
  };

  /* CONFIRM EDIT */
  const confirmEdit = () => {
    let updated: any = { ...form };

    if (editType === "name") {
      updated.fullName =
        `${editData.first} ${editData.middle} ${editData.last}`;
    } else if (
      editType === "username" ||
      editType === "password"
    ) {
      if (editData.new !== editData.confirm) {
        alert("Values do not match");
        return;
      }

      updated[editType] = editData.new;
    } else {
      updated[editType] = editData.value;
    }

    setForm(updated);

    setShowEdit(false);

    setShowSave(true);
  };

  /* PROFILE PIC */
  const handleProfilePic = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setProfilePreview(preview);

    const { data: user } = await supabase.auth.getUser();

    const fileName = `${user?.user?.id}-${Date.now()}`;

    await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file, {
        upsert: true,
      });

    const { data } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    setForm({
      ...form,
      profilePic: data.publicUrl,
    });

    setShowSave(true);
  };

  /* SAVE */
  const save = async () => {
    const { data: user } = await supabase.auth.getUser();

    await supabase.from("profiles").upsert({
      id: user?.user?.id,
      full_name: form.fullName,
      username: form.username,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      birthday: form.birthday,
      profile_pic: form.profilePic,
      updated_at: new Date(),
    });

    setShowSave(false);
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-900">
      <Sidebar
        fullName={form.fullName}
        profilePreview={profilePreview}
      />

      {/* MAIN */}
      <div className="ml-56 flex-1 p-8 pb-32 overflow-y-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Inn Sync
          </h1>

          <div className="flex justify-center mt-2">
            <div className="w-1/2 border-b border-gray-400"></div>
          </div>
        </div>

        {/* BACK */}
        <button
          onClick={() => router.push("/user/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-blue-600"
        >
          ← Back
        </button>

        {/* PROFILE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <div className="mt-5 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-300">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <p className="text-gray-600 mt-3">
              Profile Picture
            </p>

            <button
              onClick={() => fileInputRef.current.click()}
              className="text-blue-600 font-semibold hover:underline mt-1"
            >
              Edit Profile
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleProfilePic}
              className="hidden"
            />
          </div>
        </div>

        {/* FIELDS */}
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { label: "Name", key: "name" },
            { label: "Username", key: "username" },
            { label: "Email", key: "email" },
            { label: "Password", key: "password" },
            { label: "Mobile Number", key: "phone" },
            { label: "Birthdate", key: "birthday" },
            { label: "Gender", key: "gender" },
          ].map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-3"
            >
              <div className="w-40 font-bold">
                {f.label}
              </div>

              <div className="flex-1 border p-3 bg-white rounded-lg shadow-sm">
                {(form as any)[f.key]}
              </div>

              {f.key !== "email" && (
                <button
                  onClick={() => openEdit(f.key)}
                  className="text-blue-700 font-bold hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* EDIT MODAL */}
      {showEdit && (
        <EditModal
          type={editType}
          data={editData}
          setData={setEditData}
          onCancel={() => setShowEdit(false)}
          onConfirm={confirmEdit}
        />
      )}

      {/* SAVE MODAL */}
      {showSave && (
        <SaveConfirm
          onYes={save}
          onNo={() => setShowSave(false)}
        />
      )}
    </div>
  );
}