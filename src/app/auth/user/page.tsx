"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Eye, EyeOff, Menu } from "lucide-react";

export default function UserLogin() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      /* ================= LOGIN ================= */
      if (isLogin) {
        if (
          !formData.email ||
          !formData.password
        ) {
          setError(
            "Email and password are required."
          );

          setLoading(false);
          return;
        }

        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

        if (error) {
          setError(error.message);

          setLoading(false);
          return;
        }

        if (data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              username:
                data.user.user_metadata
                  ?.username || "",
              fullName:
                data.user.user_metadata
                  ?.full_name || "",
            })
          );

          router.push("/user/dashboard");
        }
      }

      /* ================= REGISTER ================= */
      else {
        if (
          !formData.fullName ||
          !formData.username ||
          !formData.email ||
          !formData.password
        ) {
          setError("All fields are required.");

          setLoading(false);
          return;
        }

        const { data, error } =
          await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                full_name: formData.fullName,
                username: formData.username,
                role: "user",
              },
            },
          });

        if (error) {
          setError(error.message);

          setLoading(false);
          return;
        }

        if (data.user) {
          alert(
            "Registration successful. Please check your email to confirm."
          );

          setFormData({
            username: "",
            email: "",
            password: "",
            fullName: "",
          });

          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(
        err?.message ||
          "An error occurred. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl overflow-hidden">
        
        {/* ================= TOP HEADER ================= */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          
          <button className="text-gray-700">
            <Menu size={28} />
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-serif text-gray-800">
              Inn Sync
            </h1>

            <p className="text-[10px] tracking-widest text-gray-500">
              SMART HOTEL AUTOMATION
            </p>
          </div>

          <div className="w-7"></div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid md:grid-cols-2 min-h-[700px]">
          
          {/* ================= LEFT SIDE ================= */}
          <div className="flex flex-col justify-center px-8 md:px-14 py-10">
            
            {/* BRAND */}
            <div className="mb-8">
              <h1 className="text-5xl font-serif text-gray-700">
                Inn Sync
              </h1>

              <p className="text-xs text-gray-500 mt-1">
                Smart Hotel Booth Automation
              </p>
            </div>

            {/* TITLE */}
            <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {isLogin
                ? "Welcome Back!"
                : "Create Your Account"}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-500 leading-relaxed mb-8 text-sm">
              {isLogin
                ? "Sign in to manage your bookings, check in digitally, request services, and access personalized recommendations."
                : "Create an account to enjoy seamless booking and hotel management services."}
            </p>

            {/* ================= FORM ================= */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              
              {/* REGISTER ONLY */}
              {!isLogin && (
                <>
                  <input
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 text-black placeholder-gray-400 outline-none focus:border-black transition"
                  />

                  <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 text-black placeholder-gray-400 outline-none focus:border-black transition"
                  />
                </>
              )}

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 text-black placeholder-gray-400 outline-none focus:border-black transition"
              />

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 pr-12 text-black placeholder-gray-400 outline-none focus:border-black transition"
                />

                {/* EYE BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-3.5 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* EXTRA OPTIONS */}
              {isLogin && (
                <div className="flex items-center justify-between text-sm text-gray-500">
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="hover:text-black transition"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-700 text-white py-3 hover:bg-black transition duration-300 tracking-wide"
              >
                {loading
                  ? "Loading..."
                  : isLogin
                  ? "LOGIN"
                  : "REGISTER"}
              </button>
            </form>

            {/* TOGGLE */}
            <div className="mt-6 text-center">
              <button
                onClick={() =>
                  setIsLogin(!isLogin)
                }
                className="text-blue-600 hover:underline text-sm"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>

          {/* ================= RIGHT SIDE IMAGE ================= */}
          <div className="relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop"
              alt="Hotel"
              className="w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}