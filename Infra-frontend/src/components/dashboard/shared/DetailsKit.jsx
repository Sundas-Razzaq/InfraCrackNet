import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Small presentational helpers shared by the project and
   inspection details pages. Styles live in styles/details.css */

const TONES = {
    // project status
    Active: "success",
    "On Hold": "warning",
    Completed: "info",
    // priority
    Low: "success",
    Medium: "warning",
    High: "danger",
    Critical: "critical",
    // inspection status
    Draft: "neutral",
    "Images Uploaded": "info",
    "Pending Analysis": "warning",
    "AI Processing": "warning",
    "AI Completed": "info",
    Validated: "success",
    "Report Generated": "success",
};

export const Chip = ({ children, tone }) => {
    if (!children) return null;

    return (
        <span className={`dtl-chip dtl-chip--${tone || TONES[children] || "neutral"}`}>
            <span className="dtl-chip-dot" aria-hidden="true" />
            {children}
        </span>
    );
};

export const Card = ({ title, children, className = "" }) => (
    <section className={`dtl-card ${className}`}>
        {title && <h2 className="dtl-card-title">{title}</h2>}
        {children}
    </section>
);

/* Label above value. `icon` is optional. */
export const Fact = ({ label, icon, children }) => (
    <div className="dtl-fact">
        <dt className="dtl-fact-label">{label}</dt>
        <dd className="dtl-fact-value">
            {icon && (
                <FontAwesomeIcon icon={icon} className="dtl-fact-icon" />
            )}
            <span>{children || "-"}</span>
        </dd>
    </div>
);

/* Label left, value right - used in the side rail. */
export const Row = ({ label, icon, children }) => (
    <div className="dtl-row">
        <dt>{label}</dt>
        <dd>
            {icon && <FontAwesomeIcon icon={icon} className="dtl-fact-icon" />}
            <span>{children || "-"}</span>
        </dd>
    </div>
);

export const Button = ({ variant = "secondary", icon, children, ...rest }) => (
    <button
        type="button"
        className={`dtl-btn dtl-btn--${variant}`}
        {...rest}
    >
        {icon && <FontAwesomeIcon icon={icon} className="dtl-btn-icon" />}
        {children}
    </button>
);
