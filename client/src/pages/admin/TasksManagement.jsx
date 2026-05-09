import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useTasks } from "../../hooks/useTasks";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import StatusBadge from "../../components/Common/StatusBadge";
import ConfirmDialog from "../../components/Common/ConfirmDialog";
import Pagination from "../../components/Common/Pagination";
import EmptyState from "../../components/Common/EmptyState";
import { formatDate, truncateText } from "../../utils/helpers";
import { Plus, Pencil, Trash2, X, SlidersHorizontal, CheckSquare } from "lucide-react";
import toast from "react-hot-toast";

const TaskModal = ({ task, employees, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignedTo: task?.assignedTo?._id || "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{task ? "Edit Task" : "Create New Task"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="What needs to be done?"
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign to *</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullname} — {emp.email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FilterModal = ({ employees, filters, onApply, onClose }) => {
  const [local, setLocal] = useState({ status: filters.status || "", assignedTo: filters.assignedTo || "" });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-800">Filter Tasks</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select value={local.status} onChange={(e) => setLocal({ ...local, status: e.target.value })} className="input-field">
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned to</label>
            <select value={local.assignedTo} onChange={(e) => setLocal({ ...local, assignedTo: e.target.value })} className="input-field">
              <option value="">All employees</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>{e.fullname}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => { onApply({}); onClose(); }} className="btn-secondary">Clear</button>
            <button onClick={() => { onApply(local); onClose(); }} className="btn-primary">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TasksManagement = () => {
  const { tasks, loading, pagination, goToPage, createTask, updateTask, deleteTask, filters, setFilters } = useTasks();
  const [employees, setEmployees] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/users/employees")
      .then((r) => setEmployees(r.data))
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  const handleOpenCreate = () => { setEditingTask(null); setShowTaskModal(true); };
  const handleOpenEdit = (task) => { setEditingTask(task); setShowTaskModal(true); };
  const handleCloseModal = () => { setShowTaskModal(false); setEditingTask(null); };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingTask) await updateTask(editingTask._id, formData);
      else await createTask(formData);
      handleCloseModal();
    } catch {
      // handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteTask(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const hasFilters = filters.status || filters.assignedTo;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-700 text-slate-800">Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage tasks for your team</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilterModal(true)}
            className={`btn-secondary ${hasFilters ? "border-brand-300 text-brand-600" : ""}`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && <span className="w-1.5 h-1.5 bg-brand-600 rounded-full" />}
          </button>
          <button onClick={handleOpenCreate} className="btn-primary">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <div className="card">
        {tasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No tasks found"
            description={hasFilters ? "Try changing your filters" : "Create your first task"}
            action={<button onClick={handleOpenCreate} className="btn-primary">Create task</button>}
          />
        ) : (
          <>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td className="font-medium text-slate-800 max-w-[180px]">
                        <span className="line-clamp-2">{task.title}</span>
                      </td>
                      <td className="max-w-[200px] text-slate-500">
                        {truncateText(task.description, 60)}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-medium text-brand-700">
                              {task.assignedTo?.fullname?.[0] || "?"}
                            </span>
                          </div>
                          <span className="text-sm">{task.assignedTo?.fullname || "—"}</span>
                        </div>
                      </td>
                      <td><StatusBadge status={task.status} /></td>
                      <td className="text-slate-500">{formatDate(task.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleOpenEdit(task)} className="btn-ghost text-slate-500 px-2 py-1.5">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirm(task._id)} className="btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600 px-2 py-1.5">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={goToPage} />
          </>
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          employees={employees}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}

      {showFilterModal && (
        <FilterModal
          employees={employees}
          filters={filters}
          onApply={setFilters}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default TasksManagement;
