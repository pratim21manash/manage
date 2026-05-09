import React from "react";
import { TASK_STATUS_LABELS } from "../../utils/constants";

const StatusBadge = ({ status }) => {
  const classMap = {
    pending: "badge-pending",
    in_progress: "badge-in_progress",
    completed: "badge-completed",
  };

  const dotMap = {
    pending: "bg-amber-500",
    in_progress: "bg-brand-500",
    completed: "bg-emerald-500",
  };

  return (
    <span className={classMap[status] || "badge bg-slate-100 text-slate-600"}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${dotMap[status] || "bg-slate-400"}`} />
      {TASK_STATUS_LABELS[status] || status}
    </span>
  );
};

export default StatusBadge;
