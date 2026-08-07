import { useState } from "react";

const crackClasses = [
    "Longitudinal",
    "Transverse",
    "Diagonal",
    "Alligator",
    "Pothole",
    "Surface",
    "Other",
];

const severityLevels = [
    "Low",
    "Medium",
    "High",
    "Critical",
];

const buildFormData = (crack = {}) => ({
    crackClass: crack.crackClass || "",
    severity: crack.severity || "",
    reviewedSeverity:
        crack.reviewedSeverity ||
        crack.severity ||
        "",
    width: crack.width || "",
    length: crack.length || "",
    area: crack.area || "",
    reviewComments:
        crack.reviewComments || "",
});

const CrackEditorModal = ({
    crack,
    isOpen,
    isSaving,
    onClose,
    onSave,
    onRemove,
}) => {
    const [formData, setFormData] = useState(() =>
        buildFormData(crack)
    );

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave(
            crack._id,
            {
                ...formData,
                width: Number(formData.width),
                length: Number(formData.length),
                area: Number(formData.area),
            }
        );
    };

    if (!isOpen || !crack) return null;

    return (
        <div className="annotation-modal-overlay">

            <div className="annotation-modal">

                <div className="annotation-modal-header">

                    <h2>Edit Crack</h2>

                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Crack Type
                        </label>

                        <select
                            name="crackClass"
                            value={formData.crackClass}
                            onChange={handleChange}
                        >
                            {crackClasses.map(
                                (type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            AI Severity
                        </label>

                        <select
                            name="severity"
                            value={formData.severity}
                            onChange={handleChange}
                        >
                            {severityLevels.map(
                                (level) => (
                                    <option
                                        key={level}
                                        value={level}
                                    >
                                        {level}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            Reviewed Severity
                        </label>

                        <select
                            name="reviewedSeverity"
                            value={
                                formData.reviewedSeverity
                            }
                            onChange={handleChange}
                        >
                            {severityLevels.map(
                                (level) => (
                                    <option
                                        key={level}
                                        value={level}
                                    >
                                        {level}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Width (mm)
                            </label>

                            <input
                                type="number"
                                name="width"
                                value={formData.width}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Length (mm)
                            </label>

                            <input
                                type="number"
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>
                            Area (mm²)
                        </label>

                        <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Review Comments
                        </label>

                        <textarea
                            rows={4}
                            name="reviewComments"
                            value={
                                formData.reviewComments
                            }
                            onChange={handleChange}
                        />

                    </div>

                    <div className="annotation-modal-actions">

                        <button
                            type="button"
                            className="btn btn-danger"
                            disabled={isSaving}
                            onClick={() => onRemove(crack._id)}
                        >
                            Remove Crack
                        </button>

                        <div className="modal-right-actions">

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
                                    : "Save Changes"}
                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CrackEditorModal;