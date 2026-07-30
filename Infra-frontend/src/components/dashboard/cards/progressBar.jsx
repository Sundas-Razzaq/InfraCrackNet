import { motion } from "framer-motion";

function ProgressBar({ value, label, variant = "primary" }) {
    return (
        <div className="progress-item">
            <div className="progress-header">
                <span className="progress-label">{label}</span>
                <span className="progress-value">{value}%</span>
            </div>

            <div className="progress-track" aria-hidden="true">
                <motion.div
                    className={["progress-fill", variant].filter(Boolean).join(" ")}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={value}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                    viewport={{ once: true }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;
