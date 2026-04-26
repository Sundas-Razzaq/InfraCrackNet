import logoMark from "../../assets/logos/logo.png";

const defaultNavLinks = [
    { label: "Features", href: "#features" },
    { label: "Solutions", href: "#solutions" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
];

function LandingNavbar({
    navLinks = defaultNavLinks,
    loginHref = "/login",
    ctaLabel = "Get Started",
    ctaHref = "/signup",
    brandHref = "/",
}) {
    return (
        <header className="landing-navbar-shell">
            <nav className="landing-navbar" aria-label="Primary">
                <a className="landing-brand" href={brandHref} aria-label="InfraCrackNet home">
                    <img className="landing-brand-icon" src={logoMark} alt="InfraCrackNet logo" />
                    <span className="landing-brand-text">INFRACRACKNET</span>
                </a>

                <ul className="landing-navbar-links" role="list">
                    {navLinks.map((link) => (
                        <li key={`${link.label}-${link.href}`}>
                            <a className="landing-navbar-link" href={link.href}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="landing-navbar-actions">
                    <a className="landing-login-link" href={loginHref}>
                        Login
                    </a>
                    <a className="btn-primary landing-cta-link" href={ctaHref}>
                        {ctaLabel}
                    </a>
                </div>
            </nav>
        </header>
    );
}

export default LandingNavbar;
