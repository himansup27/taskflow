import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  status: z.enum(["active", "completed", "archived"]),
});

const ProjectFormModal = ({ title, initialData, error, onSubmit, onClose, isLoading }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "active",
    },
  });

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input type="text" className={`form-input ${errors.title ? "error" : ""}`} placeholder="e.g. Mobile App Redesign" {...register("title")} autoFocus />
              {errors.title && <span className="form-error">⚠ {errors.title.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className={`form-textarea ${errors.description ? "error" : ""}`} placeholder="What is this project about?" {...register("description")} />
              {errors.description && <span className="form-error">⚠ {errors.description.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className={`form-select ${errors.status ? "error" : ""}`} {...register("status")}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? <><span className="spinner" /> Saving...</> : initialData ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;