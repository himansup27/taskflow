const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

// Validation rules
const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Task title is required")
    .isLength({ min: 3, max: 150 }).withMessage("Title must be 3-150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "review", "done"])
    .withMessage("Status must be todo, in-progress, review, or done"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Priority must be low, medium, high, or critical"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("Due date must be a valid ISO 8601 date"),

  // Fixed: use isUUID() instead of isMongoId()
  body("projectId")
    .notEmpty().withMessage("projectId is required")
    .isUUID().withMessage("projectId must be a valid UUID"),
];

const updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 }).withMessage("Title must be 3-150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "review", "done"])
    .withMessage("Status must be todo, in-progress, review, or done"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Priority must be low, medium, high, or critical"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("Due date must be a valid ISO 8601 date"),
];

// All routes protected
router.use(protect);

router.route("/")
  .get(getTasks)
  .post(createTaskValidation, validate, createTask);

router.route("/:id")
  .get(getTaskById)
  .put(updateTaskValidation, validate, updateTask)
  .delete(deleteTask);

module.exports = router;