const ProjectSelector = ({
    projects = [],
    value = "",
    onChange,
    disabled = false,
    loading = false,
    error = "",
}) => {
    return (
        <div className="form-group">
            <label
                htmlFor="project"
                className="form-label"
            >
                Project <span className="required">*</span>
            </label>

            <select
                id="project"
                name="project"
                value={value}
                onChange={onChange}
                disabled={disabled || loading}
                className={error ? "input-error" : ""}
            >
                <option value="">
                    {loading
                        ? "Loading projects..."
                        : "Select a project"}
                </option>

                {projects.map((project) => (
                    <option
                        key={project._id}
                        value={project._id}
                    >
                        {project.projectCode} - {project.name}
                    </option>
                ))}
            </select>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default ProjectSelector;