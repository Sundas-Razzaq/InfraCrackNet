import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PageHeader from "../../../components/dashboard/shared/PageHeader";

import SummaryCards from "../../../components/analysis/SummaryCards";
import DetectionImage from "../../../components/analysis/DetectionImage";
import SeverityBar from "../../../components/analysis/SeverityBar";
import CrackTable from "../../../components/analysis/CrackTable";

import { getAnalysisResults } from "../../../api/analysisApi";
import { getApiErrorMessage } from "../../../api/authApi";

import { toast } from "react-toastify";

const AnalysisDetailsPage = () => {
    const navigate = useNavigate();
    const { analysisId } = useParams();

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response =
                    await getAnalysisResults(analysisId);

                console.log(
                    "ANALYSIS DETAILS:",
                    response.data
                );

                setResults(response.data);
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load analysis details."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [analysisId]);

    if (loading) {
        return (
            <div className="page-loading">
                Loading analysis details...
            </div>
        );
    }

    if (!results) {
        return (
            <div className="page-loading">
                Analysis details not found.
            </div>
        );
    }

    const {
        analysis,
        summary,
        cracks = [],
    } = results;

    const isPending = analysis.validationStatus === "Pending";

    return (
        <div className="analysis-results-page">

            <div className="results-header">
                <PageHeader
                    title="AI Analysis Details"
                    subtitle={`${analysis.inspection.inspectionCode} • ${analysis.inspection.project.name}`}
                />

                <div
                    className={`analysis-validation-status ${analysis.validationStatus?.toLowerCase()}`}
                >
                    {analysis.validationStatus}
                </div>

                {isPending && (
                    <div className="results-actions">

                        <button
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    `/dashboard/inspection/${analysis.inspection._id}/annotation/${analysis._id}`
                                )
                            }
                        >
                            Annotate
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate(
                                    `/dashboard/inspection/${analysis.inspection._id}/validation/${analysis._id}`
                                )
                            }
                        >
                            Validate
                        </button>

                    </div>
                )}
            </div>

            <SummaryCards
                summary={summary}
                cracks={cracks}
            />

            <div className="analysis-results-grid">
                <DetectionImage
                    cracks={cracks}
                />

                <SeverityBar
                    summary={summary}
                />
            </div>

            <CrackTable
                cracks={cracks}
            />

        </div>
    );
};

export default AnalysisDetailsPage;