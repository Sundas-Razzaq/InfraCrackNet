import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faCubes,
    faLocationDot,
    faPen,
    faPlay,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import { Button, Card, Chip, Fact, Row } from "../dashboard/shared/DetailsKit";
import Person from "../admin/Person";
import StatusChip from "../admin/StatusChip";

import { useRole } from "../../utils/useRole";
import { formatDate } from "../../utils/adminFormat";

/*Shared project details for all roles. */
const ProjectDetails = ({
    project,
    teamInspectors = [],
    footprint = null,
    onStartInspection,
    onAssign,
    onUnassign,
    onDelete,
}) => {
    const navigate = useNavigate();
    const { isAdmin, isEngineer, isInspector } = useRole();

    const basePath = isAdmin ? "/dashboard/admin/projects" : "/dashboard/projects";
    const team = project.team;
    const lead = team?.engineerLead;

    return (
        <div className="dtl">
            <Link to={basePath} className="dtl-back">
                <FontAwesomeIcon icon={faChevronLeft} />
                All projects
            </Link>

            <header className="dtl-header">
                <div className="dtl-heading">
                    <h1 className="dtl-title">{project.name}</h1>

                    <div className="dtl-heading-meta">
                        <span className="dtl-code">{project.projectCode}</span>
                        <StatusChip value={project.status} />
                        <StatusChip value={project.priority} />
                    </div>
                </div>

                <div className="dtl-toolbar">
                    {isInspector && (
                        <Button variant="primary" icon={faPlay} onClick={onStartInspection}>
                            Start Inspection
                        </Button>
                    )}

                    {(isAdmin || isEngineer) && (
                        <Button icon={faPen} onClick={() => navigate(`${basePath}/${project._id}/edit`)}>
                            Edit Project
                        </Button>
                    )}

                    {isAdmin && (
                        <>
                            <span className="dtl-toolbar-sep" aria-hidden="true" />
                            <Button variant="danger" icon={faTrashCan} onClick={onDelete}>
                                Delete Project
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <div className="dtl-layout">
                <div className="dtl-main">
                    <Card title="Overview">
                        <p className={`dtl-prose ${project.description ? "" : "dtl-prose--empty"}`}>
                            {project.description || "No description added."}
                        </p>

                        <dl className="dtl-facts dtl-facts--2">
                            <Fact label="Structure type" icon={faCubes}>{project.structureType}</Fact>
                            <Fact label="Location" icon={faLocationDot}>{project.location}</Fact>
                        </dl>
                    </Card>

                    <Card title="Assigned team">
                        {team ? (
                            <dl className="dtl-rows">
                                <Row label="Team">
                                    {isAdmin ? (
                                        <Link to={`/dashboard/admin/teams/${team._id}`} className="dtl-link">
                                            {team.name}
                                        </Link>
                                    ) : (
                                        team.name
                                    )}
                                </Row>
                                {isAdmin && (
                                    <Row label="Team status"><StatusChip value={team.status} /></Row>
                                )}
                                <Row label="Assigned on">{formatDate(project.assignedAt)}</Row>
                                {isAdmin && <Row label="Assigned by">{project.assignedBy?.name}</Row>}
                            </dl>
                        ) : (
                            <>
                                <Chip tone="warning">Unassigned</Chip>
                                <p className="dtl-prose dtl-prose--empty">
                                    This project is outside the team workflow. Engineers and Inspectors cannot
                                    see it until a team is assigned.
                                </p>
                            </>
                        )}

                        {isAdmin && (
                            <div className="adm-card-actions">
                                <Button variant="primary" onClick={onAssign}>
                                    {team ? "Reassign team" : "Assign team"}
                                </Button>

                                {team && (
                                    <Button variant="secondary" onClick={onUnassign}>
                                        Unassign
                                    </Button>
                                )}
                            </div>
                        )}
                    </Card>

                    {team && (
                        <>
                            <Card title="Engineer lead">
                                {lead ? (
                                    <ul className="dtl-people">
                                        <Person name={lead.name} sub={lead.email} />
                                    </ul>
                                ) : (
                                    <p className="dtl-prose dtl-prose--empty">No lead assigned.</p>
                                )}
                            </Card>

                            <Card title={`Inspectors (${teamInspectors.length})`}>
                                {teamInspectors.length === 0 ? (
                                    <p className="dtl-prose dtl-prose--empty">
                                        No active inspectors in this team.
                                    </p>
                                ) : (
                                    <ul className="dtl-people">
                                        {teamInspectors.map((inspector) => (
                                            <Person
                                                key={inspector._id}
                                                name={inspector.name}
                                                sub={inspector.email}
                                            />
                                        ))}
                                    </ul>
                                )}
                            </Card>
                        </>
                    )}
                </div>

                <aside className="dtl-side">
                    {footprint && (
                        <Card title="Progress">
                            <dl className="dtl-rows">
                                <Row label="Inspections">{String(footprint.inspections)}</Row>
                                <Row label="Images / media">{String(footprint.images)}</Row>
                                <Row label="AI analyses">{String(footprint.analyses)}</Row>
                                <Row label="Reports">{String(footprint.reports)}</Row>
                            </dl>
                        </Card>
                    )}

                    <Card title="Project record">
                        <dl className="dtl-rows">
                            <Row label="Created by">{project.createdBy?.name}</Row>
                            <Row label="Created on">{formatDate(project.createdAt)}</Row>
                            <Row label="Last updated">{formatDate(project.updatedAt)}</Row>
                        </dl>

                        {isAdmin && (
                            <Link
                                to={`/dashboard/admin/activity-log?targetType=Project&targetId=${project._id}`}
                                className="dtl-link"
                            >
                                View activity
                            </Link>
                        )}
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default ProjectDetails;