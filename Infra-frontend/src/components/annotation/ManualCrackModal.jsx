import { useState } from "react";

const buildFormData = () => ({
    crackClass: "Longitudinal",
    severity: "Medium",
    width: "",
    length: "",
    area: "",
    reviewComments: "",
});

const ManualCrackModal = ({
    isOpen,
    images,
    selectedImage,
    analysisId,
    isSaving,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState(() =>
        buildFormData()
    );

    const [selectedImageId, setSelectedImageId] = useState(
        selectedImage?._id || ""
    );

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            analysis: analysisId,
            inspectionImage: selectedImageId,

            crackClass: formData.crackClass,
            severity: formData.severity,

            width: Number(formData.width),
            length: Number(formData.length),
            area: Number(formData.area),

            reviewComments: formData.reviewComments,

            // Temporary bounding box
            // Will later come from drawing on canvas.
            boundingBox: {
                x: 0,
                y: 0,
                width: 100,
                height: 100,
            },
        });
    };

    return (
        <div className="annotation-modal-overlay">
            <div className="annotation-modal">

                <div className="annotation-modal-header">
                    <h2>Add Manual Crack</h2>

                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Inspection Image</label>

                        <select
                            name="inspectionImage"
                            value={selectedImageId}
                            onChange={(e) =>
                                setSelectedImageId(e.target.value)
                            }
                            required
                        >
                            {images.map((imageItem, index) => (
                                <option
                                    key={imageItem._id}
                                    value={imageItem._id}
                                >
                                    Image {index + 1}
                                    {imageItem.originalName
                                        ? ` — ${imageItem.originalName}`
                                        : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Crack Class</label>

                        <select
                            name="crackClass"
                            value={formData.crackClass}
                            onChange={handleChange}
                        >
                            <option>Longitudinal</option>
                            <option>Transverse</option>
                            <option>Diagonal</option>
                            <option>Alligator</option>
                            <option>Pothole</option>
                            <option>Surface</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Severity</label>

                        <select
                            name="severity"
                            value={formData.severity}
                            onChange={handleChange}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Width (mm)</label>

                            <input
                                type="number"
                                step="0.01"
                                name="width"
                                value={formData.width}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Length (mm)</label>

                            <input
                                type="number"
                                step="0.01"
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Area (mm²)</label>

                            <input
                                type="number"
                                step="0.01"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-group">

                        <label>Review Comments</label>

                        <textarea
                            rows="4"
                            name="reviewComments"
                            value={formData.reviewComments}
                            onChange={handleChange}
                            placeholder="Optional comments..."
                        />

                    </div>

                    <div className="annotation-modal-actions">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSaving}
                        >
                            {isSaving
                                ? "Saving..."
                                : "Add Crack"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default ManualCrackModal;