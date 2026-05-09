import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const useTasks = (initialFilters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.assignedTo) params.append("assignedTo", filters.assignedTo);
      params.append("page", pagination.page);
      params.append("limit", pagination.limit);

      const url = `/tasks?${params.toString()}`;
      const response = await api.get(url);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/tasks/stats");
      setStats(response.data);
    } catch {
      // silent
    }
  }, []);

  const createTask = async (taskData) => {
    const response = await api.post("/tasks", taskData);
    toast.success("Task created!");
    await Promise.all([fetchTasks(), fetchStats()]);
    return response.data;
  };

  const updateTask = async (taskId, updateData) => {
    const response = await api.put(`/tasks/${taskId}`, updateData);
    toast.success("Task updated!");
    await Promise.all([fetchTasks(), fetchStats()]);
    return response.data;
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    toast.success("Task deleted!");
    await Promise.all([fetchTasks(), fetchStats()]);
  };

  const goToPage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  return {
    tasks,
    loading,
    stats,
    filters,
    pagination,
    setFilters,
    goToPage,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
