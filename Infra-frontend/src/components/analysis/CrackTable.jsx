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
                            <th>Width</th>
                            <th>Length</th>
                            <th>Area</th>
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
                                    {crack.confidence}%
                                </td>

                                <td>
                                    {crack.width} mm
                                </td>

                                <td>
                                    {crack.length} mm
                                </td>

                                <td>
                                    {crack.area} cm²
                                </td>

                                <td>
                                    {
                                        crack.validationStatus
                                    }
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