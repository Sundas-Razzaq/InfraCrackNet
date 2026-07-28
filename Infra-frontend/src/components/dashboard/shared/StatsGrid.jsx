import { motion } from "framer-motion";
import { staggerContainer } from "../../../utils/animation";

function StatsGrid({ children }) {
    return (
        <motion.div
            className="stats-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
}

export default StatsGrid;