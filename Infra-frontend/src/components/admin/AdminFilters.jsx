// options: ["A", "B"] or [{ value, label }]
export const FilterSelect = ({ value, onChange, allLabel, options, disabled = false }) => (
    <select
        className="input"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
    >
        <option value="">{allLabel}</option>
        {options.map((option) => {
            const item = typeof option === "string" ? { value: option, label: option } : option;
            return (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
            );
        })}
    </select>
);

export const DateRangeFilter = ({ from, to, onChange }) => (
    <>
        <input
            type="date"
            className="input"
            aria-label="From date"
            title="From date"
            value={from || ""}
            max={to || undefined}
            onChange={(event) => onChange("from", event.target.value)}
        />
        <input
            type="date"
            className="input"
            aria-label="To date"
            title="To date"
            value={to || ""}
            min={from || undefined}
            onChange={(event) => onChange("to", event.target.value)}
        />
    </>
);