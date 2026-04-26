import heroBanner from "../../assets/images/landingPageImages/banner-1.png";

function HeroSection({
    titleTop = "AI-Based",
    titleAccent = "Crack Detection",
    titleBottom = "for Infrastructure",
    description =
    "Automate your structural health monitoring with high-precision computer vision. Real-time identification of concrete fatigue in buildings, bridges, and highways.",
    primaryCtaLabel = "Get Started",
    primaryCtaHref = "/signup",
    secondaryCtaLabel = "View Demo",
    secondaryCtaHref = "#demo",
    imageSrc = heroBanner,
    imageAlt = "Bridge structure with detected crack analysis overlays",
    anomalyLabel = "Structural Anomaly: 0.42mm",
}) {
    return (
        <section className="landing-hero-section" aria-labelledby="landing-hero-title">
            <div className="landing-hero-container">
                <div className="landing-hero-content">
                    <span className="landing-hero-accent-bar" aria-hidden="true" />

                    <h1 id="landing-hero-title" className="landing-hero-title">
                        <span className="landing-hero-title-primary">{titleTop}</span>
                        <span className="landing-hero-title-accent">{titleAccent}</span>
                        <span className="landing-hero-title-primary">{titleBottom}</span>
                    </h1>

                    <p className="landing-hero-description">{description}</p>

                    <div className="landing-hero-actions">
                        <a className="btn-primary landing-hero-cta" href={primaryCtaHref}>
                            {primaryCtaLabel}
                        </a>
                        <a className="btn-secondary landing-hero-cta-secondary" href={secondaryCtaHref}>
                            {secondaryCtaLabel}
                        </a>
                    </div>
                </div>

                <div className="landing-hero-visual-wrap">
                    <div className="landing-hero-glow" aria-hidden="true" />
                    <div className="landing-hero-visual-card">
                        <img src={imageSrc} alt={imageAlt} className="landing-hero-image" />

                        <div className="landing-hero-analysis-chip" role="status" aria-live="polite">
                            <span className="landing-hero-analysis-label">Live Analysis</span>
                            <span className="landing-hero-analysis-value">{anomalyLabel}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
