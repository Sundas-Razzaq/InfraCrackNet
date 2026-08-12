import { useEffect, useState } from "react";
import { toast } from "react-toastify";


import AnalysisCard from "../../../components/analysis/analysisCard";
import EmptyState from "../../../components/dashboard/shared/EmptyState";

import { getAllAnalysis } from "../../../api/analysisApi";
import { getApiErrorMessage } from "../../../api/authApi";

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
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load AI analyses."
                    )
                );
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
            <div className="analytics-page-header">
                <div>
                    <h1>AI Analytics</h1>

                    <p>
                        View and review AI analysis results
                        from your infrastructure inspections.
                    </p>
                </div>
            </div>

            {error && (
                <div className="analytics-error">
                    {error}
                </div>
            )}

            {!error && analysis.length === 0 ? (
                <EmptyState
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