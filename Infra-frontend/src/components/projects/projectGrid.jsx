import { useEffect, useState } from "react";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

import { getProjects } from "../../api/projectApi";

import ProjectCard from "./projectCard";
import EmptyState from "../dashboard/shared/EmptyState";

const ProjectGrid = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                setProjects(response.data || []);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return <div className="projects-loading">Loading projects...</div>;
    }

    if (projects.length === 0) {
        return (
            <EmptyState
                icon={faFolderOpen}
                title="No Assigned Projects"
                message="Your team has no projects yet. Projects appear here once an Admin assigns them to your team."
            />
        );
    }

    return (
        <div className="projects-container">
            <div className="projects-grid">
                {projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default ProjectGrid;