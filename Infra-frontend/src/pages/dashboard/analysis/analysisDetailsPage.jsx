import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import InspectionHeader from "../../../components/inspection/InspectionHeader";

import SummaryCards from "../../../components/analysis/SummaryCards";
import DetectionImage from "../../../components/analysis/DetectionImage";
import SeverityBar from "../../../components/analysis/SeverityBar";
import CrackTable from "../../../components/analysis/CrackTable";

import { getAnalysisResults } from "../../../api/analysisApi";
import { getApiErrorMessage } from "../../../api/authApi";

import { toast } from "react-toastify";

const AnalysisDetailsPage = () => {
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

    return (
        <div className="analysis-results-page">

            <div className="results-header">
                <InspectionHeader
                    title="AI Analysis Details"
                    subtitle={`${analysis.inspection.inspectionCode} • ${analysis.inspection.project.name}`}
                />

                <div
                    className={`analysis-validation-status ${analysis.validationStatus
                        ?.toLowerCase()
                        }`}
                >
                    {analysis.validationStatus}
                </div>
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