import type React from "react";
import { iconBtnStyle } from "../styles/tableStyles";

interface WidgetProps {
  id: string;
  title: string;
  visible: boolean;
  expanded?: boolean;
  onDismiss: (id: string) => void;
  onExpand: (id: string) => void;
  children: React.ReactNode;
}

export default function Widget({
  id, title, visible, expanded, onDismiss, onExpand, children,
}: WidgetProps) {
  if (!visible) return null;

  const style: React.CSSProperties = expanded
    ? {
        position: "fixed", inset: 0, zIndex: 100, background: "#0f1117",
        padding: 32, overflow: "auto", animation: "fadeIn .2s",
      }
    : {
        background: "#161822", borderRadius: 10, border: "1px solid #1e2035",
        padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16,
      };

  return (
    <div style={style} onDoubleClick={(e) => { e.stopPropagation(); onExpand(id); }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#e2e4eb" }}>{title}</h3>
        <div style={{ display: "flex", gap: 8 }}>
          {expanded && (
            <button onClick={() => onExpand(id)} style={iconBtnStyle} title="Collapse">
              ←
            </button>
          )}
          <button onClick={() => onDismiss(id)} style={iconBtnStyle} title="Hide widget">
            ✕
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}