import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faLocationDot,
    faUserTie,
    faClipboardCheck,
    faPlay,
    faFileLines,
    faImages,
    faPen,
    faTrashCan,
    faCloudSun,
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import { useRole } from "../../utils/useRole";
import { Button, Card, Chip, Fact, Row } from "../dashboard/shared/DetailsKit";


const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString() : "-";

const InspectionDetails = ({
    inspection,
    onEdit,
    onDelete,
    onUploadImages,
    onRunAnalysis,
    analysisLoading,
    onGenerateReport,
    reportLoading = false,
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

    const canGenerateReport =
        isInspector && inspection.status === "Validated";

    return (
        <div className="dtl">
            <Link to="/dashboard/inspection" className="dtl-back">
                <FontAwesomeIcon icon={faChevronLeft} />
                All inspections
            </Link>

            <header className="dtl-header">
                <div className="dtl-heading">
                    <h1 className="dtl-title">
                        {inspection.inspectionCode}
                    </h1>

                    <div className="dtl-heading-meta">
                        <span className="dtl-subtitle">
                            {inspection.project?.name}
                        </span>
                        <Chip>{inspection.status}</Chip>
                    </div>
                </div>

                <div className="dtl-toolbar">
                    {canRunAnalysis && (
                        <Button
                            variant="primary"
                            icon={faPlay}
                            onClick={onRunAnalysis}
                            disabled={analysisLoading}
                        >
                            {analysisLoading
                                ? "Starting AI Analysis..."
                                : "Run AI Analysis"}
                        </Button>
                    )}

                    {canGenerateReport && (
                        <Button
                            variant="primary"
                            icon={faFileLines}
                            onClick={onGenerateReport}
                            disabled={reportLoading}
                        >
                            {reportLoading
                                ? "Generating..."
                                : "Generate Report"}
                        </Button>
                    )}

                    {isInspector && (
                        <>
                            <Button icon={faImages} onClick={onUploadImages}>
                                Upload Images
                            </Button>

                            <Button icon={faPen} onClick={onEdit}>
                                Edit Inspection
                            </Button>

                            <span className="dtl-toolbar-sep" aria-hidden="true" />

                            <Button
                                variant="danger"
                                icon={faTrashCan}
                                onClick={onDelete}
                            >
                                Delete Inspection
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <dl className="dtl-strip">
                <Fact label="Inspection type">{inspection.inspectionType}</Fact>
                <Fact label="Priority">
                    <Chip>{inspection.priority}</Chip>
                </Fact>
                <Fact label="Scheduled date" icon={faCalendarDays}>
                    {formatDate(inspection.scheduledDate)}
                </Fact>
                <Fact label="Inspection date" icon={faCalendarDays}>
                    {formatDate(inspection.inspectionDate)}
                </Fact>
            </dl>

            <div className="dtl-layout">
                <div className="dtl-main">
                    <Card title="Site conditions">
                        <dl className="dtl-facts dtl-facts--3">
                            <Fact label="Structure area" icon={faClipboardCheck}>
                                {inspection.structureArea}
                            </Fact>

                            <Fact label="GPS location" icon={faLocationDot}>
                                {inspection.gpsLocation}
                            </Fact>

                            <Fact label="Weather" icon={faCloudSun}>
                                {inspection.weather}
                            </Fact>
                        </dl>
                    </Card>

                    <Card title="Field notes">
                        <p
                            className={`dtl-prose ${inspection.fieldNotes ? "" : "dtl-prose--empty"
                                }`}
                        >
                            {inspection.fieldNotes || "No notes added."}
                        </p>
                    </Card>
                </div>

                <aside className="dtl-side">
                    <Card title="Project">
                        <dl className="dtl-rows">
                            <Row label="Name">{inspection.project?.name}</Row>
                            <Row label="Code">
                                {inspection.project?.projectCode}
                            </Row>
                        </dl>

                        {inspection.project?._id && (
                            <Link
                                to={`/dashboard/projects/${inspection.project._id}`}
                                className="dtl-link"
                            >
                                View project
                            </Link>
                        )}
                    </Card>

                    <Card title="Inspection record">
                        <dl className="dtl-rows">
                            <Row label="Created by" icon={faUserTie}>
                                {inspection.createdBy?.name}
                            </Row>
                            <Row label="Created on" icon={faCalendarDays}>
                                {new Date(
                                    inspection.createdAt
                                ).toLocaleDateString()}
                            </Row>
                        </dl>
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default InspectionDetails;
