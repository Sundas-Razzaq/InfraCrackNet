import ProgressCard from "./timelineStepCard";

const PROCESSING_STEPS = [
    {
        title: "Preparing images",
        description:
            "Normalizing and preprocessing uploaded inspection images.",
    },
    {
        title: "Running crack detection",
        description:
            "Detecting cracks using the AI detection model.",
    },
    {
        title: "Severity classification",
        description:
            "Classifying each detected crack by severity level.",
    },
    {
        title: "Structural risk assessment",
        description:
            "Calculating the overall structural risk score.",
    },
    {
        title: "Compiling analysis",
        description:
            "Preparing final analysis results and summary.",
    },
];

const ProcessingTimeline = ({ currentStep }) => {
    const activeIndex =
        PROCESSING_STEPS.findIndex(
            (step) => step.title === currentStep
        );

    return (
        <div className="processing-timeline">

            <h3 className="processing-timeline-title">
                AI Processing Timeline
            </h3>

            <div className="processing-timeline-list">

                {PROCESSING_STEPS.map(
                    (step, index) => (
                        <ProgressCard
                            key={step.title}
                            title={step.title}
                            description={
                                step.description
                            }
                            completed={
                                activeIndex !== -1 &&
                                index < activeIndex
                            }
                            active={
                                index === activeIndex
                            }
                        />
                    )
                )}

            </div>

        </div>
    );
};

export default ProcessingTimeline;