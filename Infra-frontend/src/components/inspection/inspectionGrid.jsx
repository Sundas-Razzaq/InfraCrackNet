import { useNavigate } from "react-router-dom";
import {
    faClipboardList,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

import InspectionCard from "./InspectionCard";
import EmptyState from "../dashboard/shared/EmptyState";

const InspectionGrid = ({
    inspections = [],
    loading = false,
}) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="inspection-grid-loading">
                Loading inspections...
            </div>
        );
    }

    if (!loading && inspections.length === 0) {
        return (
            <EmptyState
                icon={faClipboardList}
                title="No Inspections Found"
                message="You haven't created any inspections yet. Start your first infrastructure inspection to begin capturing images and analyzing structural defects."
                actionLabel="Start Inspection"
                actionIcon={faPlus}
                onAction={() =>
                    navigate("/dashboard/inspection/new")
                }
            />
        );
    }

    return (
        <div className="inspection-grid">
            {inspections.map((inspection) => (
                <InspectionCard
                    key={inspection._id}
                    inspection={inspection}
                />
            ))}
        </div>
    );
};

export default InspectionGrid;