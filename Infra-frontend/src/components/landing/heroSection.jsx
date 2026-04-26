import heroBanner from "../../assets/images/landingPageImages/banner-1.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HeroSection({
    titleTop = "AI-Based",
    titleAccent = "Crack Detection",
    titleBottom = "for Infrastructure",
    badgeLabel = "NEXT-GEN INFRASTRUCTURE SAFETY",
    description =
    "Automate your structural health monitoring with high-precision computer vision. Real-time identification of concrete fatigue in buildings, bridges, and highways.",
    primaryCtaLabel = "Get Started",
    secondaryCtaLabel = "View Demo",
    secondaryCtaTargetId = "features",
    imageSrc = heroBanner,
    imageAlt = "Bridge structure with detected crack analysis overlays",
}) {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/signup");
    };

    const handleViewDemo = () => {
        const targetSection = document.getElementById(secondaryCtaTargetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="landing-hero-section" aria-labelledby="landing-hero-title">
            <div className="landing-hero-container">
                <motion.div className="landing-hero-content">
                    <motion.div
                        className="landing-hero-badge"
                        aria-hidden="true"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <span className="landing-hero-badge-dot" />
                        <span className="landing-hero-badge-label">{badgeLabel}</span>
                    </motion.div>

                    <motion.h1
                        id="landing-hero-title"
                        className="landing-hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <span className="landing-hero-title-primary">{titleTop}</span>
                        <span className="landing-hero-title-accent">{titleAccent}</span>
                        <span className="landing-hero-title-primary">{titleBottom}</span>
                    </motion.h1>

                    <motion.p
                        className="landing-hero-description"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    >
                        {description}
                    </motion.p>

                    <motion.div
                        className="landing-hero-actions"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                    >
                        <motion.button
                            type="button"
                            className="btn-primary landing-hero-cta"
                            onClick={handleGetStarted}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {primaryCtaLabel}
                        </motion.button>
                        <motion.button
                            type="button"
                            className="btn-secondary landing-hero-cta-secondary"
                            onClick={handleViewDemo}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {secondaryCtaLabel}
                        </motion.button>
                    </motion.div>
                </motion.div>

                <div className="landing-hero-visual-wrap">
                    <div className="landing-hero-glow" aria-hidden="true" />
                    <motion.div
                        className="landing-hero-visual-card"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <img src={imageSrc} alt={imageAlt} className="landing-hero-image" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
