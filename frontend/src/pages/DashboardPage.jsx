import { useState } from "react";
import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/common/ProjectCard";
import ProjectFormModal from "../components/common/ProjectFormModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const { projects, isLoading, error, fetchProjects, createProject, updateProject, deleteProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleCreate = async (data) => {
    setFormError(null);
    const result = await createProject(data);
    if (result.success) { setShowForm(false); }
    else setFormError(result.message);
  };

  const handleUpdate = async (data) => {
    setFormError(null);
    const result = await updateProject(editingProject.id, data);
    if (result.success) { setEditingProject(null); }
    else setFormError(result.message);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await deleteProject(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const openEdit = (project) => { setFormError(null); setEditingProject(project); };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setFormError(null); setShowForm(true); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </button>
      </div>

      {/* States */}
      {isLoading && (
        <div className={styles.grid}>
          {[1,2,3].map(i => <div key={i} className={styles.skeletonCard}><div className="skeleton" style={{height:20,width:"60%",marginBottom:12}} /><div className="skeleton" style={{height:14,width:"90%",marginBottom:8}} /><div className="skeleton" style={{height:14,width:"40%"}} /></div>)}
        </div>
      )}

      {error && !isLoading && (
        <div className="alert alert-error">
          <span>⚠</span> {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchProjects} style={{marginLeft:"auto"}}>Retry</button>
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <h3>No projects yet</h3>
          <p>Create your first project to start organizing tasks</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Create Project</button>
        </div>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <ProjectFormModal
          title="New Project"
          error={formError}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingProject && (
        <ProjectFormModal
          title="Edit Project"
          initialData={editingProject}
          error={formError}
          onSubmit={handleUpdate}
          onClose={() => setEditingProject(null)}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All tasks inside will also be deleted. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default DashboardPage;