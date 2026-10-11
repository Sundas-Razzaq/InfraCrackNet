import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import InspectionStepper from "../../../components/inspection/InspectionStepper";

import SummaryCards from "../../../components/analysis/SummaryCards";
import DetectionImage from "../../../components/analysis/DetectionImage";
import SeverityBar from "../../../components/analysis/SeverityBar";
import CrackTable from "../../../components/analysis/CrackTable";
import { useRole } from "../../../utils/useRole";

import { getAnalysisResults } from "../../../api/analysisApi";
import { getApiErrorMessage } from "../../../api/authApi";

import { toast } from "react-toastify";

const AIResultsPage = () => {
    const { analysisId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const { isEngineer } = useRole();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response =
                    await getAnalysisResults(analysisId);

                console.log(
                    "AI ANALYSIS RESULTS:",
                    response.data
                );

                setResults(response.data);
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load AI results."
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
                Loading AI Analysis Results...
            </div>
        );
    }

    if (!results) {
        return (
            <div className="page-loading">
                Analysis results not found.
            </div>
        );
    }

    const {
        analysis,
        summary,
        cracks = [],
    } = results;

    return (
        <div className="analysis-results-page">

            <div className="results-header">

                <PageHeader
                    title="AI Analysis Results"
                    subtitle={`${analysis.inspection.inspectionCode} • ${analysis.inspection.project.name}`}
                />

                <div className="results-actions">
                    {isEngineer && (
                        <>
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
                        </>
                    )}

                    {/* Inspector sees a read-only note */}
                    {!isEngineer && (
                        <p className="results-readonly-note">
                            You are viewing this analysis in read-only mode. The engineer
                            will review and finalize the results.
                        </p>
                    )}
                </div>

            </div>

            <InspectionStepper currentStep={4} />

            {/* AI SUMMARY */}
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

export default AIResultsPage;