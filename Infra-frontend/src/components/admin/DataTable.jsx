// columns: [{ key, header, render?: (row) => node, width? }]
const DataTable = ({
    columns,
    rows = [],
    loading = false,
    error = "",
    emptyText = "No records found.",
    rowKey = "_id",
    onRowClick,
    bare = false,
}) => {
    return (
        <div className={`table-wrapper ${bare ? "" : "adm-table-wrapper"}`}>
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={columns.length} className="adm-table-state">
                                Loading...
                            </td>
                        </tr>
                    )}

                    {!loading && error && (
                        <tr>
                            <td colSpan={columns.length} className="adm-table-state adm-table-error">
                                {error}
                            </td>
                        </tr>
                    )}

                    {!loading && !error && rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="adm-table-state">
                                {emptyText}
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        !error &&
                        rows.map((row) => (
                            <tr
                                key={row[rowKey]}
                                className={onRowClick ? "adm-row-clickable" : ""}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                            >
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row) : row[col.key] ?? "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;