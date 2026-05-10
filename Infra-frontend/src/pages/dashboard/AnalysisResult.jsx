import { ArrowRight, CheckCircle2, FileBarChart2, ShieldAlert, TriangleAlert } from "lucide-react";
import PageHeader from "../../components/dashboard/shared/PageHeader";

const findings = [
    {
        title: "Structural hot spot detected",
        description: "Hairline cracking concentrated along the south support edge.",
        tone: "danger",
    },
    {
        title: "Load distribution remains stable",
        description: "No displacement detected in the monitored beam cluster.",
        tone: "success",
    },
    {
        title: "Follow-up recommended",
        description: "Schedule a secondary scan after the next maintenance cycle.",
        tone: "warning",
    },
];

function AnalysisResult() {
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
                        <span className="dashboard-pill is-warning">Moderate risk</span>
                    </div>

                    <div className="dashboard-results-grid">
                        <article className="dashboard-results-card">
                            <ShieldAlert size={20} />
                            <strong>Severe cracks</strong>
                            <span>1 detected area</span>
                        </article>
                        <article className="dashboard-results-card">
                            <TriangleAlert size={20} />
                            <strong>Moderate cracks</strong>
                            <span>3 monitored segments</span>
                        </article>
                        <article className="dashboard-results-card">
                            <CheckCircle2 size={20} />
                            <strong>Clear sections</strong>
                            <span>12 stable segments</span>
                        </article>
                    </div>

                    <div className="dashboard-results-preview">
                        <FileBarChart2 size={30} />
                        <div>
                            <strong>Generated report preview</strong>
                            <p>Confidence metrics, crack overlays, and structural annotations will appear here.</p>
                        </div>
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
                        {findings.map((finding) => (
                            <article key={finding.title} className={["dashboard-finding", `is-${finding.tone}`].join(" ")}>
                                <strong>{finding.title}</strong>
                                <p>{finding.description}</p>
                            </article>
                        ))}
                    </div>

                    <button type="button" className="dashboard-button dashboard-button--primary dashboard-button--full">
                        Export report
                        <ArrowRight size={16} />
                    </button>
                </aside>
            </div>
        </div>
    );
}

export default AnalysisResult;