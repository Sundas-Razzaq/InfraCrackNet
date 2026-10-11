import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getInspectors } from "../../api/userApi";
import { getApiErrorMessage } from "../../api/authApi";

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

        assignedInspectors: (
            initialData.assignedInspectors || []
        ).map((inspector) =>
            typeof inspector === "string"
                ? inspector
                : inspector._id
        ),
    });

    const [loading, setLoading] = useState(false);

    //  inspector list state
    const [inspectors, setInspectors] = useState([]);
    const [inspectorsLoading, setInspectorsLoading] =
        useState(true);

    //  fetch inspectors on mount
    useEffect(() => {
        const fetchInspectors = async () => {
            try {
                const response = await getInspectors();
                setInspectors(response.data || []);
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load inspectors."
                    )
                );
            } finally {
                setInspectorsLoading(false);
            }
        };

        fetchInspectors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // toggle one inspector in/out of the array
    const handleInspectorToggle = (inspectorId) => {
        setFormData((prev) => {
            const alreadySelected =
                prev.assignedInspectors.includes(inspectorId);

            return {
                ...prev,
                assignedInspectors: alreadySelected
                    ? prev.assignedInspectors.filter(
                        (id) => id !== inspectorId
                    )
                    : [
                        ...prev.assignedInspectors,
                        inspectorId,
                    ],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        //  enforce at least one inspector
        if (formData.assignedInspectors.length === 0) {
            toast.error(
                "Please assign at least one inspector to the project."
            );
            return;
        }

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
                        <option value="Bridge">Bridge</option>
                        <option value="Building">Building</option>
                        <option value="Road">Road</option>
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
                        <option value="Critical">Critical</option>
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
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

            </div>

            {/*  Inspector picker */}
            <div className="form-group project-form-inspectors">
                <label className="form-label">
                    Assign Inspectors
                </label>

                <p className="form-hint">
                    Select one or more inspectors who will work on
                    this project. They will see the project in their
                    dashboard and will be able to create inspections
                    for it.
                </p>

                {inspectorsLoading ? (
                    <p className="form-hint">Loading inspectors...</p>
                ) : inspectors.length === 0 ? (
                    <p className="form-hint">
                        No inspectors available. An admin must create
                        Inspector accounts first.
                    </p>
                ) : (
                    <div className="inspector-picker">
                        {inspectors.map((inspector) => {
                            const isSelected =
                                formData.assignedInspectors.includes(
                                    inspector._id
                                );

                            return (
                                <label
                                    key={inspector._id}
                                    className={`inspector-picker-item ${isSelected ? "is-selected" : ""
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() =>
                                            handleInspectorToggle(
                                                inspector._id
                                            )
                                        }
                                        disabled={loading}
                                    />

                                    <div className="inspector-picker-info">
                                        <span className="inspector-picker-name">
                                            {inspector.name}
                                        </span>
                                        <span className="inspector-picker-email">
                                            {inspector.email}
                                        </span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="project-form-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || inspectorsLoading}
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