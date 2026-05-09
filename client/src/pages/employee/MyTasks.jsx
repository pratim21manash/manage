import React, { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import StatusBadge from "../../components/Common/StatusBadge";
import Pagination from "../../components/Common/Pagination";
import EmptyState from "../../components/Common/EmptyState";
import { formatDate } from "../../utils/helpers";
import { TASK_STATUS, TASK_STATUS_LABELS } from "../../utils/constants";
import { CheckSquare } from "lucide-react";

const MyTasks = () => {
  const { tasks, loading, pagination, goToPage, updateTask } = useTasks();
  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdating(taskId);
    try {
      await updateTask(taskId, { status: newStatus });
    } catch {
      // handled in hook
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-700 text-slate-800">My Tasks</h1>
        <p className="text-slate-500 text-sm mt-1">View and update the status of your assigned tasks</p>
      </div>

      {tasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CheckSquare}
            title="No tasks assigned"
            description="Your manager hasn't assigned any tasks yet"
          />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task._id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="font-semibold text-slate-800">{task.title}</h3>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{task.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                      <span>Assigned by: <span className="text-slate-600">{task.createdBy?.fullname}</span></span>
                      <span>Created: <span className="text-slate-600">{formatDate(task.createdAt)}</span></span>
                      <span>Updated: <span className="text-slate-600">{formatDate(task.updatedAt)}</span></span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full md:w-44">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Update status</label>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      disabled={updating === task._id}
                      className="input-field text-sm"
                    >
                      <option value={TASK_STATUS.PENDING}>{TASK_STATUS_LABELS[TASK_STATUS.PENDING]}</option>
                      <option value={TASK_STATUS.IN_PROGRESS}>{TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS]}</option>
                      <option value={TASK_STATUS.COMPLETED}>{TASK_STATUS_LABELS[TASK_STATUS.COMPLETED]}</option>
                    </select>
                    {updating === task._id && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <span className="inline-block w-3 h-3 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
                        Updating...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <Pagination pagination={pagination} onPageChange={goToPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default MyTasks;
