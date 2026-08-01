import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

const EmptyInspectionState = () => {
    const navigate = useNavigate();

    return (
        <div className="empty-inspections-state">
            <div className="empty-inspections-content">


                <h2 className="empty-inspections-title">
                    No Inspections Found
                </h2>

                <p className="empty-inspections-description">
                    You haven't created any inspections yet.
                    Start your first infrastructure inspection
                    to begin capturing images and analyzing
                    structural defects.
                </p>

                <div className="empty-inspections-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate(
                                "/dashboard/inspection/new"
                            )
                        }
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="inspection-btn-icon"
                        />
                        Start Inspection
                    </button>

                </div>
            </div>
        </div>
    );
};

export default EmptyInspectionState;