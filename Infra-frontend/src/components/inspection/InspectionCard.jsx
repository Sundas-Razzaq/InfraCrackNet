import { useNavigate } from "react-router-dom";

import InspectionStatusBadge from "./inspectionStatusBadge";

const InspectionCard = ({ inspection }) => {
    const navigate = useNavigate();

    return (
        <div className="inspection-card">
            <div className="inspection-card-header">
                <h3 className="inspection-code">
                    {inspection.inspectionCode}
                </h3>

                <InspectionStatusBadge
                    status={inspection.status}
                />
            </div>

            <div className="inspection-card-body">
                <h4 className="inspection-project-name">
                    {inspection.project?.name}
                </h4>

                <p className="inspection-project-code">
                    {inspection.project?.projectCode}
                </p>

                <p className="inspection-type">
                    {inspection.inspectionType}
                </p>

                <p className="inspection-priority">
                    <strong>Priority:</strong>{" "}
                    {inspection.priority}
                </p>

                {inspection.scheduledDate && (
                    <p className="inspection-date">
                        <strong>Scheduled:</strong>{" "}
                        {new Date(
                            inspection.scheduledDate
                        ).toLocaleDateString()}
                    </p>
                )}

                <p className="inspection-created">
                    <strong>Created:</strong>{" "}
                    {new Date(
                        inspection.createdAt
                    ).toLocaleDateString()}
                </p>
            </div>

            <div className="inspection-card-footer">
                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate(
                            `/dashboard/inspections/${inspection._id}`
                        )
                    }
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default InspectionCard;