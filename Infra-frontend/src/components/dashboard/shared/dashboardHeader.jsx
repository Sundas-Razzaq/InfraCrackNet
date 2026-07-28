import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { slideLeft, slideRight } from "../../../utils/animation";

function DashboardHeader({ user, subtitle, buttonText, onButtonClick }) {
    return (
        <header className="dashboard-header">

            <motion.div
                className="dashboard-header-left"
                variants={slideLeft}
                initial="hidden"
                animate="visible"
            >
                <h1 className="dashboard-title">
                    Good Morning, {user?.name?.split(" ")[0]}
                </h1>

                <p className="dashboard-subtitle">
                    {subtitle}
                </p>
            </motion.div>

            <motion.div
                className="dashboard-header-right"
                variants={slideRight}
                initial="hidden"
                animate="visible"
            >
                <button
                    type="button"
                    className="dashboard-action-btn"
                    onClick={onButtonClick}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>{buttonText}</span>
                </button>
            </motion.div>

        </header>
    );
}

export default DashboardHeader;