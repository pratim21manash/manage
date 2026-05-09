import React from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center px-4 gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500"
      >
        <Menu size={20} />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-700 leading-none">{user?.fullname}</p>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
        </div>
        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-brand-700">
            {user?.fullname?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
