import type React from "react";

export const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
};

export const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 600,
  color: "#505370",
  borderBottom: "1px solid #1e2035",
  position: "sticky",
  top: 0,
  background: "#161822",
};

export const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid #1a1c2e",
  color: "#c9cbe0",
  whiteSpace: "nowrap",
};

export const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #2a2d42",
  borderRadius: 6,
  color: "#64678a",
  cursor: "pointer",
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  transition: "border-color .15s",
};