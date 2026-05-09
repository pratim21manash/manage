import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Zap, ArrowRight, UserCog, User } from "lucide-react";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    role: "employee", // default to employee
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signup(formData);
    if (result.success) {
      // Show different message based on role
      if (formData.role === "admin") {
        alert("Admin account created! Please login.");
      } else {
        alert("Account created successfully! Please login.");
      }
      navigate("/login");
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-700 text-slate-800">TaskFlow</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-display font-700 text-slate-800 mb-1">Create account</h2>
          <p className="text-slate-500 text-sm mb-6">Choose your role and join TaskFlow</p>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect("employee")}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.role === "employee"
                  ? "border-brand-500 bg-brand-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                formData.role === "employee" ? "bg-brand-100" : "bg-slate-100"
              }`}>
                <User size={20} className={formData.role === "employee" ? "text-brand-600" : "text-slate-500"} />
              </div>
              <p className={`font-semibold text-sm ${
                formData.role === "employee" ? "text-brand-700" : "text-slate-700"
              }`}>
                Employee
              </p>
              <p className="text-xs text-slate-500 mt-1">Access assigned tasks</p>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("admin")}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.role === "admin"
                  ? "border-purple-500 bg-purple-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                formData.role === "admin" ? "bg-purple-100" : "bg-slate-100"
              }`}>
                <UserCog size={20} className={formData.role === "admin" ? "text-purple-600" : "text-slate-500"} />
              </div>
              <p className={`font-semibold text-sm ${
                formData.role === "admin" ? "text-purple-700" : "text-slate-700"
              }`}>
                Admin
              </p>
              <p className="text-xs text-slate-500 mt-1">Manage team & tasks</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="9876543210"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
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
              Create {formData.role === "admin" ? "Admin" : "Employee"} Account <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;