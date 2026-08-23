import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { fadeInUp } from "../../../utils/animation";

function StatsCard({ title, value, icon, iconVariant = "primary", onClick }) {
    return (
        <motion.article
            className="stat-card"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onClick();
                        }
                    }
                    : undefined
            }
        >
            <div className="stat-card-content">
                <h3 className="stat-card-title">{title}</h3>
                <div className="stat-card-value">{value}</div>
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