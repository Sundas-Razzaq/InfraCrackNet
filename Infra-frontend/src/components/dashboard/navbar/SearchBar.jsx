import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";

import SearchResults from "./SearchResults";
import { searchAll } from "../../../api/searchApi";
import { useDebounce } from "../../../utils/useDebounce";

const MIN_QUERY_LENGTH = 2;

function SearchBar() {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const debouncedQuery = useDebounce(query, 250);

    /* FLATTENED RESULTS FOR KEYBOARD NAV */

    const flattenResults = (data) => {
        if (!data) return [];

        const flat = [];

        (data.projects || []).forEach((p) =>
            flat.push({ kind: "project", item: p })
        );
        (data.inspections || []).forEach((i) =>
            flat.push({ kind: "inspection", item: i })
        );
        (data.analyses || []).forEach((a) =>
            flat.push({ kind: "analysis", item: a })
        );
        (data.reports || []).forEach((r) =>
            flat.push({ kind: "report", item: r })
        );

        return flat;
    };

    const flat = flattenResults(results);

    /*FETCH ON DEBOUNCED QUERY CHANGE*/

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            const q = debouncedQuery.trim();

            if (q.length < MIN_QUERY_LENGTH) {
                setResults(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const response = await searchAll(q);
                if (!cancelled) {
                    setResults(response.data);
                    setActiveIndex(-1);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Search failed:", error);
                    setResults(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    /*CLICK OUTSIDE TO CLOSE*/

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    /*NAVIGATION */

    const navigateToResult = (result) => {
        if (!result) return;

        const { kind, item } = result;

        if (kind === "project") {
            navigate(`/dashboard/projects/${item._id}`);
        } else if (kind === "inspection") {
            navigate(`/dashboard/inspection/${item._id}`);
        } else if (kind === "analysis") {
            navigate(`/dashboard/ai-analysis/${item._id}`);
        } else if (kind === "report") {
            const inspectionId = item.inspection?._id;
            if (inspectionId) {
                navigate(
                    `/dashboard/inspection/${inspectionId}/report/${item._id}`
                );
            }
        }

        setQuery("");
        setResults(null);
        setOpen(false);
        setActiveIndex(-1);
    };

    /* KEYBOARD*/

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setQuery("");
            setResults(null);
            setOpen(false);
            setActiveIndex(-1);
            return;
        }

        if (!open || flat.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev + 1 >= flat.length ? 0 : prev + 1
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev - 1 < 0 ? flat.length - 1 : prev - 1
            );
        } else if (e.key === "Enter") {
            if (activeIndex >= 0) {
                e.preventDefault();
                navigateToResult(flat[activeIndex]);
            }
        }
    };

    /*CLEAR*/

    const handleClear = () => {
        setQuery("");
        setResults(null);
        setActiveIndex(-1);
    };

    const showDropdown = open && query.trim().length >= MIN_QUERY_LENGTH;

    return (
        <div className="search-bar-wrapper" ref={containerRef}>
            <form
                className="search-bar"
                role="search"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (activeIndex >= 0) {
                        navigateToResult(flat[activeIndex]);
                    }
                }}
            >
                <FontAwesomeIcon
                    icon={faSearch}
                    className="search-bar-icon"
                />

                <input
                    type="search"
                    className="search-input"
                    placeholder="Search projects, inspections, analyses, reports..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    aria-label="Search"
                />

                {query && (
                    <button
                        type="button"
                        className="search-clear-btn"
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                )}
            </form>

            {showDropdown && (
                <SearchResults
                    results={results}
                    loading={loading}
                    activeIndex={activeIndex}
                    onSelect={navigateToResult}
                />
            )}
        </div>
    );
}

export default SearchBar;