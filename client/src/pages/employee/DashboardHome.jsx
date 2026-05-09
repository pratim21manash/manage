import React from "react";
import { useTasks } from "../../hooks/useTasks";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import StatusBadge from "../../components/Common/StatusBadge";
import EmptyState from "../../components/Common/EmptyState";
import { formatDate } from "../../utils/helpers";
import { ClipboardList, Clock, PlayCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const EmployeeDashboardHome = () => {
  const { tasks, stats, loading } = useTasks();
  const { user } = useAuth();

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: "Total Assigned", value: stats?.total || 0, icon: ClipboardList, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Pending", value: stats?.pending || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "In Progress", value: stats?.in_progress || 0, icon: PlayCircle, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Completed", value: stats?.completed || 0, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-700 text-slate-800">
          Hello, {user?.fullname?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's a summary of your tasks today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className={`stat-card ${s.bg}`}>
            <div className="flex items-center gap-3 mb-2">
              <s.icon size={20} className={s.color} />
              <span className="text-2xl font-display font-700 text-slate-800">{s.value}</span>
            </div>
            <p className="text-sm text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Tasks</h2>
        </div>
        {tasks.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No tasks assigned yet" description="Your manager will assign tasks to you soon" />
        ) : (
          <div className="divide-y divide-slate-50">
            {tasks.slice(0, 5).map((task) => (
              <div key={task._id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-medium text-slate-800 text-sm">{task.title}</p>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                  </div>
                  <p className="text-xs text-slate-400 flex-shrink-0">{formatDate(task.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboardHome;
