import icon1 from "../../assets/icons/landingPage/icon-1.png";
import icon2 from "../../assets/icons/landingPage/Icon-2.png";
import icon3 from "../../assets/icons/landingPage/icon-3.png";
import icon4 from "../../assets/icons/landingPage/Icon-4.png";

const defaultSteps = [
    {
        id: "upload",
        icon: icon1,
        title: "Upload Image",
        description: "Sync drone footage or mobile captures directly to our secure cloud.",
    },
    {
        id: "detect",
        icon: icon2,
        title: "AI Detects",
        description: "Advanced CV algorithms segment and isolate every crack instance.",
    },
    {
        id: "analyze",
        icon: icon3,
        title: "Analyze",
        description: "Review measurement data and risk classifications in our workspace.",
    },
    {
        id: "download",
        icon: icon4,
        title: "Download Report",
        description: "Get a compliant audit report ready for engineering sign-off.",
    },
];

function WorkFlowSection({ title = "The Scanning Workflow", steps = defaultSteps }) {
    return (
        <section className="landing-workflow-section" aria-labelledby="landing-workflow-title" id="workflow">
            <div className="landing-workflow-container">
                <header className="landing-workflow-header">
                    <h2 id="landing-workflow-title" className="landing-workflow-title">
                        {title}
                    </h2>
                </header>

                <div className="landing-workflow-track" aria-hidden="true" />

                <div className="landing-workflow-grid">
                    {steps.map((step) => (
                        <article className="landing-workflow-step" key={step.id}>
                            <div className="landing-workflow-icon-wrap">
                                <img src={step.icon} alt="" className="landing-workflow-icon" />
                            </div>
                            <h3 className="landing-workflow-step-title">{step.title}</h3>
                            <p className="landing-workflow-step-description">{step.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WorkFlowSection;
