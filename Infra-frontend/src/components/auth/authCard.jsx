function AuthCard({ title, subtitle, children, footer }) {
    return (
        <section className="auth-card">
            {(title || subtitle) ? (
                <header className="auth-card-header">
                    {title ? <h1 className="auth-card-title">{title}</h1> : null}
                    {subtitle ? <p className="auth-card-subtitle">{subtitle}</p> : null}
                </header>
            ) : null}

            <div className="auth-card-body">{children}</div>

            {footer ? <footer className="auth-card-footer">{footer}</footer> : null}
        </section>
    );
}

export default AuthCard;
