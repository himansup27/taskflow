import { useState, useEffect, useCallback } from "react";
import projectsAPI from "../api/projects";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsAPI.getAll();
      setProjects(data.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (formData) => {
    try {
      const data = await projectsAPI.create(formData);
      setProjects((prev) => [data.data.project, ...prev]);
      return { success: true, project: data.data.project };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to create project" };
    }
  };

  const updateProject = async (id, formData) => {
    try {
      const data = await projectsAPI.update(id, formData);
      setProjects((prev) => prev.map((p) => (p.id === id ? data.data.project : p)));
      return { success: true, project: data.data.project };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to update project" };
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectsAPI.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to delete project" };
    }
  };

  return { projects, isLoading, error, fetchProjects, createProject, updateProject, deleteProject };
};

export default useProjects;