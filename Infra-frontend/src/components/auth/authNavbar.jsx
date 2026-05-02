import { Link } from "react-router-dom";
import logoMark from "../../assets/logos/logo.png";
import "../../styles/auth.css";

const navActionByMode = {
    login: { label: "Sign Up", to: "/signup" },
    signup: { label: "Login", to: "/login" },
    forgot: { label: "Back to Login", to: "/login" },
    reset: { label: "Back to Login", to: "/login" },
};

function AuthNavbar({ mode = "login" }) {
    const action = navActionByMode[mode] ?? navActionByMode.login;

    return (
        <header className="auth-navbar-shell">
            <nav className="auth-navbar" aria-label="Authentication navigation">
                <div className="auth-navbar-container">
                    <Link className="auth-brand" to="/" aria-label="InfraCrackNet home">
                        <img className="auth-brand-logo" src={logoMark} alt="InfraCrackNet logo" />
                        <span className="auth-brand-text">InfraCrackNet</span>
                    </Link>

                    <Link className="auth-navbar-link" to={action.to}>
                        {action.label}
                    </Link>
                </div>
            </nav>
        </header>
    );
}

export default AuthNavbar;
