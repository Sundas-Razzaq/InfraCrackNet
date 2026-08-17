import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import PageHeader from "../../../components/dashboard/shared/PageHeader";

import ReportStatusBadge from "../../../components/reports/reportStatusBadge";
import ReportSummary from "../../../components/reports/reportSummary";
import ReportProjectInfo from "../../../components/reports/reportProjectInfo";
import ReportInspectionInfo from "../../../components/reports/reportInspectionInfo";
import ReportAnalysisSummary from "../../../components/reports/reportAnalysisSummary";
import ReportCrackTable from "../../../components/reports/reportCrackTable";
import ReportRecommendations from "../../../components/reports/reportRecommendations";

import { getReport } from "../../../api/reportApi";
import { getApiErrorMessage } from "../../../api/authApi";

import { toast } from "react-toastify";

const ReportDetailsPage = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [cracks, setCracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await getReport(reportId);

                console.log(
                    "REPORT DETAILS:",
                    response.data
                );

                setReport(response.data.report);
                setCracks(
                    response.data.cracks || []
                );
            } catch (error) {
                console.error(
                    "REPORT DETAILS ERROR:",
                    error
                );

                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load report details."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [reportId]);

    if (loading) {
        return (
            <div className="page-loading">
                Loading report details...
            </div>
        );
    }

    if (!report) {
        return (
            <div className="page-loading">
                Report not found.
            </div>
        );
    }

    const {
        reportCode,
        status,
        inspection,
        analysis,
        recommendations = [],
    } = report;

    return (
        <div className="report-details-page">

            <div className="report-details-header">
                <PageHeader
                    title="Inspection Report"
                    subtitle={`${reportCode} • ${inspection?.project?.name ||
                        "Unnamed Project"
                        }`}
                />

                <div className="report-details-header-actions">
                    <ReportStatusBadge
                        status={status}
                    />

                    <button
                        type="button"
                        className="report-export-button"
                        onClick={() =>
                            navigate(
                                `/dashboard/reports/${reportId}/export`
                            )
                        }
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            <ReportSummary
                report={report}
                analysis={analysis}
            />

            <ReportProjectInfo
                project={inspection?.project}
            />

            <ReportInspectionInfo
                inspection={inspection}
            />

            <ReportAnalysisSummary
                analysis={analysis}
                cracks={cracks}
            />

            <ReportCrackTable
                cracks={cracks}
            />

            <ReportRecommendations
                recommendations={recommendations}
            />

        </div>
    );
};

export default ReportDetailsPage;