import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import { Row } from "../../dashboard/shared/DetailsKit";

const ImpactSummary = ({ impact }) => (
    <div className="adm-stack">
        <dl className="dtl-rows">
            {impact.isLead && <Row label="Open projects">{String(impact.openProjects)}</Row>}
            <Row label="Open inspections">{String(impact.openInspections)}</Row>
            <Row label="Running analyses">{String(impact.runningAnalyses)}</Row>
            {impact.isLead && (
                <Row label="Awaiting validation">{String(impact.awaitingValidation)}</Row>
            )}
        </dl>

        {impact.blockers.map((text) => (
            <div key={text} className="adm-banner adm-banner--danger">
                <FontAwesomeIcon icon={faCircleXmark} />
                <span>{text}</span>
            </div>
        ))}

        {impact.notes.map((text) => (
            <div key={text} className="adm-banner">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <span>{text}</span>
            </div>
        ))}
    </div>
);

export default ImpactSummary;