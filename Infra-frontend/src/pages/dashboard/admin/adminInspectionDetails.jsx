import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import InspectionDetails from "../../../components/inspection/inspectionDetails";
import UploadedImageCard from "../../../components/inspectionImage/UploadedImageCard";
import SeverityBadge from "../../../components/analysis/SeverityBadge";
import { Card, Chip, Row } from "../../../components/dashboard/shared/DetailsKit";
import AiSimulatedBanner from "../../../components/admin/AiSimulatedBanner";
import DataTable from "../../../components/admin/DataTable";
import LinkedReportsTable from "../../../components/admin/LinkedReportsTable";
import StatusChip from "../../../components/admin/StatusChip";
import ValidationBadge from "../../../components/admin/ValidationBadge";

import { getAdminInspection } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { formatDateTime } from "../../../utils/adminFormat";

const analysisColumns = [
    {
        key: "analysisCode",
        header: "Analysis",
        render: (row) => (
            <div>
                <strong>{row.analysisCode}</strong>
                <div className="adm-subtext">v{row.analysisVersion || 1}</div>
            </div>
        ),
    },
    { key: "status", header: "Status", render: (row) => <StatusChip value={row.status} /> },
    { key: "validationStatus", header: "Validation", render: (row) => <ValidationBadge value={row.validationStatus} /> },
    {
        key: "severity",
        header: "Severity",
        render: (row) => (row.overallSeverity ? <SeverityBadge severity={row.overallSeverity} /> : "-"),
    },
    { key: "risk", header: "Risk", render: (row) => (row.riskScore != null ? `${row.riskScore}%` : "-") },
    { key: "createdAt", header: "Created", render: (row) => formatDateTime(row.createdAt) },
];

const AdminInspectionDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const res = await getAdminInspection(id);
                if (!cancelled) setData(res.data);
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load inspection."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) return <div className="page-loading">Loading inspection...</div>;
    if (error || !data) return <div className="page-loading">{error || "Inspection not found."}</div>;

    const { inspection, images = [], analyses = [], reports = [] } = data;
    const team = inspection.project?.team;

    return (
        <div className="adm-page">
            {analyses.length > 0 && (
                <AiSimulatedBanner aiMode={data.aiMode} disclaimer={data.aiDisclaimer} />
            )}

            <InspectionDetails
                inspection={inspection}
                backTo="/dashboard/admin/inspections"
                backLabel="All inspections"
                projectLinkBase="/dashboard/admin/projects"
            >
                <Card title="Team">
                    {team ? (
                        <dl className="dtl-rows">
                            <Row label="Team">
                                <Link to={`/dashboard/admin/teams/${team._id}`} className="dtl-link">
                                    {team.name}
                                </Link>
                            </Row>
                            <Row label="Team status"><StatusChip value={team.status} /></Row>
                            <Row label="Engineer lead">{team.engineerLead?.name}</Row>
                        </dl>
                    ) : (
                        <Chip tone="warning">Project is unassigned</Chip>
                    )}
                </Card>

                <Card title={`Media (${images.length})`}>
                    {images.length === 0 ? (
                        <p className="dtl-prose dtl-prose--empty">No media uploaded yet.</p>
                    ) : (
                        <div className="adm-stack">
                            {images.map((image) => (
                                <UploadedImageCard key={image._id} image={image} />
                            ))}
                        </div>
                    )}
                </Card>

                <Card title={`AI analyses (${analyses.length})`}>
                    <DataTable
                        bare
                        columns={analysisColumns}
                        rows={analyses}
                        emptyText="No analyses yet."
                        onRowClick={(row) => navigate(`/dashboard/admin/analyses/${row._id}`)}
                    />
                </Card>

                <Card title={`Reports (${reports.length})`}>
                    <LinkedReportsTable
    reports={reports}
    onRowClick={(row) => navigate(`/dashboard/admin/reports/${row._id}`)}
/>
                </Card>
            </InspectionDetails>
        </div>
    );
};

export default AdminInspectionDetailsPage;