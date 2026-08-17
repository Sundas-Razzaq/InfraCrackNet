const ReportRecommendations = ({ recommendations = [] }) => {
    return (
        <section className="report-recommendations-section">
            <div className="report-section-heading">
                <h2>Recommendations</h2>
            </div>

            {recommendations.length === 0 ? (
                <div className="report-empty-recommendations">
                    No recommendations available.
                </div>
            ) : (
                <ul className="report-recommendations-list">
                    {recommendations.map(
                        (recommendation, index) => (
                            <li
                                key={`${index}-${recommendation}`}
                            >
                                {recommendation}
                            </li>
                        )
                    )}
                </ul>
            )}
        </section>
    );
};

export default ReportRecommendations;