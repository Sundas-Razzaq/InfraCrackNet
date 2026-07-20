import { useState } from "react";

const ProjectForm = ({
    mode = "create",
    initialData = {},
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        description: initialData.description || "",
        structureType: initialData.structureType || "",
        location: initialData.location || "",
        priority: initialData.priority || "Medium",
        status: initialData.status || "Active",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        try {
            setLoading(true);

            if (onSubmit) {
                await onSubmit(formData);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="project-form"
            onSubmit={handleSubmit}
        >
            <div className="project-form-grid">

                <div className="form-group">
                    <label className="form-label">
                        Project Name
                    </label>

                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter project name"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Description
                    </label>

                    <textarea
                        className="form-control form-textarea"
                        name="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the project..."
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Structure Type
                    </label>

                    <select
                        className="form-control form-select"
                        name="structureType"
                        value={formData.structureType}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">
                            Select structure type
                        </option>

                        <option value="Bridge">
                            Bridge
                        </option>

                        <option value="Building">
                            Building
                        </option>

                        <option value="Road">
                            Road
                        </option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Location
                    </label>

                    <input
                        className="form-control"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter location"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Priority
                    </label>

                    <select
                        className="form-control form-select"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">
                            Critical
                        </option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Status
                    </label>

                    <select
                        className="form-control form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="Active">
                            Active
                        </option>

                        <option value="On Hold">
                            On Hold
                        </option>

                        <option value="Completed">
                            Completed
                        </option>
                    </select>
                </div>

            </div>

            <div className="project-form-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : mode === "create"
                            ? "Create Project"
                            : "Update Project"}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;