import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolderOpen,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { getProjects } from "../../api/projectApi";

import ProjectCard from "./projectCard";
import EmptyState from "../dashboard/shared/EmptyState";

const ProjectGrid = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

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
        return (
            <EmptyState
                icon={faFolderOpen}
                title="No Projects Found"
                message="You haven't created any infrastructure inspection projects yet. Create your first project to get started."
                actionLabel="Create Project"
                actionIcon={faPlus}
                onAction={() =>
                    navigate("/dashboard/projects/new")
                }
            />
        );
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