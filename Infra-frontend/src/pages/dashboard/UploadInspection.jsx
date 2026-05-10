import { ArrowRight, Layers3, ScanSearch, ShieldAlert, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/dashboard/shared/PageHeader";
import EmptyState from "../../components/dashboard/shared/EmptyState";
import { uploadInspection } from "../../api/inspectionApi";
import { getApiErrorMessage } from "../../api/authApi";

const uploadSteps = [
    "Drag and drop structural images into the upload area.",
    "Run crack detection and inspect the confidence summary.",
    "Save the report to the inspection history timeline.",
];

function UploadInspection() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const handleSelectClick = () => {
        if (loading) {
            return;
        }

        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        setError("");

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setSelectedFile(null);
            setError("Unsupported file type. Please upload JPG, JPEG, PNG, or WEBP image.");
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile || loading) {
            if (!selectedFile) {
                setError("Please select an image first.");
            }
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);

            const response = await uploadInspection(formData);
            const inspection = response?.data || null;

            navigate("/dashboard/analysis-result", {
                state: {
                    inspection,
                },
            });
        } catch (err) {
            setError(getApiErrorMessage(err, "Upload failed. Please try again."));
        } finally {
            setLoading(false);
        }
    };

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

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            disabled={loading}
                        />

                        <div className="dashboard-upload-card__dropzone">
                            <span>
                                {selectedFile ? `Selected: ${selectedFile.name}` : "Drop files here or choose from your device"}
                            </span>
                            <button
                                type="button"
                                className="dashboard-button dashboard-button--primary"
                                onClick={handleSelectClick}
                                disabled={loading}
                            >
                                {loading ? "Uploading..." : "Select images"}
                            </button>
                        </div>

                        {error ? (
                            <p className="auth-message auth-message--error" style={{ marginTop: "0.75rem" }}>
                                {error}
                            </p>
                        ) : null}

                        <button
                            type="button"
                            className="dashboard-button dashboard-button--primary"
                            style={{ marginTop: "1rem" }}
                            onClick={handleUpload}
                            disabled={loading || !selectedFile}
                        >
                            {loading ? "Processing inspection..." : "Upload and analyze"}
                        </button>
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
                        onAction={() => navigate("/dashboard/analysis-result")}
                        secondaryActionLabel="Review history"
                        onSecondaryAction={() => navigate("/dashboard/inspection-history")}
                    />

                    <button
                        type="button"
                        className="dashboard-button dashboard-button--ghost dashboard-button--full"
                        onClick={handleUpload}
                        disabled={loading || !selectedFile}
                    >
                        Continue to analysis
                        <ArrowRight size={16} />
                    </button>
                </aside>
            </div>
        </div>
    );
}

export default UploadInspection;