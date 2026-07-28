import { motion } from "framer-motion";
import { pageTransition } from "../../utils/animation";

const PageTransition = ({ children, className = "" }) => {
    return (
        <motion.div
            className={className}
            variants={pageTransition}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;