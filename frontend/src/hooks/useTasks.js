import { useState, useEffect, useCallback } from "react";
import tasksAPI from "../api/tasks";

const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });

  const fetchTasks = useCallback(async (activeFilters = filters) => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksAPI.getAll(projectId, activeFilters);
      setTasks(data.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => { fetchTasks(); }, [projectId]);

  const applyFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    fetchTasks(updated);
  };

  const resetFilters = () => {
    const empty = { status: "", priority: "", search: "" };
    setFilters(empty);
    fetchTasks(empty);
  };

  const createTask = async (formData) => {
    try {
      const data = await tasksAPI.create({ ...formData, projectId });
      setTasks((prev) => [data.data.task, ...prev]);
      return { success: true, task: data.data.task };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to create task" };
    }
  };

  const updateTask = async (id, formData) => {
    try {
      const data = await tasksAPI.update(id, formData);
      setTasks((prev) => prev.map((t) => (t.id === id ? data.data.task : t)));
      return { success: true, task: data.data.task };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to update task" };
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to delete task" };
    }
  };

  return {
    tasks, isLoading, error, filters,
    fetchTasks, applyFilters, resetFilters,
    createTask, updateTask, deleteTask,
  };
};

export default useTasks;