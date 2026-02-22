const Task = require("../models/Task");
const Project = require("../models/Project");
const { successResponse } = require("../utils/apiResponse");

// @desc    Get all tasks for a project (with optional filters)
// @route   GET /api/tasks?projectId=&status=&priority=&search=
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, search } = req.query;

    if (!projectId) {
      return res.status(400).json({ success: false, message: "projectId is required as a query parameter" });
    }

    // Verify project belongs to user
    const project = await Project.findByIdAndOwner(projectId, req.user.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const validStatuses = ["todo", "in-progress", "review", "done"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Valid values: ${validStatuses.join(", ")}` });
    }

    const validPriorities = ["low", "medium", "high", "critical"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ success: false, message: `Invalid priority. Valid values: ${validPriorities.join(", ")}` });
    }

    const tasks = await Task.findByProject(projectId, { status, priority, search });

    return successResponse(res, 200, "Tasks fetched successfully", {
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Verify user owns the project this task belongs to
    const project = await Project.findByIdAndOwner(task.project_id, req.user.id);
    if (!project) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return successResponse(res, 200, "Task fetched successfully", { task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, projectId } = req.body;

    // Verify project belongs to user
    const project = await Project.findByIdAndOwner(projectId, req.user.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      projectId,
      createdBy: req.user.id,
    });

    return successResponse(res, 201, "Task created successfully", { task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    // First check the task exists and get its project
    const projectId = await Task.getProjectId(req.params.id);
    if (!projectId) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Verify user owns the project
    const project = await Project.findByIdAndOwner(projectId, req.user.id);
    if (!project) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.update(req.params.id, { title, description, status, priority, dueDate });

    return successResponse(res, 200, "Task updated successfully", { task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const projectId = await Task.getProjectId(req.params.id);
    if (!projectId) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Verify user owns the project
    const project = await Project.findByIdAndOwner(projectId, req.user.id);
    if (!project) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await Task.delete(req.params.id);

    return successResponse(res, 200, "Task deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };