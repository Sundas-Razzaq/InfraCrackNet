import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import AnalysisCard from "../../../components/analysis/analysisCard";
import EmptyState from "../../../components/dashboard/shared/EmptyState";

import { getAllAnalysis } from "../../../api/analysisApi";
import { getApiErrorMessage } from "../../../api/authApi";

import { faChartLine } from "@fortawesome/free-solid-svg-icons";

const AnalyticsPage = () => {
    const [analysis, setAnalysis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalyses = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await getAllAnalysis();

                setAnalysis(response?.data || []);
            } catch (error) {
                const message = getApiErrorMessage(
                    error,
                    "Failed to load AI analyses."
                );

                setError(message);
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        };

        loadAnalyses();
    }, []);

    if (isLoading) {
        return (
            <div className="page-loading">
                Loading AI analyses...
            </div>
        );
    }

    return (
        <div className="analytics-page">

            <PageHeader
                title="AI Analytics"
                subtitle="View and review AI analysis results from your infrastructure inspections."
            />

            {error && (
                <div className="analytics-error">
                    {error}
                </div>
            )}

            {!error && analysis.length === 0 ? (
                <EmptyState
                    icon={faChartLine}
                    title="No AI Analyses Found"
                    message="No AI analysis has been run yet. Start an inspection and run AI analysis to see results here."
                />
            ) : (
                <div className="analysis-grid">
                    {analysis.map((analysis) => (
                        <AnalysisCard
                            key={analysis._id}
                            analysis={analysis}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default AnalyticsPage;