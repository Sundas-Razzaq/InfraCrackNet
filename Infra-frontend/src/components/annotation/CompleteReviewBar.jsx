const CompleteReviewBar = ({
    summary,
    isCompleting,
    onComplete,
}) => {
    const allReviewed =
        summary.pendingReview === 0;

    return (
        <div className="complete-review-bar">

            <div className="review-info">

                <h3>
                    Annotation Progress
                </h3>

                <p>
                    {summary.reviewedCracks} of{" "}
                    {summary.totalCracks} cracks
                    reviewed
                </p>

            </div>

            <button
                className="btn btn-primary"
                disabled={
                    !allReviewed || isCompleting
                }
                onClick={onComplete}
            >
                {isCompleting
                    ? "Completing..."
                    : "Complete Review"}
            </button>

        </div>
    );
};

export default CompleteReviewBar;