import { useState } from "react";

import { useTeamOptions } from "../../../utils/useTeamOptions";

const ASSIGNABLE_TEAMS = { status: "Active", hasLead: true };

const AdminProjectForm = ({ mode = "create", initialData = {}, onSubmit, onCancel }) => {
    const isCreate = mode === "create";

    const [formData, setFormData] = useState({
        name: initialData.name || "",
        description: initialData.description || "",
        structureType: initialData.structureType || "",
        location: initialData.location || "",
        priority: initialData.priority || "Medium",
        status: initialData.status || "Active",
        teamId: "",
    });
    const [loading, setLoading] = useState(false);

    // Only needed when creating: the team can be picked right away .
    const { teams, loading: teamsLoading } = useTeamOptions(ASSIGNABLE_TEAMS);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loading) return;

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            structureType: formData.structureType,
            location: formData.location.trim(),
            priority: formData.priority,
            status: formData.status,
        };

        if (isCreate && formData.teamId) payload.teamId = formData.teamId;

        setLoading(true);

        try {
            await onSubmit(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="project-form" onSubmit={handleSubmit}>
            <div className="project-form-grid">
                <div className="form-group">
                    <label className="form-label">Project Name</label>
                    <input
                        className="form-control"
                        name="name"
                        maxLength={100}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter project name"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control form-textarea"
                        name="description"
                        rows="5"
                        maxLength={1000}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the project..."
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Structure Type</label>
                    <select
                        className="form-control form-select"
                        name="structureType"
                        value={formData.structureType}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select structure type</option>
                        <option value="Bridge">Bridge</option>
                        <option value="Building">Building</option>
                        <option value="Road">Road</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                        className="form-control"
                        name="location"
                        maxLength={200}
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter location"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Priority</label>
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
                    <label className="form-label">Status</label>
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

            {isCreate ? (
                <div className="form-group project-form-inspectors">
                    <label className="form-label">Assign Team (optional)</label>
                    <p className="form-hint">
                        Only one team can work on a project. Leave empty to create it as Unassigned and
                        assign a team later. Only active teams with an Engineer lead are listed.
                    </p>

                    <select
                        className="form-control form-select"
                        name="teamId"
                        value={formData.teamId}
                        onChange={handleChange}
                        disabled={loading || teamsLoading}
                    >
                        <option value="">{teamsLoading ? "Loading teams..." : "Unassigned"}</option>
                        {teams.map((team) => (
                            <option key={team._id} value={team._id}>
                                {team.name} (Lead: {team.engineerLead?.name || "-"})
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <p className="form-hint">
                    The assigned team is managed from the project details page.
                </p>
            )}

            <div className="project-form-actions">
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : isCreate ? "Create Project" : "Save Changes"}
                </button>
            </div>
        </form>
    );
};

export default AdminProjectForm;