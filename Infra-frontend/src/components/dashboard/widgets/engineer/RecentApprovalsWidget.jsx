import WidgetCard from "../../shared/widgetCard";
import StatusBadge from "../../cards/statusBadge";
import { motion } from "framer-motion";
import {
    staggerContainer,
    fadeInUp,
} from "../../../../utils/animation";

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
            <motion.ul className="approval-list"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {approvals.map((approval) => (
                    <motion.li key={`${approval.projectName}-${approval.approvalDate}`} className="approval-item" variants={fadeInUp}>
                        <div className="approval-info">
                            <div className="approval-project">{approval.projectName}</div>
                            <div className="approval-engineer">{approval.engineer}</div>
                        </div>

                        <StatusBadge text={approval.status.text} variant={approval.status.variant} />
                        <time className="approval-date" dateTime={approval.approvalDate}>
                            {approval.approvalDate}
                        </time>
                    </motion.li>
                ))}
            </motion.ul>
        </WidgetCard>
    );
}

export default RecentApprovalsWidget;