import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import projectsAPI from "../api/projects";
import useTasks from "../hooks/useTasks";
import TaskCard from "../components/common/TaskCard";
import TaskFormModal from "../components/common/TaskFormModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Badge from "../components/common/Badge";
import styles from "./ProjectDetailPage.module.css";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState(null);

  const { tasks, isLoading, error, filters, applyFilters, resetFilters, createTask, updateTask, deleteTask } = useTasks(id);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Load project details
  useEffect(() => {
    const load = async () => {
      try {
        setProjectLoading(true);
        const data = await projectsAPI.getById(id);
        setProject(data.data.project);
      } catch (err) {
        setProjectError(err.response?.data?.message || "Failed to load project");
      } finally {
        setProjectLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCreateTask = async (data) => {
    setFormError(null);
    const result = await createTask(data);
    if (result.success) setShowTaskForm(false);
    else setFormError(result.message);
  };

  const handleUpdateTask = async (data) => {
    setFormError(null);
    const result = await updateTask(editingTask.id, data);
    if (result.success) setEditingTask(null);
    else setFormError(result.message);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await deleteTask(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const hasFilters = filters.status || filters.priority || filters.search;

  if (projectLoading) {
    return (
      <div className="loading-screen">
        <span className="spinner spinner-lg" />
        <span>Loading project...</span>
      </div>
    );
  }

  if (projectError) {
    return (
      <div>
        <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠ {projectError}</div>
        <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/dashboard">Projects</Link>
        <span>/</span>
        <span>{project?.title}</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <h1 className="page-title">{project?.title}</h1>
            <Badge value={project?.status} />
          </div>
          {project?.description && <p className="page-subtitle">{project.description}</p>}
        </div>
        <button className="btn btn-primary" onClick={() => { setFormError(null); setShowTaskForm(true); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => applyFilters({ search: e.target.value })}
            style={{ maxWidth: 220 }}
          />
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => applyFilters({ status: e.target.value })}
            style={{ maxWidth: 160 }}
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          <select
            className="form-select"
            value={filters.priority}
            onChange={(e) => applyFilters({ priority: e.target.value })}
            style={{ maxWidth: 160 }}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Task count */}
      <div className={styles.taskCount}>
        {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        {hasFilters && " (filtered)"}
      </div>

      {/* States */}
      {isLoading && (
        <div className="loading-screen">
          <span className="spinner" />
          <span>Loading tasks...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="alert alert-error">⚠ {error}</div>
      )}

      {!isLoading && !error && tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">{hasFilters ? "🔍" : "✅"}</div>
          <h3>{hasFilters ? "No tasks match your filters" : "No tasks yet"}</h3>
          <p>{hasFilters ? "Try adjusting or clearing your filters" : "Add your first task to get started"}</p>
          {hasFilters
            ? <button className="btn btn-ghost" onClick={resetFilters}>Clear Filters</button>
            : <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>Add Task</button>
          }
        </div>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => { setFormError(null); setEditingTask(t); }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showTaskForm && (
        <TaskFormModal
          title="New Task"
          error={formError}
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}
      {editingTask && (
        <TaskFormModal
          title="Edit Task"
          initialData={editingTask}
          error={formError}
          onSubmit={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ProjectDetailPage;