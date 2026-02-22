import { useNavigate } from "react-router-dom";
import Badge from "./Badge";
import styles from "./ProjectCard.module.css";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const total = Number(project.total_tasks) || 0;
  const done = Number(project.done_tasks) || 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const handleCardClick = () => navigate(`/projects/${project.id}`);

  return (
    <div className={`card ${styles.projectCard}`}>
      <div className={styles.cardTop} onClick={handleCardClick}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{project.title}</h3>
          <Badge value={project.status} />
        </div>
        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
      </div>

      {/* Progress bar */}
      <div className={styles.progressSection} onClick={handleCardClick}>
        <div className={styles.progressLabel}>
          <span>{done}/{total} tasks done</span>
          <span>{progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          View Tasks
        </button>
        <div className={styles.actionRight}>
          <button
            className="btn btn-ghost btn-sm btn-icon"
            title="Edit project"
            onClick={(e) => { e.stopPropagation(); onEdit(project); }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn btn-ghost btn-sm btn-icon"
            title="Delete project"
            onClick={(e) => { e.stopPropagation(); onDelete(project); }}
            style={{ color: "var(--danger)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;