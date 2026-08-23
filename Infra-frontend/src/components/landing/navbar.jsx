import { useEffect, useState } from "react";
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
    <header
      className={`landing-navbar-shell ${isScrolled ? "is-scrolled" : ""}`}
    >
      <nav
        className="navbar navbar-expand-lg navbar-light landing-navbar"
        aria-label="Primary"
      >
        <div className="container">
          <a
            className="navbar-brand landing-brand"
            href={brandHref}
            aria-label="InfraCrackNet home"
          >
            <img
              className="landing-brand-icon"
              src={logoMark}
              alt="InfraCrackNet logo"
            />
            <span className="landing-brand-text" >INFRACRACKNET</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mx-auto landing-navbar-links" role="list">
              {navLinks.map((link) => (
                <li className="nav-item" key={`${link.label}-${link.targetId}`}>
                  <button
                    type="button"
                    className={`nav-link landing-navbar-link landing-navbar-link-button ${activeTarget === link.targetId ? "is-active" : ""
                      }`}
                    onClick={(event) =>
                      handleSectionScroll(event, link.targetId)
                    }
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center gap-3 landing-navbar-actions">
              <a className="landing-login-link" href={loginHref}>
                Login
              </a>
              <a className="btn btn-primary landing-cta-link" href={ctaHref}>
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default LandingNavbar;
