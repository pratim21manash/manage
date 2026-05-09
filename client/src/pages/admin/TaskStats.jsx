import React from "react";
import { useTasks } from "../../hooks/useTasks";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = {
  pending: "#f59e0b",
  in_progress: "#6270f8",
  completed: "#10b981",
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-3 py-2">
        <p className="text-sm font-medium text-slate-800">{payload[0].name}</p>
        <p className="text-sm text-slate-600">{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

const TaskStats = () => {
  const { stats, loading } = useTasks();

  if (loading) return <LoadingSpinner />;

  const pieData = [
    { name: "Pending", value: stats?.pending || 0 },
    { name: "In Progress", value: stats?.in_progress || 0 },
    { name: "Completed", value: stats?.completed || 0 },
  ].filter((d) => d.value > 0);

  const barData = [
    { name: "Pending", count: stats?.pending || 0, fill: COLORS.pending },
    { name: "In Progress", count: stats?.in_progress || 0, fill: COLORS.in_progress },
    { name: "Completed", count: stats?.completed || 0, fill: COLORS.completed },
  ];

  const total = stats?.total || 0;

  const summaryCards = [
    { label: "Total", value: total, color: "text-slate-700", bg: "bg-slate-50" },
    { label: "Pending", value: stats?.pending || 0, color: "text-amber-700", bg: "bg-amber-50" },
    { label: "In Progress", value: stats?.in_progress || 0, color: "text-brand-700", bg: "bg-brand-50" },
    { label: "Completed", value: stats?.completed || 0, color: "text-emerald-700", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-700 text-slate-800">Statistics</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of all task analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`stat-card ${c.bg}`}>
            <p className={`text-3xl font-display font-700 ${c.color}`}>{c.value}</p>
            <p className="text-sm text-slate-600 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500">No task data available yet. Create some tasks first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Task Distribution</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.name === "Pending" ? COLORS.pending : entry.name === "In Progress" ? COLORS.in_progress : COLORS.completed}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Status Overview</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {total > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Completion Rate</h2>
          <div className="space-y-3">
            {[
              { label: "Pending", value: stats?.pending || 0, color: "bg-amber-400" },
              { label: "In Progress", value: stats?.in_progress || 0, color: "bg-brand-500" },
              { label: "Completed", value: stats?.completed || 0, color: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-medium text-slate-700">
                    {item.value} ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${total > 0 ? (item.value / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStats;
