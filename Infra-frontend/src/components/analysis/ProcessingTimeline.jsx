import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faSpinner,
    faCircle,
} from "@fortawesome/free-solid-svg-icons";

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
            "Classifying detected cracks by severity level.",
    },
    {
        title: "Structural risk assessment",
        description:
            "Calculating overall structural risk score.",
    },
    {
        title: "Compiling analysis",
        description:
            "Preparing final analysis results.",
    },
];

const ProcessingTimeline = ({
    currentStep,
}) => {
    const activeIndex =
        PROCESSING_STEPS.findIndex(
            (step) =>
                step.title === currentStep
        );

    return (
        <div className="processing-timeline">

            <h2 className="processing-title">
                AI Processing Timeline
            </h2>

            <div className="processing-list">

                {PROCESSING_STEPS.map(
                    (step, index) => {
                        const completed =
                            activeIndex > index;

                        const active =
                            activeIndex === index;

                        return (
                            <div
                                key={step.title}
                                className={`timeline-item ${completed
                                    ? "completed"
                                    : active
                                        ? "active"
                                        : ""
                                    }`}
                            >

                                <div className="timeline-marker">

                                    <FontAwesomeIcon
                                        icon={
                                            completed
                                                ? faCircleCheck
                                                : active
                                                    ? faSpinner
                                                    : faCircle
                                        }
                                        spin={active}
                                    />

                                </div>

                                <div className="timeline-content">

                                    <h4>
                                        {step.title}
                                    </h4>

                                    <p>
                                        {
                                            step.description
                                        }
                                    </p>

                                </div>

                            </div>
                        );
                    }
                )}

            </div>

        </div>
    );
};

export default ProcessingTimeline;