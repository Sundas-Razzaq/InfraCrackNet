import { motion } from "framer-motion";
import { slideLeft, slideRight } from "../../../utils/animation";

const PageHeader = ({
    title,
    subtitle,
    children,
    variant = "default",
}) => {
    if (variant === "dashboard") {
        return (
            <header className="dashboard-header">
                <motion.div
                    className="dashboard-header-left"
                    variants={slideLeft}
                    initial="hidden"
                    animate="visible"
                >
                    <h1 className="dashboard-title">
                        {title}
                    </h1>

                    <p className="dashboard-subtitle">
                        {subtitle}
                    </p>
                </motion.div>

                {children && (
                    <motion.div
                        className="dashboard-header-right"
                        variants={slideRight}
                        initial="hidden"
                        animate="visible"
                    >
                        {children}
                    </motion.div>
                )}
            </header>
        );
    }

    return (
        <div className="inspection-header">
            <div className="inspection-header-content">
                <div className="inspection-header-text">
                    <h1 className="inspection-title">
                        {title}
                    </h1>

                    <p className="inspection-subtitle">
                        {subtitle}
                    </p>
                </div>

                {children && (
                    <div className="inspection-header-actions">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;