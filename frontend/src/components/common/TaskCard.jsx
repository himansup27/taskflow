import Badge from "./Badge";
import styles from "./TaskCard.module.css";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "done";

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className={`card ${styles.taskCard}`}>
      <div className={styles.taskMain}>
        <div className={styles.taskLeft}>
          {/* Status indicator dot */}
          <div className={`${styles.statusDot} ${styles[`dot_${task.status?.replace("-", "_")}`]}`} />
          <div className={styles.taskInfo}>
            <h4 className={`${styles.taskTitle} ${task.status === "done" ? styles.done : ""}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className={styles.taskDesc}>{task.description}</p>
            )}
            <div className={styles.taskMeta}>
              <Badge value={task.status} />
              <Badge value={task.priority} type="priority" />
              {dueDate && (
                <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ""}`}>
                  📅 {formatDate(dueDate)} {isOverdue && "· Overdue"}
                </span>
              )}
              {task.created_by_name && (
                <span className={styles.creator}>by {task.created_by_name}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.taskActions}>
          <button
            className="btn btn-ghost btn-sm btn-icon"
            title="Edit task"
            onClick={() => onEdit(task)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn btn-ghost btn-sm btn-icon"
            title="Delete task"
            onClick={() => onDelete(task)}
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

export default TaskCard;