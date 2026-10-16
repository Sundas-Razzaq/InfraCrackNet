import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faCalendarDays,
    faUserTie,
    faPlay,
    faPen,
    faTrashCan,
    faCubes,
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useRole } from "../../utils/useRole";
import { Button, Card, Chip, Fact, Row } from "../dashboard/shared/DetailsKit";

const initialsOf = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "?";

const ProjectDetails = ({ project, onDelete, onStartInspection }) => {
    const navigate = useNavigate();
    const { isEngineer, isInspector } = useRole();

    if (!project) {
        return (
            <div className="project-details-empty">
                Project not found.
            </div>
        );
    }

    const inspectors = project.assignedInspectors || [];

    return (
        <div className="dtl">
            <Link to="/dashboard/projects" className="dtl-back">
                <FontAwesomeIcon icon={faChevronLeft} />
                All projects
            </Link>

            <header className="dtl-header">
                <div className="dtl-heading">
                    <h1 className="dtl-title">{project.name}</h1>

                    <div className="dtl-heading-meta">
                        <span className="dtl-code">{project.projectCode}</span>
                        <Chip>{project.status}</Chip>
                        <Chip>{project.priority}</Chip>
                    </div>
                </div>

                <div className="dtl-toolbar">
                    {/* Start Inspection is Inspector-only */}
                    {isInspector && (
                        <Button
                            variant="primary"
                            icon={faPlay}
                            onClick={onStartInspection}
                        >
                            Start Inspection
                        </Button>
                    )}

                    {/* Edit Project is Engineer-only */}
                    {isEngineer && (
                        <Button
                            icon={faPen}
                            onClick={() =>
                                navigate(
                                    `/dashboard/projects/${project._id}/edit`
                                )
                            }
                        >
                            Edit Project
                        </Button>
                    )}

                    {/* Delete Project is Engineer-only */}
                    {isEngineer && (
                        <>
                            <span className="dtl-toolbar-sep" aria-hidden="true" />
                            <Button
                                variant="danger"
                                icon={faTrashCan}
                                onClick={onDelete}
                            >
                                Delete Project
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <div className="dtl-layout">
                <div className="dtl-main">
                    <Card title="Overview">
                        <p className="dtl-prose">
                            {project.description || "No description added."}
                        </p>

                        <dl className="dtl-facts dtl-facts--2">
                            <Fact label="Structure type" icon={faCubes}>
                                {project.structureType}
                            </Fact>

                            <Fact label="Location" icon={faLocationDot}>
                                {project.location}
                            </Fact>
                        </dl>
                    </Card>

                    {/* Inspectors section */}
                    {inspectors.length > 0 && (
                        <Card title="Assigned inspectors">
                            <ul className="dtl-people">
                                {inspectors.map((inspector) => (
                                    <li
                                        key={
                                            typeof inspector === "string"
                                                ? inspector
                                                : inspector._id
                                        }
                                        className="dtl-person"
                                    >
                                        <span
                                            className="dtl-avatar"
                                            aria-hidden="true"
                                        >
                                            {initialsOf(inspector.name)}
                                        </span>

                                        <span className="dtl-person-info">
                                            <span className="dtl-person-name">
                                                {inspector.name ||
                                                    "Unknown inspector"}
                                            </span>

                                            {inspector.email && (
                                                <span className="dtl-person-sub">
                                                    {inspector.email}
                                                </span>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}
                </div>

                <aside className="dtl-side">
                    <Card title="Project record">
                        <dl className="dtl-rows">
                            <Row label="Created by" icon={faUserTie}>
                                {project.createdBy?.name}
                            </Row>
                            <Row label="Created on" icon={faCalendarDays}>
                                {new Date(
                                    project.createdAt
                                ).toLocaleDateString()}
                            </Row>
                        </dl>
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default ProjectDetails;
