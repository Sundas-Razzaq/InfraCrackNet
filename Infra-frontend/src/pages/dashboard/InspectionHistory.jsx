import { ArrowRight, Clock3, Download, History, Search, ShieldAlert, TriangleAlert } from "lucide-react";
import PageHeader from "../../components/dashboard/shared/PageHeader";

const historyItems = [
    {
        structure: "Golden Gate Bridge South Pillar",
        location: "Section A-12 | Pillar 4",
        date: "Oct 24, 2023",
        severity: "Severe",
        tone: "danger",
    },
    {
        structure: "Hoover Dam Intake Tower 2",
        location: "Maintenance Deck | Level 4",
        date: "Oct 23, 2023",
        severity: "Moderate",
        tone: "warning",
    },
    {
        structure: "Brooklyn Bridge Support Beam",
        location: "Suspension Anchor | North",
        date: "Oct 22, 2023",
        severity: "Clear",
        tone: "success",
    },
];

function InspectionHistory() {
    return (
        <div className="dashboard-page">
            <PageHeader
                eyebrow="Timeline"
                title="Inspection history"
                description="Track scans, severity shifts, and report generation history across monitored structures."
            >
                <button type="button" className="dashboard-button dashboard-button--ghost">
                    <Download size={16} />
                    Export history
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
                            <input type="search" placeholder="Filter structures" />
                        </label>
                    </div>

                    <div className="dashboard-table-wrap">
                        <table className="dashboard-table dashboard-table--history">
                            <thead>
                                <tr>
                                    <th>Structure</th>
                                    <th>Date</th>
                                    <th>Severity</th>
                                    <th>Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyItems.map((item) => (
                                    <tr key={`${item.structure}-${item.date}`}>
                                        <td>
                                            <div className="dashboard-table__primary">
                                                <strong>{item.structure}</strong>
                                                <span>{item.location}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="dashboard-table__date">
                                                <Clock3 size={15} />
                                                {item.date}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={["dashboard-pill", `is-${item.tone}`].join(" ")}>
                                                {item.severity}
                                            </span>
                                        </td>
                                        <td>
                                            <button type="button" className="dashboard-icon-button" aria-label="Open report">
                                                <ArrowRight size={16} />
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
                        <strong>128 reports generated</strong>
                        <p>Most recent inspections have been indexed and are ready for quick retrieval.</p>
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