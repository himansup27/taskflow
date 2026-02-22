import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  status: z.enum(["todo", "in-progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  dueDate: z.string().optional(),
});

const TaskFormModal = ({ title, initialData, error, onSubmit, onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "todo",
      priority: initialData?.priority || "medium",
      dueDate: initialData?.due_date ? initialData.due_date.split("T")[0] : "",
    },
  });

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFormSubmit = (data) => {
    // Send null for empty dueDate so backend stores NULL
    const payload = { ...data, dueDate: data.dueDate || null };
    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input type="text" className={`form-input ${errors.title ? "error" : ""}`} placeholder="e.g. Design landing page" {...register("title")} autoFocus />
              {errors.title && <span className="form-error">⚠ {errors.title.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className={`form-textarea ${errors.description ? "error" : ""}`} placeholder="What needs to be done?" {...register("description")} />
              {errors.description && <span className="form-error">⚠ {errors.description.message}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" {...register("status")}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" {...register("priority")}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-input" {...register("dueDate")}
                style={{ colorScheme: "dark" }} />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <><span className="spinner" /> Saving...</> : initialData ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;