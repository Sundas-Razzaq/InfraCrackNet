import { useEffect, useState } from "react";

import { initialsOf } from "../initialsOf";
import { getAvailableMembers } from "../../../api/adminApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { useDebounce } from "../../../utils/useDebounce";

const PAGE_SIZE = 20;

// Lists active users of a role who are not in any team yet.
const MemberPicker = ({ role, selectedId, onSelect }) => {
    const [search, setSearch] = useState("");
    const debounced = useDebounce(search, 300);

    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await getAvailableMembers({
                    role,
                    search: debounced,
                    limit: PAGE_SIZE,
                });
                if (cancelled) return;
                setUsers(res.data || []);
                setTotal(res.pagination?.total || 0);
            } catch (err) {
                if (!cancelled) setError(getApiErrorMessage(err, "Failed to load users."));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [role, debounced]);

    return (
        <div className="adm-stack">
            <input
                className="input"
                placeholder={`Search ${role.toLowerCase()}s by name or email`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            {loading && <p className="adm-table-state">Loading...</p>}
            {!loading && error && <p className="form-error">{error}</p>}

            {!loading && !error && users.length === 0 && (
                <p className="adm-table-state">
                    No available {role.toLowerCase()}s. They must be active and not in a team.
                </p>
            )}

            {!loading && !error && users.length > 0 && (
                <ul className="adm-picker">
                    {users.map((user) => (
                        <li key={user._id}>
                            <button
                                type="button"
                                className={`adm-picker-item ${selectedId === user._id ? "selected" : ""}`}
                                onClick={() => onSelect(user)}
                            >
                                <span className="dtl-avatar" aria-hidden="true">
                                    {initialsOf(user.name)}
                                </span>
                                <span className="dtl-person-info">
                                    <span className="dtl-person-name">{user.name}</span>
                                    <span className="dtl-person-sub">{user.email}</span>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {total > PAGE_SIZE && (
                <p className="form-hint">
                    Showing the first {PAGE_SIZE} of {total}. Use search to narrow down.
                </p>
            )}
        </div>
    );
};

export default MemberPicker;