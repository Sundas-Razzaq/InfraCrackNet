import { useEffect, useState } from "react";

import { getProjects } from "../../api/projectApi";

import ProjectCard from "./projectCard";
import EmptyProjects from "./emptyProject";

const ProjectGrid = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();

                setProjects(response.data || []);
            } catch (error) {
                console.error(
                    "Failed to fetch projects:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="projects-loading">
                Loading projects...
            </div>
        );
    }

    if (projects.length === 0) {
        return <EmptyProjects />;
    }

    return (
        <div className="projects-container">
            <div className="projects-grid">
                {projects.map((project) => (
                    <ProjectCard
                        key={project._id}
                        project={project}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectGrid;