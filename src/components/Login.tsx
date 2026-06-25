import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Sparkles, LogIn } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("admin@auraluxe.com");
  const [password, setPassword] = useState("luxurybeauty");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate luxury authentication delay
    setTimeout(() => {
      if (email === "admin@auraluxe.com" && password === "luxurybeauty") {
        setIsLoading(false);
        onLoginSuccess(email);
      } else {
        setIsLoading(false);
        setError("Invalid credentials. Please verify your signature login.");
      }
    }, 850);
  };

  const handleDemoBypass = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess("admin@auraluxe.com");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Decorative luxury abstract backdrops */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-50/40 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-stone-100 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
        id="login-card-container"
      >
        <div className="bg-white border border-[#EAE8E4] rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative z-10">
          {/* Brand Logo & Name */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1A1A1A] text-amber-200 mb-4 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#C5A880]" />
            </div>
            <h1 className="font-display text-3xl font-normal text-[#1A1A1A] tracking-wide">
              AURA LUXE
            </h1>
            <p className="text-[#C5A880] text-xs font-mono uppercase tracking-[0.25em] mt-1.5">
              Beauty Studio • Admin Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" id="login-form">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Authorized Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-colors"
                  id="login-email-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Secure Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-colors"
                  id="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none"
                  id="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white py-3 px-4 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 shadow-sm flex items-center justify-center gap-2 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed"
              id="submit-login-button"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-amber-200" />
                  <span>Enter Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bypass */}
          <div className="mt-8 pt-6 border-t border-[#EAE8E4] text-center">
            <p className="text-xs text-stone-400 mb-3">
              Testing the luxurious design or previewing?
            </p>
            <button
              onClick={handleDemoBypass}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#C5A880] text-xs font-semibold tracking-wider uppercase transition-colors"
              id="demo-login-bypass-button"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Demo Access</span>
            </button>
            <div className="mt-4 text-[11px] text-stone-400 font-mono space-y-0.5">
              <div>Default Email: admin@auraluxe.com</div>
              <div>Default Pass: luxurybeauty</div>
            </div>
          </div>
        </div>

        {/* Footer subtle brand tagline */}
        <p className="text-center text-stone-400 text-xs mt-8">
          © 2026 Aura Luxe Beauty Studio. Designed for Exquisite Management.
        </p>
      </motion.div>
    </div>
  );
}
