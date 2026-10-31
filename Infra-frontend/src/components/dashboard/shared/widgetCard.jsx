import { motion } from "framer-motion";

import { scaleIn } from "../../../utils/animation";

function WidgetCard({ title, children, headerAction, onClick, hasError = false }) {
    return (
        <motion.div
            className={`widget-card ${onClick ? "clickable" : ""}`}
            variants={scaleIn}
            onClick={onClick}
        >
            <div className="widget-card-header">
                <h3 className="widget-card-title">
                    {title}
                </h3>

                {headerAction && (
                    <div className="widget-card-action">
                        {headerAction}
                    </div>
                )}
            </div>

            <div className="widget-card-body">
                {hasError ? (
                    <p className="form-error">
                        Could not load this section. Please refresh the page.
                    </p>
                ) : (
                    children
                )}
            </div>
        </motion.div>
    );
}

export default WidgetCard;