const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.total === 0) return null;

    const { page, limit, total, totalPages } = pagination;
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="adm-pagination">
            <span className="adm-pagination-info">
                Showing {from}–{to} of {total}
            </span>

            <div className="adm-pagination-actions">
                <button
                    type="button"
                    className="btn-secondary btn-sm"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    Previous
                </button>

                <span className="adm-pagination-page">
                    Page {page} of {Math.max(totalPages, 1)}
                </span>

                <button
                    type="button"
                    className="btn-secondary btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;