"use client";

import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/20 text-center w-[350px]"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Smart Bookmark</h1>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full bg-white text-black font-medium py-3 rounded-xl hover:scale-105 transition-all duration-200"
        >
          <Chrome size={20} />
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
}
