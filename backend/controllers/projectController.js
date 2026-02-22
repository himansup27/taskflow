const Project = require("../models/Project");
const { successResponse } = require("../utils/apiResponse");

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAllByOwner(req.user.id);

    return successResponse(res, 200, "Projects fetched successfully", {
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndOwner(req.params.id, req.user.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return successResponse(res, 200, "Project fetched successfully", { project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const project = await Project.create({
      title,
      description,
      status,
      ownerId: req.user.id,
    });

    return successResponse(res, 201, "Project created successfully", { project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const project = await Project.update(req.params.id, req.user.id, { title, description, status });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return successResponse(res, 200, "Project updated successfully", { project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project (tasks cascade via DB foreign key)
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const deleted = await Project.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return successResponse(res, 200, "Project and all its tasks deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };