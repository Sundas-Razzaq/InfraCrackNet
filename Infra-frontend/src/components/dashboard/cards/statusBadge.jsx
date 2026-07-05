function StatusBadge({ text, variant = "primary" }) {
    return <span className={["status-badge", variant].filter(Boolean).join(" ")}>{text}</span>;
}

export default StatusBadge;
