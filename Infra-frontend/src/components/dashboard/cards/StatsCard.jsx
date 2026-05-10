import { createElement } from "react";
import "./statsCard.css";

function StatsCard({ title, value, change, icon: Icon, tone = "blue", description }) {
    return (
        <article className={["stats-card", `stats-card--${tone}`].join(" ")}>
            <div className="stats-card__head">
                <span className="stats-card__eyebrow">{title}</span>
                <span className="stats-card__icon">
                    {createElement(Icon, { size: 18 })}
                </span>
            </div>

            <div className="stats-card__body">
                <strong>{value}</strong>
                <span className={["stats-card__change", change?.startsWith("+") ? "is-positive" : "is-negative"].join(" ")}>
                    {change}
                </span>
            </div>

            {description ? <p className="stats-card__description">{description}</p> : null}
        </article>
    );
}

export default StatsCard;