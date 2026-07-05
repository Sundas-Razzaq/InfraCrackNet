function WidgetCard({ title, children, headerAction }) {
    return (
        <div className="widget-card">
            <div className="widget-card-header">

                <h3 className="widget-card-title">
                    {title}
                </h3>

                {headerAction && (
                    <div className="widget-card-action">
                        {headerAction}
                    </div>
                )}

            </div>
            <div className="widget-card-body">{children}</div>
        </div>
    );
}

export default WidgetCard;
