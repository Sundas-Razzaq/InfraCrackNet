import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faLocationDot,
    faUserTie,
    faClipboardCheck,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";

import InspectionStatusBadge from "./inspectionStatusBadge";
import { useRole } from "../../utils/useRole";

const InspectionDetails = ({
    inspection,
    onEdit,
    onDelete,
    onUploadImages,
    onRunAnalysis,
    analysisLoading,
}) => {
    const { isEngineer, isInspector } = useRole();

    if (!inspection) {
        return (
            <div className="inspection-details-empty">
                Inspection not found.
            </div>
        );
    }

    const canRunAnalysis =
        isEngineer && inspection.status === "Pending Analysis";

    return (
        <div className="inspection-details">
            <div className="inspection-details-header">
                <div className="inspection-details-title">
                    <h1 className="inspection-code">
                        {inspection.inspectionCode}
                    </h1>
                    <p className="inspection-project">
                        {inspection.project?.name}
                    </p>
                </div>

                <div className="inspection-actions">
                    {isInspector && (
                        <>
                            <button
                                className="btn btn-secondary"
                                onClick={onUploadImages}
                            >
                                Upload Images
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={onEdit}
                            >
                                Edit Inspection
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={onDelete}
                            >
                                Delete Inspection
                            </button>
                        </>
                    )}

                    {canRunAnalysis && (
                        <button
                            className="btn btn-primary"
                            onClick={onRunAnalysis}
                            disabled={analysisLoading}
                        >
                            <FontAwesomeIcon
                                icon={faPlay}
                                className="inspection-btn-icon"
                            />
                            {analysisLoading
                                ? "Starting AI Analysis..."
                                : "Run AI Analysis"}
                        </button>
                    )}
                </div>
            </div>

            <div className="inspection-details-card">
                <div className="inspection-details-grid">
                    <div className="inspection-detail">
                        <label>Project</label>
                        <p>{inspection.project?.name}</p>
                    </div>

                    <div className="inspection-detail">
                        <label>Project Code</label>
                        <p>{inspection.project?.projectCode}</p>
                    </div>

                    <div className="inspection-detail">
                        <label>Status</label>
                        <InspectionStatusBadge status={inspection.status} />
                    </div>

                    <div className="inspection-detail">
                        <label>Inspection Type</label>
                        <p>{inspection.inspectionType}</p>
                    </div>

                    <div className="inspection-detail">
                        <label>Structure Area</label>
                        <p className="inspection-meta">
                            <FontAwesomeIcon
                                icon={faClipboardCheck}
                                className="detail-icon"
                            />
                            {inspection.structureArea}
                        </p>
                    </div>

                    <div className="inspection-detail">
                        <label>GPS Location</label>
                        <p className="inspection-meta">
                            <FontAwesomeIcon
                                icon={faLocationDot}
                                className="detail-icon"
                            />
                            {inspection.gpsLocation}
                        </p>
                    </div>

                    <div className="inspection-detail">
                        <label>Weather</label>
                        <p>{inspection.weather}</p>
                    </div>

                    <div className="inspection-detail">
                        <label>Priority</label>
                        <p>{inspection.priority}</p>
                    </div>

                    <div className="inspection-detail">
                        <label>Scheduled Date</label>
                        <p className="inspection-meta">
                            <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="detail-icon"
                            />
                            {inspection.scheduledDate
                                ? new Date(
                                    inspection.scheduledDate
                                ).toLocaleDateString()
                                : "-"}
                        </p>
                    </div>

                    <div className="inspection-detail">
                        <label>Inspection Date</label>
                        <p className="inspection-meta">
                            <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="detail-icon"
                            />
                            {inspection.inspectionDate
                                ? new Date(
                                    inspection.inspectionDate
                                ).toLocaleDateString()
                                : "-"}
                        </p>
                    </div>

                    <div className="inspection-detail">
                        <label>Field Notes</label>
                        <p>{inspection.fieldNotes || "No notes added."}</p>
                    </div>

                    <div className="inspection-detail">
                        <label>Created By</label>
                        <p className="inspection-meta">
                            <FontAwesomeIcon
                                icon={faUserTie}
                                className="detail-icon"
                            />
                            {inspection.createdBy?.name}
                        </p>
                    </div>

                    <div className="inspection-detail">
                        <label>Created On</label>
                        <p className="inspection-meta">
                            <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="detail-icon"
                            />
                            {new Date(
                                inspection.createdAt
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectionDetails;