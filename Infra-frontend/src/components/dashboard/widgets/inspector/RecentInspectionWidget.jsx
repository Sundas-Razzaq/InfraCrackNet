import WidgetCard from "../../shared/widgetCard";
import StatusBadge from "../../cards/statusBadge";

function RecentInspectionWidget() {
    const recentInspections = [
        {
            id: "INS-2018",
            location: "Bridge Tower C",
            date: "24 May",
            status: {
                text: "Complete",
                variant: "success",
            },
            severity: {
                text: "Low",
                variant: "success",
            },
        },
        {
            id: "INS-2016",
            location: "Road Crossing",
            date: "23 May",
            status: {
                text: "Approved",
                variant: "primary",
            },
            severity: {
                text: "Medium",
                variant: "warning",
            },
        },
        {
            id: "INS-2015",
            location: "Retaining Wall",
            date: "22 May",
            status: {
                text: "Complete",
                variant: "success",
            },
            severity: {
                text: "High",
                variant: "danger",
            },
        },
        {
            id: "INS-2014",
            location: "Motorway Pillar",
            date: "21 May",
            status: {
                text: "Complete",
                variant: "success",
            },
            severity: {
                text: "Low",
                variant: "info",
            },
        },
    ];

    return (
        <WidgetCard title="Recent Inspections">
            <table className="inspection-table">

                <thead className="inspection-table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Location</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Severity</th>
                    </tr>
                </thead>

                <tbody className="inspection-table-body">
                    {recentInspections.map((inspection) => (
                        <tr
                            key={inspection.id}
                            className="inspection-row"
                        >
                            <td className="inspection-cell">
                                {inspection.id}
                            </td>

                            <td className="inspection-cell">
                                {inspection.location}
                            </td>

                            <td className="inspection-cell">
                                {inspection.date}
                            </td>

                            <td className="inspection-cell">
                                <StatusBadge
                                    text={inspection.status.text}
                                    variant={inspection.status.variant}
                                />
                            </td>

                            <td className="inspection-cell">
                                <StatusBadge
                                    text={inspection.severity.text}
                                    variant={inspection.severity.variant}
                                />
                            </td>

                        </tr>
                    ))}
                </tbody>

            </table>
        </WidgetCard>
    );
}

export default RecentInspectionWidget;