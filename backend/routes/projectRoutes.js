const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

// Validation rules
const projectValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Project title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be 3-100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["active", "completed", "archived"])
    .withMessage("Status must be active, completed, or archived"),
];

const updateProjectValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage("Title must be 3-100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["active", "completed", "archived"])
    .withMessage("Status must be active, completed, or archived"),
];

// All routes protected
router.use(protect);

router.route("/")
  .get(getProjects)
  .post(projectValidation, validate, createProject);

router.route("/:id")
  .get(getProjectById)
  .put(updateProjectValidation, validate, updateProject)
  .delete(deleteProject);

module.exports = router;