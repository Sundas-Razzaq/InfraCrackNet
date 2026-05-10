import { ArrowRight, Layers3, ScanSearch, ShieldAlert, UploadCloud } from "lucide-react";
import PageHeader from "../../components/dashboard/shared/PageHeader";
import EmptyState from "../../components/dashboard/shared/EmptyState";

const uploadSteps = [
    "Drag and drop structural images into the upload area.",
    "Run crack detection and inspect the confidence summary.",
    "Save the report to the inspection history timeline.",
];

function UploadInspection() {
    return (
        <div className="dashboard-page">
            <PageHeader
                eyebrow="Inspection upload"
                title="Upload new inspection"
                description="Prepare a fresh capture for automated analysis and review the results in a single workflow."
            />

            <div className="dashboard-split-layout">
                <section className="dashboard-panel dashboard-panel--upload">
                    <div className="dashboard-upload-card">
                        <div className="dashboard-upload-card__icon">
                            <UploadCloud size={24} />
                        </div>
                        <h2>Drop images to inspect</h2>
                        <p>Support for JPG, PNG, and high-resolution site imagery.</p>

                        <div className="dashboard-upload-card__dropzone">
                            <span>Drop files here or choose from your device</span>
                            <button type="button" className="dashboard-button dashboard-button--primary">
                                Select images
                            </button>
                        </div>
                    </div>

                    <div className="dashboard-subgrid">
                        <article className="dashboard-mini-card">
                            <Layers3 size={18} />
                            <strong>Batch ready</strong>
                            <span>Upload multiple inspection captures in one pass.</span>
                        </article>
                        <article className="dashboard-mini-card">
                            <ScanSearch size={18} />
                            <strong>AI scan</strong>
                            <span>Detect crack patterns and map affected segments.</span>
                        </article>
                        <article className="dashboard-mini-card dashboard-mini-card--warning">
                            <ShieldAlert size={18} />
                            <strong>Priority routing</strong>
                            <span>Push severe findings into the review queue.</span>
                        </article>
                    </div>
                </section>

                <aside className="dashboard-panel dashboard-panel--side">
                    <div className="dashboard-panel__header">
                        <div>
                            <span className="dashboard-panel__eyebrow">Workflow</span>
                            <h2>Upload checklist</h2>
                        </div>
                    </div>

                    <div className="dashboard-checklist">
                        {uploadSteps.map((step, index) => (
                            <div key={step} className="dashboard-checklist__item">
                                <span>{index + 1}</span>
                                <p>{step}</p>
                            </div>
                        ))}
                    </div>

                    <EmptyState
                        icon={ScanSearch}
                        title="Nothing uploaded yet"
                        description="Start with a structure image to generate a live analysis preview and severity score."
                        actionLabel="Open analysis"
                        onAction={() => null}
                        secondaryActionLabel="Review history"
                        onSecondaryAction={() => null}
                    />

                    <button type="button" className="dashboard-button dashboard-button--ghost dashboard-button--full">
                        Continue to analysis
                        <ArrowRight size={16} />
                    </button>
                </aside>
            </div>
        </div>
    );
}

export default UploadInspection;