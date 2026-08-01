import InspectionCard from "./inspectionCard";
import EmptyInspectionState from "./emptyInspectionState";

const InspectionGrid = ({
    inspections = [],
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="inspection-grid-loading">
                Loading inspections...
            </div>
        );
    }

    if (!loading && inspections.length === 0) {
        return <EmptyInspectionState />;
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