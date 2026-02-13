"use client";

import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-10"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Smart Bookmark
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Organize and access your bookmarks securely
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-medium py-3 rounded-lg transition-all duration-200 shadow-sm"
        >
          {/* Official Google SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.82 2.64 30.27 0 24 0 14.61 0 6.46 5.4 2.56 13.3l8.05 6.25C12.33 13.46 17.68 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.14 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.44c-.54 2.9-2.19 5.36-4.68 7l7.23 5.62C43.97 37.4 46.14 31.47 46.14 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.61 28.05A14.5 14.5 0 019.5 24c0-1.41.25-2.78.7-4.05l-8.05-6.25A23.94 23.94 0 000 24c0 3.82.91 7.43 2.56 10.7l8.05-6.65z"
            />
            <path
              fill="#EA4335"
              d="M24 48c6.27 0 11.54-2.07 15.39-5.63l-7.23-5.62c-2 1.34-4.56 2.13-8.16 2.13-6.32 0-11.67-3.96-13.39-9.55l-8.05 6.65C6.46 42.6 14.61 48 24 48z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
