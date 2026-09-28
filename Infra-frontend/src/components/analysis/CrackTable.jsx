import SeverityBadge from "./SeverityBadge";
const CrackTable = ({ cracks = [] }) => {
    if (cracks.length === 0) {
        return (
            <div className="crack-table-card">

                <div className="crack-table-header">
                    <h3>Detected Cracks</h3>
                </div>

                <div className="crack-table-empty">
                    No cracks detected.
                </div>

            </div>
        );
    }

    return (
        <div className="crack-table-card">

            <div className="crack-table-header">
                <h3>Detected Cracks</h3>

                <span>
                    {cracks.length} Detection
                    {cracks.length > 1 ? "s" : ""}
                </span>
            </div>

            <div className="crack-table-wrapper">

                <table className="crack-table">

                    <thead>
                        <tr>
                            <th>Crack ID</th>
                            <th>Type</th>
                            <th>Severity</th>
                            <th>Confidence</th>
                            <th className="num">Width</th>
                            <th className="num">Length</th>
                            <th className="num">Area</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {cracks.map((crack) => (
                            <tr key={crack._id}>

                                <td>{crack.crackId}</td>

                                <td>{crack.crackClass}</td>

                                <td>
                                    <SeverityBadge
                                        severity={
                                            crack.severity
                                        }
                                    />
                                </td>

                                <td>
                                    <div className="confidence-cell">
                                        <div className="confidence-track">
                                            <div
                                                className="confidence-fill"
                                                style={{ width: `${crack.confidence}%` }}
                                            />
                                        </div>
                                        <span>{crack.confidence}%</span>
                                    </div>
                                </td>

                                <td className="num">
                                    {crack.width} mm
                                </td>

                                <td className="num">
                                    {crack.length} mm
                                </td>

                                <td className="num">
                                    {crack.area} cm²
                                </td>

                                <td>
                                    <span className={`status-pill ${crack.validationStatus?.toLowerCase()}`}>
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