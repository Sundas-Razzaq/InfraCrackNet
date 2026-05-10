function EmptyState({ title, description, icon: Icon, actionLabel, onAction, secondaryActionLabel, onSecondaryAction }) {
    return (
        <section className="dashboard-empty-state">
            {Icon ? (
                <div className="dashboard-empty-state__icon">
                    <Icon size={24} />
                </div>
            ) : null}

            <div className="dashboard-empty-state__copy">
                <h2>{title}</h2>
                {description ? <p>{description}</p> : null}
            </div>

            {(actionLabel || secondaryActionLabel) && (
                <div className="dashboard-empty-state__actions">
                    {secondaryActionLabel ? (
                        <button type="button" className="dashboard-button dashboard-button--ghost" onClick={onSecondaryAction}>
                            {secondaryActionLabel}
                        </button>
                    ) : null}
                    {actionLabel ? (
                        <button type="button" className="dashboard-button dashboard-button--primary" onClick={onAction}>
                            {actionLabel}
                        </button>
                    ) : null}
                </div>
            )}
        </section>
    );
}

export default EmptyState;