import React, { useState } from "react";
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "../../firebase/auth";
import BDLogo from "../../components/BDLogo";

interface LoginProps {
  onLoginSuccess: (isFallback: boolean) => void;
  loginFn: (email: string, password: string) => Promise<any>;
}

export default function Login({ onLoginSuccess, loginFn }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginFn(email, password);
      const isFallback = result && result.isLocalFallback;
      onLoginSuccess(!!isFallback);
    } catch (err: any) {
      console.error("Login failure:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email address or password combination.");
      } else if (err.code === "auth/configuration-not-found") {
        setError(
          "Firebase Auth is currently not enabled in your custom Firebase project console. Please enable the Email/Password sign-in provider in Firebase Console under Authentication > Sign-in Method."
        );
      } else {
        setError(err.message || "An unexpected sign-in error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDefaults = () => {
    setEmail(DEFAULT_ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
  };

  return (
    <div className="min-h-screen bg-[#001D11] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Absolute backgrounds decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-mint/5 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl p-8 shadow-[0_24px_70px_rgba(0,0,0,0.4)] border border-primary-mint/10 flex flex-col items-center">
          
          {/* Logo element with styling */}
          <div className="w-16 h-16 rounded-3xl bg-primary-mint/10 border border-primary-mint/20 flex items-center justify-center text-primary-mint mb-5 shadow-inner">
            <BDLogo className="w-9 h-9" />
          </div>

          <h1 className="font-cormorant text-2xl font-bold text-gray-900 tracking-wide text-center">
            DR. SKY DENTISTRY
          </h1>
          <p className="font-sans text-[10px] text-primary-mint uppercase tracking-[0.2em] font-bold mt-1.5 text-center">
            Atelier Administrative Console
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-8 space-y-5 font-sans">
            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-rose-500 text-base leading-none mt-0.5">error</span>
                <span className="text-[11.5px] font-semibold text-rose-700 leading-tight">{error}</span>
              </div>
            )}

            {/* Email input field */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                Authorized Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-md leading-none">
                  mail
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@drskydentistry.com"
                  className="w-full pl-10 pr-4 py-3 placeholder-gray-300 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/60 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password input field */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex justify-between">
                <span>Secret Passcode</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-md leading-none">
                  lock
                </span>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full pl-10 pr-12 py-3 placeholder-gray-300 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/60 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-md leading-none">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3eb489] hover:bg-[#20946b] py-3.5 rounded-xl font-sans text-[11px] uppercase tracking-widest font-bold text-white shadow-lg shadow-primary-mint/15 hover:shadow-primary-mint/25 hover:translate-y-[-1px] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Unlocking session...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm leading-none font-bold">lock_open</span>
                  <span>Confirm Access</span>
                </>
              )}
            </button>

            {/* Simple Help Info */}
            <div className="pt-2 border-t border-gray-100 flex flex-col items-center gap-1.5">
              <span className="text-[9.5px] text-gray-400 hover:text-gray-600 transition cursor-pointer font-medium text-center">
                Need to seed developer credentials?
              </span>
              <button 
                type="button"
                onClick={handleFillDefaults}
                className="text-[9.5px] font-bold text-primary-mint hover:underline uppercase tracking-wide cursor-pointer"
              >
                Autofill default login
              </button>
            </div>
          </form>

        </div>
        
        {/* Footnote information */}
        <p className="text-center font-sans text-[10px] text-gray-500 mt-6 tracking-wide">
          Protected Workspace. Unauthorized activities are logged.
        </p>
      </div>
    </div>
  );
}
