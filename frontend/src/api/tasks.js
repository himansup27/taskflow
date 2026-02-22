import api from "./axiosInstance";

const tasksAPI = {
  // filters: { status, priority, search }
  getAll: async (projectId, filters = {}) => {
    const params = { projectId, ...filters };
    // Remove empty filter values
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    const res = await api.get("/tasks", { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/tasks", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};

export default tasksAPI;