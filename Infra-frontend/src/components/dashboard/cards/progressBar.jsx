function ProgressBar({ value, label, variant = "primary" }) {
    return (
        <div className="progress-item">
            <div className="progress-header">
                <span className="progress-label">{label}</span>
                <span className="progress-value">{value}%</span>
            </div>

            <div className="progress-track" aria-hidden="true">
                <div
                    className={["progress-fill", variant].filter(Boolean).join(" ")}
                    style={{ width: `${value}%` }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={value}
                />
            </div>
        </div>
    );
}

export default ProgressBar;
