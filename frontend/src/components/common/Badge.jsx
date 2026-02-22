const LABELS = {
  // Status
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
  active: "Active",
  completed: "Completed",
  archived: "Archived",
  // Priority
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const Badge = ({ value, type = "status" }) => {
  if (!value) return null;
  const label = LABELS[value] || value;
  return (
    <span className={`badge badge-${value}`}>
      {type === "priority" && <PriorityDot value={value} />}
      {label}
    </span>
  );
};

const PriorityDot = ({ value }) => {
  const colors = {
    low: "#9090a0",
    medium: "#3b82f6",
    high: "#f59e0b",
    critical: "#ef4444",
  };
  return (
    <span
      style={{
        width: 6, height: 6,
        borderRadius: "50%",
        background: colors[value] || "#9090a0",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
};

export default Badge;