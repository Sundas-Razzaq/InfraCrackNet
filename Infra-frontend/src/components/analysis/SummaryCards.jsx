import {
    faBug,
    faChartLine,
    faRulerCombined,
    faDrawPolygon,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SummaryCards = ({ summary, cracks = [] }) => {
    const maximumCrackWidth =
        cracks.length > 0
            ? Math.max(...cracks.map((c) => c.width || 0))
            : 0;

    const totalAffectedArea = cracks.reduce(
        (total, crack) => total + (crack.area || 0),
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
            value: `${maximumCrackWidth.toFixed(2)} mm`,
            icon: faRulerCombined,
            className: "warning",
        },
        {
            title: "Affected Area",
            value: `${totalAffectedArea.toFixed(2)} cm²`,
            icon: faDrawPolygon,
            className: "success",
        },
    ];

    return (
        <div className="summary-cards">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className={`summary-card ${card.className}`}
                >
                    <div className="summary-card-icon">
                        <FontAwesomeIcon icon={card.icon} />
                    </div>

                    <div className="summary-card-content">
                        <p className="summary-card-label">
                            {card.title}
                        </p>

                        <h2 className="summary-card-value">
                            {card.value}
                        </h2>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;