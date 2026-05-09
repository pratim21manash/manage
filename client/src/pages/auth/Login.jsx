import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate(result.role === "admin" ? "/admin" : "/employee");
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white"
              style={{
                width: `${(i + 1) * 160}px`,
                height: `${(i + 1) * 160}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <div className="relative text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-display font-700 text-white mb-4">TaskFlow</h1>
          <p className="text-brand-200 text-lg max-w-xs">
            Manage your team's work with clarity and speed.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              ["Role-based access", "Admin and employee portals"],
              ["Task tracking", "Pending, in-progress, done"],
              ["Team management", "Assign and track tasks"],
              ["Analytics", "Visual stats dashboard"],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white/10 rounded-xl p-4">
                <p className="text-white font-medium text-sm">{title}</p>
                <p className="text-brand-200 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-700 text-slate-800">TaskFlow</span>
          </div>

          <h2 className="text-2xl font-display font-700 text-slate-800 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-7">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2">
              Sign in <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              Admin accounts are created directly in the database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
