import { ArrowRight, CheckCircle2, FileBarChart2, ShieldAlert, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/dashboard/shared/PageHeader";
import {
    buildAssetUrl,
    downloadInspectionReport,
    getInspectionById,
} from "../../api/inspectionApi";
import { getApiErrorMessage } from "../../api/authApi";

function AnalysisResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialInspection = location.state?.inspection || null;

    const [inspection, setInspection] = useState(initialInspection);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);

    const severity = inspection?.crackSeverity || "Unknown";
    const crackCount = inspection?.crackCount ?? 0;
    const confidence = inspection?.confidenceScore;
    const crackType = inspection?.crackType || "N/A";
    const recommendation = inspection?.recommendation || "No recommendation available.";
    const processedImageUrl = buildAssetUrl(inspection?.processedImage);
    const originalImageUrl = buildAssetUrl(inspection?.originalImage);

    const severityTone = useMemo(() => {
        if (severity === "Severe") return "danger";
        if (severity === "Moderate") return "warning";
        if (severity === "Minor") return "success";
        return "warning";
    }, [severity]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const idFromQuery = params.get("id");

        if (inspection || !idFromQuery) {
            return;
        }

        let isMounted = true;

        const loadInspection = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await getInspectionById(idFromQuery);
                if (isMounted) {
                    setInspection(response?.data || null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(getApiErrorMessage(err, "Failed to load inspection result."));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadInspection();

        return () => {
            isMounted = false;
        };
    }, [inspection, location.search]);

    const handleDownload = async () => {
        if (!inspection?._id || downloading) {
            return;
        }

        setDownloading(true);
        setError("");

        try {
            await downloadInspectionReport(inspection._id);
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to download report."));
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <PageHeader
                eyebrow="Results"
                title="Analysis result"
                description="Review the latest model output, severity summary, and recommended next steps."
            />

            <div className="dashboard-split-layout dashboard-split-layout--results">
                <section className="dashboard-panel">
                    <div className="dashboard-panel__header">
                        <div>
                            <span className="dashboard-panel__eyebrow">Inspection summary</span>
                            <h2>Model output overview</h2>
                        </div>
                        <span className={["dashboard-pill", `is-${severityTone}`].join(" ")}>{severity} risk</span>
                    </div>

                    {loading ? <p>Loading inspection result...</p> : null}
                    {error ? <p className="auth-message auth-message--error">{error}</p> : null}

                    <div className="dashboard-results-grid">
                        <article className="dashboard-results-card">
                            <ShieldAlert size={20} />
                            <strong>Severity</strong>
                            <span>{severity}</span>
                        </article>
                        <article className="dashboard-results-card">
                            <TriangleAlert size={20} />
                            <strong>Crack count</strong>
                            <span>{crackCount}</span>
                        </article>
                        <article className="dashboard-results-card">
                            <CheckCircle2 size={20} />
                            <strong>Confidence</strong>
                            <span>{typeof confidence === "number" ? `${confidence}%` : "N/A"}</span>
                        </article>
                    </div>

                    <div className="dashboard-results-preview">
                        <FileBarChart2 size={30} />
                        <div>
                            <strong>Generated report preview</strong>
                            <p>{recommendation}</p>
                            <p style={{ marginTop: "0.5rem" }}>
                                <strong>Crack type:</strong> {crackType}
                            </p>
                        </div>
                    </div>

                    <div className="dashboard-subgrid" style={{ marginTop: "1rem" }}>
                        <article className="dashboard-mini-card">
                            <strong>Original image</strong>
                            {originalImageUrl ? (
                                <img
                                    src={originalImageUrl}
                                    alt="Original inspection"
                                    style={{ width: "100%", borderRadius: "12px", marginTop: "0.5rem" }}
                                />
                            ) : (
                                <span>No original image available.</span>
                            )}
                        </article>
                        <article className="dashboard-mini-card">
                            <strong>Processed image</strong>
                            {processedImageUrl ? (
                                <img
                                    src={processedImageUrl}
                                    alt="Processed inspection"
                                    style={{ width: "100%", borderRadius: "12px", marginTop: "0.5rem" }}
                                />
                            ) : (
                                <span>No processed image available.</span>
                            )}
                        </article>
                    </div>
                </section>

                <aside className="dashboard-panel dashboard-panel--side">
                    <div className="dashboard-panel__header">
                        <div>
                            <span className="dashboard-panel__eyebrow">Findings</span>
                            <h2>Key observations</h2>
                        </div>
                    </div>

                    <div className="dashboard-findings-list">
                        <article className={["dashboard-finding", `is-${severityTone}`].join(" ")}>
                            <strong>Detected crack type</strong>
                            <p>{crackType}</p>
                        </article>
                        <article className="dashboard-finding is-warning">
                            <strong>Recommendation</strong>
                            <p>{recommendation}</p>
                        </article>
                        <article className="dashboard-finding is-success">
                            <strong>Inspection ID</strong>
                            <p>{inspection?._id || "Not available"}</p>
                        </article>
                    </div>

                    <button
                        type="button"
                        className="dashboard-button dashboard-button--primary dashboard-button--full"
                        onClick={handleDownload}
                        disabled={!inspection?._id || downloading}
                    >
                        Export report
                        <ArrowRight size={16} />
                    </button>

                    <button
                        type="button"
                        className="dashboard-button dashboard-button--ghost dashboard-button--full"
                        style={{ marginTop: "0.75rem" }}
                        onClick={() => navigate("/dashboard/inspection-history")}
                    >
                        Open history
                    </button>
                </aside>
            </div>
        </div>
    );
}

export default AnalysisResult;