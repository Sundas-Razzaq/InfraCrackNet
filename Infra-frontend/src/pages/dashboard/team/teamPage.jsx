import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faFolderOpen,
    faPause,
    faPeopleGroup,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import StatsGrid from "../../../components/dashboard/shared/StatsGrid";
import StatsCard from "../../../components/dashboard/cards/StatsCard";
import EmptyState from "../../../components/dashboard/shared/EmptyState";
import { Card, Chip, Row } from "../../../components/dashboard/shared/DetailsKit";
import Person from "../../../components/admin/Person";
import StatusChip from "../../../components/admin/StatusChip";

import { getMyTeam } from "../../../api/teamApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { useAuth } from "../../../context/useAuth";
import { formatDate } from "../../../utils/adminFormat";

// Read-only view of the logged-in user's OWN team.
const TeamPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const myId = user?._id || user?.id;

    const [team, setTeam] = useState(null);
    const [inspectors, setInspectors] = useState([]);
    const [projects, setProjects] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const res = await getMyTeam();
                if (cancelled) return;
                setTeam(res.data);
                setInspectors(res.inspectors || []);
                setProjects(res.projects);
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load your team."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) return <div className="page-loading">Loading team...</div>;
    if (error) return <div className="page-loading">{error}</div>;

    if (!team) {
        return (
            <div className="dtl">
                <PageHeader title="My Team" subtitle="Your team, its lead and inspectors." />
                <EmptyState
                    icon={faPeopleGroup}
                    title="No Team Yet"
                    message="You are not part of a team yet. An Admin needs to add you to a team, then it will appear here."
                />
            </div>
        );
    }

    const lead = team.engineerLead;
    const memberCount = inspectors.length + (lead ? 1 : 0);

    return (
        <div className="dtl">
            <PageHeader title="My Team" subtitle="Your team, its lead and inspectors." />

            <section className="team-hero">
                <span className="team-hero-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faPeopleGroup} />
                </span>

                <div className="team-hero-body">
                    <h2 className="team-hero-name">{team.name}</h2>
                    <div className="dtl-heading-meta">
                        <StatusChip value={team.status} />
                    </div>
                    <p className="team-hero-desc">
                        {team.description || "No description added."}
                    </p>
                </div>
            </section>

            <StatsGrid>
                <StatsCard
                    title="Inspectors"
                    value={inspectors.length}
                    icon={faUsers}
                    iconVariant="primary"
                />
                <StatsCard
                    title="Active Projects"
                    value={projects?.active ?? 0}
                    icon={faFolderOpen}
                    iconVariant="success"
                    onClick={() => navigate("/dashboard/projects")}
                />
                <StatsCard
                    title="On Hold"
                    value={projects?.onHold ?? 0}
                    icon={faPause}
                    iconVariant="warning"
                />
                <StatsCard
                    title="Completed"
                    value={projects?.completed ?? 0}
                    icon={faCircleCheck}
                    iconVariant="info"
                />
            </StatsGrid>

            <div className="dtl-layout">
                <div className="dtl-main">
                    <Card title="Engineer lead">
                        {lead ? (
                            <ul className="dtl-people">
                                <Person name={lead.name} sub={lead.email}>
                                    {lead._id === myId && <Chip tone="info">You</Chip>}
                                    {lead.isActive === false && <Chip tone="neutral">Inactive</Chip>}
                                </Person>
                            </ul>
                        ) : (
                            <p className="dtl-prose dtl-prose--empty">No lead assigned yet.</p>
                        )}
                    </Card>

                    <Card title={`Inspectors (${inspectors.length})`}>
                        {inspectors.length === 0 ? (
                            <p className="dtl-prose dtl-prose--empty">
                                No active inspectors in this team yet.
                            </p>
                        ) : (
                            <ul className="dtl-people">
                                {inspectors.map((inspector) => (
                                    <Person key={inspector._id} name={inspector.name} sub={inspector.email}>
                                        {inspector._id === myId && <Chip tone="info">You</Chip>}
                                    </Person>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>

                <aside className="dtl-side">
                    <Card title="Team summary">
                        <dl className="dtl-rows">
                            <Row label="Members">{String(memberCount)}</Row>
                            <Row label="Total projects">{String(projects?.total ?? 0)}</Row>
                            <Row label="Created">{formatDate(team.createdAt)}</Row>
                        </dl>
                        <Link to="/dashboard/projects" className="dtl-link">
                            View team projects
                        </Link>
                    </Card>

                    <Card title="Need a change?">
                        <p className="dtl-prose">
                            Team membership is managed by an Admin. Contact your Admin to add or remove members.
                        </p>
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default TeamPage;