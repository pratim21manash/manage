import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, CheckSquare, Users, BarChart3, LogOut, Zap } from "lucide-react";

const Sidebar = ({ onLogout, onClose }) => {
  const { user, isAdmin } = useAuth();

  const adminLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/tasks", icon: CheckSquare, label: "Tasks" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/stats", icon: BarChart3, label: "Statistics" },
  ];

  const employeeLinks = [
    { to: "/employee", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/employee/tasks", icon: CheckSquare, label: "My Tasks" },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <aside className="h-full w-64 bg-white border-r border-slate-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-700 text-slate-800">TaskFlow</span>
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-brand-700">
              {user?.fullname?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.fullname}</p>
            <span className={`text-xs font-medium ${isAdmin ? "text-purple-600" : "text-sky-600"}`}>
              {isAdmin ? "Administrator" : "Employee"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest px-3 mb-2">
          Navigation
        </p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : "sidebar-link-inactive"}`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="sidebar-link sidebar-link-inactive w-full hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
