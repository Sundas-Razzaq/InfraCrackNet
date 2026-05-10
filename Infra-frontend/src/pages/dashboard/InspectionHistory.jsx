import { ArrowRight, Clock3, Download, History, Search, ShieldAlert, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/dashboard/shared/PageHeader";
import {
    buildAssetUrl,
    downloadInspectionReport,
    getInspectionHistory,
} from "../../api/inspectionApi";
import { getApiErrorMessage } from "../../api/authApi";

function InspectionHistory() {
    const navigate = useNavigate();
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [downloadingId, setDownloadingId] = useState("");

    const loadHistory = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getInspectionHistory();
            setHistoryItems(Array.isArray(response?.data) ? response.data : []);
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to fetch inspection history."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return historyItems;
        }

        return historyItems.filter((item) => {
            const text = `${item?.crackType || ""} ${item?.crackSeverity || ""}`.toLowerCase();
            return text.includes(query);
        });
    }, [historyItems, search]);

    const toTone = (severity) => {
        if (severity === "Severe") return "danger";
        if (severity === "Moderate") return "warning";
        if (severity === "Minor") return "success";
        return "success";
    };

    const handleDownload = async (id) => {
        if (!id || downloadingId) {
            return;
        }

        setDownloadingId(id);

        try {
            await downloadInspectionReport(id);
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to download report."));
        } finally {
            setDownloadingId("");
        }
    };

    return (
        <div className="dashboard-page">
            <PageHeader
                eyebrow="Timeline"
                title="Inspection history"
                description="Track scans, severity shifts, and report generation history across monitored structures."
            >
                <button type="button" className="dashboard-button dashboard-button--ghost" onClick={loadHistory}>
                    <Download size={16} />
                    Refresh history
                </button>
            </PageHeader>

            <div className="dashboard-split-layout dashboard-split-layout--history">
                <section className="dashboard-panel">
                    <div className="dashboard-panel__header">
                        <div>
                            <span className="dashboard-panel__eyebrow">Records</span>
                            <h2>Inspection log</h2>
                        </div>

                        <label className="dashboard-filter" aria-label="Filter inspection history">
                            <Search size={16} />
                            <input
                                type="search"
                                placeholder="Filter by severity or crack type"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </label>
                    </div>

                    {loading ? <p>Loading inspection history...</p> : null}
                    {error ? <p className="auth-message auth-message--error">{error}</p> : null}
                    {!loading && !error && filteredItems.length === 0 ? (
                        <p>No inspections found for your account yet.</p>
                    ) : null}

                    <div className="dashboard-table-wrap">
                        <table className="dashboard-table dashboard-table--history">
                            <thead>
                                <tr>
                                    <th>Inspection</th>
                                    <th>Date</th>
                                    <th>Severity</th>
                                    <th>Confidence</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="dashboard-table__primary">
                                                <strong>{item.crackType || "Unknown crack type"}</strong>
                                                <span>{item._id}</span>
                                                {item.processedImage ? (
                                                    <img
                                                        src={buildAssetUrl(item.processedImage)}
                                                        alt="Processed thumbnail"
                                                        style={{
                                                            width: "88px",
                                                            height: "56px",
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                            marginTop: "0.5rem",
                                                        }}
                                                    />
                                                ) : null}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="dashboard-table__date">
                                                <Clock3 size={15} />
                                                {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={["dashboard-pill", `is-${toTone(item.crackSeverity)}`].join(" ")}>
                                                {item.crackSeverity || "Unknown"}
                                            </span>
                                        </td>
                                        <td>{typeof item.confidenceScore === "number" ? `${item.confidenceScore}%` : "N/A"}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="dashboard-icon-button"
                                                aria-label="View result"
                                                onClick={() =>
                                                    navigate(`/dashboard/analysis-result?id=${item._id}`, {
                                                        state: { inspection: item },
                                                    })
                                                }
                                                style={{ marginRight: "0.5rem" }}
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                className="dashboard-icon-button"
                                                aria-label="Download report"
                                                onClick={() => handleDownload(item._id)}
                                                disabled={downloadingId === item._id}
                                            >
                                                <Download size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <aside className="dashboard-panel dashboard-panel--side">
                    <div className="dashboard-panel__header">
                        <div>
                            <span className="dashboard-panel__eyebrow">Overview</span>
                            <h2>Status summary</h2>
                        </div>
                    </div>

                    <article className="dashboard-summary-card">
                        <History size={24} />
                        <strong>{historyItems.length} reports generated</strong>
                        <p>All inspection records are loaded from your backend history endpoint.</p>
                    </article>

                    <div className="dashboard-subgrid dashboard-subgrid--compact">
                        <article className="dashboard-mini-card dashboard-mini-card--warning">
                            <ShieldAlert size={18} />
                            <strong>4 critical cases</strong>
                            <span>Escalated for immediate review.</span>
                        </article>
                        <article className="dashboard-mini-card">
                            <TriangleAlert size={18} />
                            <strong>18 moderate cases</strong>
                            <span>Monitor over the next cycle.</span>
                        </article>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default InspectionHistory;