import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProjectForm from "../../../components/projects/projectForm";

import {
    getProjectById,
    updateProject,
} from "../../../api/projectApi";

const EditProjectPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);

    useEffect(() => {

        const fetchProject = async () => {

            try {

                const response =
                    await getProjectById(id);

                setProject(response.data);

            } catch (error) {

                console.error(error);

            }

        };

        fetchProject();

    }, [id]);

    const handleUpdateProject = async (
        formData
    ) => {

        try {
            console.log(formData);
            console.log(id);

            await updateProject(id, formData);

            navigate(`/dashboard/projects/${id}`);

        } catch (error) {

            console.error(
                "Failed to update project:",
                error
            );

        }

    };

    if (!project) {

        return <p>Loading...</p>;

    }

    return (

        <div className="edit-project-page">

            <ProjectForm
                mode="edit"
                initialData={project}
                onSubmit={handleUpdateProject}
            />

        </div>

    );

};

export default EditProjectPage;