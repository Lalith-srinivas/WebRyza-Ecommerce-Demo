import React from "react";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="login-modal" style={{ textAlign: "center", maxWidth: "350px", padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>{title}</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{message}</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button className="btn-outline" style={{ flex: 1, padding: "0.5rem" }} onClick={onCancel}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1, padding: "0.5rem", background: "var(--danger)" }} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
