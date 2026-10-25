import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlask } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_TEXT =
    "AI analysis is simulated. Results are for demonstration and are not real AI output.";

const AiSimulatedBanner = ({ aiMode = "simulated", disclaimer }) => {
    if (aiMode === "real") return null;

    return (
        <div className="adm-banner" role="note">
            <FontAwesomeIcon icon={faFlask} />
            <span>
                <strong>Simulated AI.</strong> {disclaimer || DEFAULT_TEXT}
            </span>
        </div>
    );
};

export default AiSimulatedBanner;