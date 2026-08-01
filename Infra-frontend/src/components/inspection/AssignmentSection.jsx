const AssignmentSection = () => {
    return (
        <div className="assignment-section">
            <div className="assignment-section-header">
                <h3>Team Assignment</h3>
                <p>
                    Assign engineers and inspectors to this inspection.
                </p>
            </div>

            <div className="assignment-grid">
                <div className="form-group">
                    <label
                        htmlFor="assignedEngineers"
                        className="form-label"
                    >
                        Assigned Engineers
                    </label>

                    <select
                        id="assignedEngineers"
                        name="assignedEngineers"
                        multiple
                        disabled
                    >
                        <option>
                            Available after Team Management is configured.
                        </option>
                    </select>

                    <p className="form-hint">
                        Engineers will be selected from your project team.
                    </p>
                </div>

                <div className="form-group">
                    <label
                        htmlFor="assignedInspectors"
                        className="form-label"
                    >
                        Assigned Inspectors
                    </label>

                    <select
                        id="assignedInspectors"
                        name="assignedInspectors"
                        multiple
                        disabled
                    >
                        <option>
                            Available after Team Management is configured.
                        </option>
                    </select>

                    <p className="form-hint">
                        Inspectors will be selected from your project team.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AssignmentSection;