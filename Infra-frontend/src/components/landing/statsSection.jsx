import { motion } from "framer-motion";
import { container, fadeInUp, sectionViewport } from "../../utils/landingMotion";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const defaultStats = [
    {
        value: "99.2%",
        label: "Detection Accuracy",
    },
    {
        value: "30ms",
        label: "Processing Latency",
    },
    {
        value: "15k+",
        label: "Inspections Completed",
    },
];

function StatsSection({ stats = defaultStats }) {
    return (
        <section className="landing-stats-section" aria-label="Platform performance metrics">
            <MotionDiv
                className="landing-stats-container"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={sectionViewport}
            >
                {stats.map((stat, index) => (
                    <MotionArticle
                        key={`${stat.value}-${stat.label}`}
                        className={`landing-stat-item ${index === stats.length - 1 ? "landing-stat-item-last" : ""}`}
                        variants={fadeInUp}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <p className="landing-stat-value">{stat.value}</p>
                        <p className="landing-stat-label">{stat.label}</p>
                    </MotionArticle>
                ))}
            </MotionDiv>
        </section>
    );
}

export default StatsSection;
