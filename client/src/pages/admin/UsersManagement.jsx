import React, { useState, useEffect } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import ConfirmDialog from "../../components/Common/ConfirmDialog";
import EmptyState from "../../components/Common/EmptyState";
import { formatDate } from "../../utils/helpers";
import { USER_ROLE_LABELS } from "../../utils/constants";
import { Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/users/${deleteConfirm}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-700 text-slate-800">Users</h1>
        <p className="text-slate-500 text-sm mt-1">Manage all registered users</p>
      </div>

      <div className="card">
        {users.length === 0 ? (
          <EmptyState icon={Users} title="No users found" />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          user.role === "admin" ? "bg-purple-100" : "bg-sky-100"
                        }`}>
                          <span className={`text-xs font-medium ${
                            user.role === "admin" ? "text-purple-700" : "text-sky-700"
                          }`}>
                            {user.fullname?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800">{user.fullname}</span>
                      </div>
                    </td>
                    <td className="text-slate-500">{user.email}</td>
                    <td className="text-slate-500">{user.mobile}</td>
                    <td>
                      <span className={`badge ${user.role === "admin" ? "badge-admin" : "badge-employee"}`}>
                        {USER_ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="text-slate-500">{formatDate(user.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => setDeleteConfirm(user._id)}
                        className="btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600 px-2 py-1.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure? All tasks assigned to or created by this user will also be deleted."
      />
    </div>
  );
};

export default UsersManagement;
