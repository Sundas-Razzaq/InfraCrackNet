import AssignmentSection from "./AssignmentSection";
import InspectionActions from "./InspectionActions";
import ProjectSelector from "./ProjectSelector";

const InspectionForm = ({
    formData,
    errors = {},
    projects = [],
    loadingProjects = false,
    isProjectLocked = false,
    isSubmitting = false,
    onChange,
    onSubmit,
    onSaveDraft,
}) => {
    return (
        <form
            className="inspection-form"
            onSubmit={onSubmit}
        >
            <div className="inspection-form-card">
                <ProjectSelector
                    projects={projects}
                    value={formData.project}
                    onChange={onChange}
                    loading={loadingProjects}
                    disabled={isProjectLocked}
                    error={errors.project}
                />

                <div className="inspection-form-grid">
                    <div className="form-group">
                        <label className="form-label">
                            Inspection Type{" "}
                            <span className="required">*</span>
                        </label>

                        <select
                            name="inspectionType"
                            value={formData.inspectionType}
                            onChange={onChange}
                            className={
                                errors.inspectionType
                                    ? "input-error"
                                    : ""
                            }
                        >
                            <option value="">
                                Select inspection type
                            </option>

                            <option value="Routine">
                                Routine
                            </option>

                            <option value="Emergency">
                                Emergency
                            </option>

                            <option value="Maintenance">
                                Maintenance
                            </option>

                            <option value="Follow-up">
                                Follow-up
                            </option>
                        </select>

                        {errors.inspectionType && (
                            <p className="form-error">
                                {errors.inspectionType}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Priority{" "}
                            <span className="required">*</span>
                        </label>

                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={onChange}
                        >
                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>

                            <option value="Critical">
                                Critical
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Structure Area{" "}
                            <span className="required">*</span>
                        </label>

                        <input
                            type="text"
                            name="structureArea"
                            value={formData.structureArea}
                            onChange={onChange}
                            placeholder="Enter structure area"
                        />

                        {errors.structureArea && (
                            <p className="form-error">
                                {errors.structureArea}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            GPS Location{" "}
                            <span className="required">*</span>
                        </label>

                        <input
                            type="text"
                            name="gpsLocation"
                            value={formData.gpsLocation}
                            onChange={onChange}
                            placeholder="Enter GPS location"
                        />

                        {errors.gpsLocation && (
                            <p className="form-error">
                                {errors.gpsLocation}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Weather{" "}
                            <span className="required">*</span>
                        </label>

                        <input
                            type="text"
                            name="weather"
                            value={formData.weather}
                            onChange={onChange}
                            placeholder="Enter weather condition"
                        />

                        {errors.weather && (
                            <p className="form-error">
                                {errors.weather}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Scheduled Date
                        </label>

                        <input
                            type="date"
                            name="scheduledDate"
                            value={formData.scheduledDate}
                            onChange={onChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Inspection Date
                        </label>

                        <input
                            type="date"
                            name="inspectionDate"
                            value={formData.inspectionDate}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Field Notes
                    </label>

                    <textarea
                        name="fieldNotes"
                        rows={5}
                        value={formData.fieldNotes}
                        onChange={onChange}
                        placeholder="Enter any observations or notes..."
                    />
                </div>

                <AssignmentSection />

                <InspectionActions
                    onSaveDraft={onSaveDraft}
                    isSubmitting={isSubmitting}
                />
            </div>
        </form>
    );
};

export default InspectionForm;