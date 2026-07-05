function DashboardSection({ title, children }) {
    return (
        <section className="dashboard-section">
            <h2 className="section-title">{title}</h2>
            {children}
        </section>
    );
}

export default DashboardSection;
