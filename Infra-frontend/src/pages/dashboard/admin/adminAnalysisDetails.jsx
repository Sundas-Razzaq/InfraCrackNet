import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import { Card, Chip, Row } from "../../../components/dashboard/shared/DetailsKit";
import SummaryCards from "../../../components/analysis/SummaryCards";
import DetectionImage from "../../../components/analysis/DetectionImage";
import SeverityBar from "../../../components/analysis/SeverityBar";
import CrackTable from "../../../components/analysis/CrackTable";
import AiSimulatedBanner from "../../../components/admin/AiSimulatedBanner";
import LinkedReportsTable from "../../../components/admin/LinkedReportsTable";
import StatusChip from "../../../components/admin/StatusChip";
import ValidationBadge from "../../../components/admin/ValidationBadge";

import { getAdminAnalysis } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { formatDateTime } from "../../../utils/adminFormat";

const AdminAnalysisDetailsPage = () => {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const res = await getAdminAnalysis(id);
                if (!cancelled) setData(res.data);
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load analysis."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) return <div className="page-loading">Loading analysis details...</div>;
    if (error || !data) return <div className="page-loading">{error || "Analysis not found."}</div>;

    const { analysis, detectionSummary, detections = [], reports = [] } = data;
    const inspection = analysis.inspection;
    const isCompleted = analysis.status === "Completed";

    // Same shape the Engineer results page passes to these components.
    const summary = {
        totalCracks: detectionSummary?.total ?? detections.length,
        averageConfidence: analysis.averageConfidence ?? 0,
        overallSeverity: analysis.overallSeverity ?? null,
        riskScore: analysis.riskScore ?? 0,
    };

    return (
        <div className="analysis-results-page">
            <Link to="/dashboard/admin/analyses" className="dtl-back">
                <FontAwesomeIcon icon={faChevronLeft} />
                All analyses
            </Link>

            <div className="results-header">
                <PageHeader
                    title="AI Analysis Details"
                    subtitle={`${analysis.analysisCode} • ${inspection?.inspectionCode || "-"} • ${inspection?.project?.name || "-"}`}
                />

                <div className="results-header-right">
                    <StatusChip value={analysis.status} />
                    <ValidationBadge value={analysis.validationStatus} />
                </div>
            </div>

            <AiSimulatedBanner aiMode={data.aiMode} disclaimer={data.aiDisclaimer} />

            {isCompleted ? (
                <>
                    <SummaryCards summary={summary} cracks={detections} />

                    <div className="analysis-results-grid">
                        <DetectionImage cracks={detections} />
                        <SeverityBar summary={summary} cracks={detections} />
                    </div>

                    <CrackTable cracks={detections} />
                </>
            ) : (
                <div className="adm-banner" role="note">
                    <span>
                        Detection results are available once the analysis is completed (currently{" "}
                        <strong>{analysis.status}</strong>, {analysis.progress ?? 0}%).
                    </span>
                </div>
            )}

            <div className="dtl">
                <Card title="Analysis record">
                    <dl className="dtl-rows">
                        <Row label="Analysis code">{analysis.analysisCode}</Row>
                        <Row label="Version">{`v${analysis.analysisVersion || 1}`}</Row>
                        <Row label="Mode">
                            <Chip tone={analysis.isSimulated ? "warning" : "success"}>
                                {analysis.isSimulated ? "Simulated" : "Real"}
                            </Chip>
                        </Row>
                        <Row label="Progress">{`${analysis.progress ?? 0}%`}</Row>
                        <Row label="Images">{`${analysis.processedImages ?? 0} / ${analysis.totalImages ?? 0}`}</Row>
                        <Row label="Started">{formatDateTime(analysis.startedAt)}</Row>
                        <Row label="Completed">{formatDateTime(analysis.completedAt)}</Row>
                        <Row label="Requested by">{analysis.createdBy?.name}</Row>
                        <Row label="Validated by">{analysis.validatedBy?.name}</Row>
                        <Row label="Validated on">{formatDateTime(analysis.validatedAt)}</Row>
                        {analysis.rejectionReason && (
                            <Row label="Rejection reason">{analysis.rejectionReason}</Row>
                        )}
                    </dl>

                    {inspection?._id && (
                        <Link to={`/dashboard/admin/inspections/${inspection._id}`} className="dtl-link">
                            View inspection
                        </Link>
                    )}
                </Card>

                <Card title={`Reports (${reports.length})`}>
                    <LinkedReportsTable reports={reports} />
                </Card>
            </div>
        </div>
    );
};

export default AdminAnalysisDetailsPage;