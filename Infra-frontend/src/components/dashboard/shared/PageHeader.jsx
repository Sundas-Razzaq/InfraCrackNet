function PageHeader({ eyebrow, title, description, children }) {
    return (
        <header className="dashboard-page__header">
            <div className="dashboard-page__header-copy">
                {eyebrow ? <span className="dashboard-page__eyebrow">{eyebrow}</span> : null}
                <h1>{title}</h1>
                {description ? <p>{description}</p> : null}
            </div>

            {children ? <div className="dashboard-page__header-actions">{children}</div> : null}
        </header>
    );
}

export default PageHeader;