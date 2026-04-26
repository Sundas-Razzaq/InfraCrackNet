import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logoMark from "../../assets/logos/logo.png";

const defaultNavLinks = [
    { label: "Features", targetId: "features" },
    { label: "Workflow", targetId: "workflow" },
    { label: "Pricing", targetId: "cta" },
    { label: "Solutions", targetId: "usecaseSection" },
];

function LandingNavbar({
    navLinks = defaultNavLinks,
    loginHref = "/login",
    ctaLabel = "Get Started",
    ctaHref = "/signup",
    brandHref = "/",
}) {
    const [activeTarget, setActiveTarget] = useState("home");
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 12);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const handleSectionScroll = (event, targetId) => {
        event.preventDefault();

        const section = document.getElementById(targetId);

        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveTarget(targetId);
        }
    };

    return (
        <header className={`landing-navbar-shell ${isScrolled ? "is-scrolled" : ""}`}>
            <motion.nav
                className="landing-navbar"
                aria-label="Primary"
                initial={{ y: -60 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <a className="landing-brand" href={brandHref} aria-label="InfraCrackNet home">
                    <img className="landing-brand-icon" src={logoMark} alt="InfraCrackNet logo" />
                    <span className="landing-brand-text">INFRACRACKNET</span>
                </a>

                <ul className="landing-navbar-links" role="list">
                    {navLinks.map((link) => (
                        <li key={`${link.label}-${link.targetId}`}>
                            <button
                                type="button"
                                className={`landing-navbar-link landing-navbar-link-button ${activeTarget === link.targetId ? "is-active" : ""
                                    }`}
                                onClick={(event) => handleSectionScroll(event, link.targetId)}
                            >
                                {link.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="landing-navbar-actions">
                    <a className="landing-login-link" href={loginHref}>
                        Login
                    </a>
                    <motion.a
                        className="btn-primary landing-cta-link"
                        href={ctaHref}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {ctaLabel}
                    </motion.a>
                </div>
            </motion.nav>
        </header>
    );
}

export default LandingNavbar;
