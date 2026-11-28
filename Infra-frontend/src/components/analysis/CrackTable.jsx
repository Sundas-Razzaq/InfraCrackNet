import SeverityBadge from "./SeverityBadge";
import { crackLabel, severityColor } from "../../utils/crackGeometery";

// px value from the ML service, or the calibrated mm value (manual cracks).
const measure = (px, mm, unit = "mm", digits = 1) => {
    if (px !== null && px !== undefined) return `${Number(px).toFixed(digits)} px`;
    if (mm !== null && mm !== undefined) return `${mm} ${unit}`;
    return "—";
};

const CrackTable = ({
    cracks = [],
    title = "Detected Cracks",
    activeCrackId = null,
    onSelectCrack,
}) => {
    if (cracks.length === 0) {
        return (
            <div className="crack-table-card">
                <div className="crack-table-header">
                    <h3>{title}</h3>
                </div>
                <div className="crack-table-empty">No cracks detected.</div>
            </div>
        );
    }

    return (
        <div className="crack-table-card">
            <div className="crack-table-header">
                <h3>{title}</h3>
                <span>
                    {cracks.length} Detection{cracks.length > 1 ? "s" : ""}
                </span>
            </div>

            <div className="crack-table-wrapper">
                <table className="crack-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Crack Type</th>
                            <th className="num">Length</th>
                            <th className="num">Max Width</th>
                            <th className="num">Mean Width</th>
                            <th className="num">Area</th>
                            <th>Confidence</th>
                            <th>Severity</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cracks.map((crack, i) => (
                            <tr
                                key={crack._id}
                                className={activeCrackId === crack._id ? "row-active" : ""}
                                onClick={() => onSelectCrack?.(crack._id)}
                            >
                                <td>
                                    <span
                                        className="crack-dot"
                                        style={{ background: severityColor(crack.severity) }}
                                    />
                                    <strong>{crackLabel(crack, i)}</strong>
                                </td>

                                <td>{crack.crackClass}</td>

                                <td className="num">{measure(crack.lengthPx, crack.length)}</td>
                                <td className="num">{measure(crack.maxWidthPx, crack.width)}</td>
                                <td className="num">{measure(crack.meanWidthPx, null)}</td>
                                <td className="num">
                                    {crack.areaPx != null
                                        ? `${crack.areaPx} px²`
                                        : crack.area != null
                                            ? `${crack.area} cm²`
                                            : "—"}
                                </td>

                                <td>
                                    <div className="confidence-cell">
                                        <div className="confidence-track">
                                            <div
                                                className="confidence-fill"
                                                style={{ width: `${crack.confidence}%` }}
                                            />
                                        </div>
                                        <span>{Number(crack.confidence).toFixed(1)}%</span>
                                    </div>
                                </td>

                                <td>
                                    <SeverityBadge severity={crack.severity} />
                                </td>

                                <td>
                                    <span
                                        className={`status-pill ${crack.validationStatus?.toLowerCase()}`}
                                    >
                                        {crack.validationStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CrackTable;
