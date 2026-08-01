const steps = [
    "Select Project",
    "Upload Images",
    "AI Analysis",
    "Validate",
    "Report",
];

const InspectionStepper = ({ currentStep = 1 }) => {
    return (
        <div className="inspection-stepper">
            {steps.map((step, index) => {
                const stepNumber = index + 1;

                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <div
                        key={step}
                        className="inspection-step"
                    >
                        <div
                            className={`inspection-step-circle ${isCompleted
                                    ? "completed"
                                    : isActive
                                        ? "active"
                                        : ""
                                }`}
                        >
                            {stepNumber}
                        </div>

                        <span
                            className={`inspection-step-label ${isActive ? "active" : ""
                                }`}
                        >
                            {step}
                        </span>

                        {index !== steps.length - 1 && (
                            <div
                                className={`inspection-step-line ${isCompleted
                                        ? "completed"
                                        : ""
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default InspectionStepper;