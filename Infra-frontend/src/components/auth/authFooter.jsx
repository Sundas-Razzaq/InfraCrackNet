function AuthFooter({ copyright = "© 2024 InfraCrackNet AI. Structural Integrity Through Intelligence." }) {
    return (
        <footer className="auth-footer" aria-label="Authentication footer">
            <div className="auth-footer-container">
                <div className="auth-footer-links" aria-label="Legal links">
                    <a className="auth-footer-link" href="/privacy-policy">
                        Privacy Policy
                    </a>
                    <a className="auth-footer-link" href="/terms-of-service">
                        Terms of Service
                    </a>
                </div>

                {copyright ? <p className="auth-footer-copy">{copyright}</p> : null}
            </div>
        </footer>
    );
}

export default AuthFooter;
