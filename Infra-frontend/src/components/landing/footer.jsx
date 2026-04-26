import logoMark from "../../assets/logos/logo.png";
import { motion } from "framer-motion";
import { container, fadeInUp, sectionViewport } from "../../utils/landingMotion";

const defaultProductLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#workflow" },
    { label: "Solutions", href: "#solutions" },
    { label: "Pricing", href: "#pricing" },
];

const defaultLegalLinks = [
    { label: "Security", href: "#security" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
];

function LandingFooter({
    productLinks = defaultProductLinks,
    legalLinks = defaultLegalLinks,
    companyName = "InfraCrackNet AI",
    year = "2024",
}) {
    return (
        <footer className="landing-footer-shell">
            <motion.div
                className="landing-footer"
                aria-label="Footer"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={sectionViewport}
            >
                <motion.section className="landing-footer-brand-col" variants={fadeInUp}>
                    <a className="landing-brand" href="/" aria-label="InfraCrackNet home">
                        <img className="landing-brand-icon" src={logoMark} alt="InfraCrackNet logo" />
                        <span className="landing-brand-text">INFRACRACKNET AI</span>
                    </a>

                    <p className="landing-footer-description">
                        Ensuring a safer built environment through intelligent computer vision and automated
                        structural health monitoring.
                    </p>

                    <p className="landing-footer-copyright">
                        © {year} {companyName}. Precision Structural Scanning.
                    </p>
                </motion.section>

                <motion.section className="landing-footer-links-col" aria-label="Product" variants={fadeInUp}>
                    <h2 className="landing-footer-heading">PRODUCT</h2>
                    <ul className="landing-footer-list" role="list">
                        {productLinks.map((link) => (
                            <li key={`${link.label}-${link.href}`}>
                                <a className="landing-footer-link" href={link.href}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.section>

                <motion.section className="landing-footer-links-col" aria-label="Legal" variants={fadeInUp}>
                    <h2 className="landing-footer-heading">LEGAL</h2>
                    <ul className="landing-footer-list" role="list">
                        {legalLinks.map((link) => (
                            <li key={`${link.label}-${link.href}`}>
                                <a className="landing-footer-link" href={link.href}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.section>
            </motion.div>
        </footer>
    );
}

export default LandingFooter;
