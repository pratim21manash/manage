import React from "react";
import { useTasks } from "../../hooks/useTasks";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import StatusBadge from "../../components/Common/StatusBadge";
import EmptyState from "../../components/Common/EmptyState";
import { formatDate } from "../../utils/helpers";
import { ClipboardList, Clock, PlayCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const StatCard = ({ label, value, icon: Icon, color, bgColor }) => (
  <div className="stat-card flex items-center gap-4">
    <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon size={22} className={color} />
    </div>
    <div>
      <p className="text-2xl font-display font-700 text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  </div>
);

const AdminDashboardHome = () => {
  const { tasks, stats, loading } = useTasks();
  const { user } = useAuth();

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: "Total Tasks", value: stats?.total || 0, icon: ClipboardList, color: "text-brand-600", bgColor: "bg-brand-50" },
    { label: "Pending", value: stats?.pending || 0, icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50" },
    { label: "In Progress", value: stats?.in_progress || 0, icon: PlayCircle, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Completed", value: stats?.completed || 0, icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-700 text-slate-800">
          Good day, {user?.fullname?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your team today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Tasks</h2>
        </div>
        {tasks.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No tasks yet" description="Create a task to get started" />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task) => (
                  <tr key={task._id}>
                    <td className="font-medium text-slate-800">{task.title}</td>
                    <td>{task.assignedTo?.fullname || "—"}</td>
                    <td><StatusBadge status={task.status} /></td>
                    <td className="text-slate-500">{formatDate(task.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardHome;
