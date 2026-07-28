import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { fadeInUp } from "../../../utils/animation";

function StatsCard({ title, value, description, icon, iconVariant = "primary" }) {
    return (
        <motion.article
            className="stat-card"
            variants={fadeInUp}
        >
            <div className="stat-card-content">
                <h3 className="stat-card-title">{title}</h3>
                <div className="stat-card-value">{value}</div>
                <p className="stat-card-description">{description}</p>
            </div>

            <div
                className={["stat-card-icon", iconVariant].filter(Boolean).join(" ")}
                aria-hidden="true"
            >
                <FontAwesomeIcon icon={icon} />
            </div>
        </motion.article>
    );
}

export default StatsCard;