const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay confirm-dialog" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">⚠️ {title}</h2>
        </div>
        <div className="modal-body">
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{message}</p>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onCancel} disabled={isLoading}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;