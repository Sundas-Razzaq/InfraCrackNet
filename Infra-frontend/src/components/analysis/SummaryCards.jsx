import {
    faBug,
    faChartLine,
    faRulerCombined,
    faDrawPolygon,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SummaryCards = ({ summary, cracks = [] }) => {
    // Real AI results are measured in pixels; manual / calibrated cracks in mm / cm2.
    const hasPx = cracks.some((c) => c.maxWidthPx != null);

    const maximumCrackWidth = hasPx
        ? Math.max(0, ...cracks.map((c) => c.maxWidthPx || 0))
        : Math.max(0, ...cracks.map((c) => c.width || 0));

    const totalAffectedArea = cracks.reduce(
        (total, crack) => total + ((hasPx ? crack.areaPx : crack.area) || 0),
        0
    );

    const cards = [
        {
            title: "Cracks Detected",
            value: summary?.totalCracks ?? 0,
            icon: faBug,
            className: "danger",
        },
        {
            title: "Average Confidence",
            value: `${summary?.averageConfidence ?? 0}%`,
            icon: faChartLine,
            className: "primary",
        },
        {
            title: "Maximum Crack Width",
            value: `${maximumCrackWidth.toFixed(2)} ${hasPx ? "px" : "mm"}`,
            icon: faRulerCombined,
            className: "warning",
        },
        {
            title: "Affected Area",
            value: hasPx
                ? `${Math.round(totalAffectedArea)} px²`
                : `${totalAffectedArea.toFixed(2)} cm²`,
            icon: faDrawPolygon,
            className: "success",
        },
    ];

    return (
        <div className="stat-panel">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className={`stat-card ${card.className}`}
                >
                    <div className="stat-icon">
                        <FontAwesomeIcon icon={card.icon} />
                    </div>

                    <div className="stat-content">
                        <p className="stat-label">
                            {card.title}
                        </p>

                        <h2 className="stat-value">
                            {card.value}
                        </h2>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;