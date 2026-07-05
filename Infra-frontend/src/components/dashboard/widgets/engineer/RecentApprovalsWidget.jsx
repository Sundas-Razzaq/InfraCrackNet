import WidgetCard from "../../shared/widgetCard";
import StatusBadge from "../../cards/statusBadge";

function RecentApprovalsWidget() {
    const approvals = [
        {
            projectName: "Bridge Tower C",
            engineer: "Sundas Razzaq",
            approvalDate: "24 May",
            status: { text: "Complete", variant: "success" },
        },
        {
            projectName: "Road Crossing",
            engineer: "Ahsan Ali",
            approvalDate: "23 May",
            status: { text: "Pending", variant: "warning" },
        },
        {
            projectName: "Retaining Wall",
            engineer: "Hira Khan",
            approvalDate: "22 May",
            status: { text: "Approved", variant: "primary" },
        },
        {
            projectName: "Motorway Pillar",
            engineer: "Bilal Ahmed",
            approvalDate: "21 May",
            status: { text: "Complete", variant: "success" },
        },
    ];

    return (
        <WidgetCard title="Recent Approvals">
            <ul className="approval-list">
                {approvals.map((approval) => (
                    <li key={`${approval.projectName}-${approval.approvalDate}`} className="approval-item">
                        <div className="approval-info">
                            <div className="approval-project">{approval.projectName}</div>
                            <div className="approval-engineer">{approval.engineer}</div>
                        </div>

                        <StatusBadge text={approval.status.text} variant={approval.status.variant} />
                        <time className="approval-date" dateTime={approval.approvalDate}>
                            {approval.approvalDate}
                        </time>
                    </li>
                ))}
            </ul>
        </WidgetCard>
    );
}

export default RecentApprovalsWidget;