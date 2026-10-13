import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolderOpen,
    faClipboardCheck,
    faChartLine,
    faFileLines,
} from "@fortawesome/free-solid-svg-icons";

import SearchResultItem from "./SearchResultItem";

const SearchResults = ({
    results,
    loading,
    activeIndex,
    onSelect,
}) => {
    if (loading) {
        return (
            <div className="search-dropdown">
                <div className="search-loading">Searching…</div>
            </div>
        );
    }

    if (!results) return null;

    const {
        projects = [],
        inspections = [],
        analyses = [],
        reports = [],
    } = results;

    const total =
        projects.length +
        inspections.length +
        analyses.length +
        reports.length;

    if (total === 0) {
        return (
            <div className="search-dropdown">
                <div className="search-empty">No results found.</div>
            </div>
        );
    }

    // Walk groups in order to compute flat indices for keyboard nav.
    let flatCursor = 0;
    const groups = [];

    if (projects.length > 0) {
        const startIndex = flatCursor;
        flatCursor += projects.length;

        groups.push(
            <div className="search-group" key="projects">
                <div className="search-group-header">
                    <FontAwesomeIcon
                        icon={faFolderOpen}
                        className="search-group-icon"
                    />
                    <span>Projects</span>
                </div>
                {projects.map((item, i) => {
                    const flatIndex = startIndex + i;
                    return (
                        <SearchResultItem
                            key={item._id}
                            item={item}
                            kind="project"
                            active={flatIndex === activeIndex}
                            onClick={() =>
                                onSelect({ kind: "project", item })
                            }
                        />
                    );
                })}
            </div>
        );
    }

    if (inspections.length > 0) {
        const startIndex = flatCursor;
        flatCursor += inspections.length;

        groups.push(
            <div className="search-group" key="inspections">
                <div className="search-group-header">
                    <FontAwesomeIcon
                        icon={faClipboardCheck}
                        className="search-group-icon"
                    />
                    <span>Inspections</span>
                </div>
                {inspections.map((item, i) => {
                    const flatIndex = startIndex + i;
                    return (
                        <SearchResultItem
                            key={item._id}
                            item={item}
                            kind="inspection"
                            active={flatIndex === activeIndex}
                            onClick={() =>
                                onSelect({ kind: "inspection", item })
                            }
                        />
                    );
                })}
            </div>
        );
    }

    if (analyses.length > 0) {
        const startIndex = flatCursor;
        flatCursor += analyses.length;

        groups.push(
            <div className="search-group" key="analyses">
                <div className="search-group-header">
                    <FontAwesomeIcon
                        icon={faChartLine}
                        className="search-group-icon"
                    />
                    <span>Analyses</span>
                </div>
                {analyses.map((item, i) => {
                    const flatIndex = startIndex + i;
                    return (
                        <SearchResultItem
                            key={item._id}
                            item={item}
                            kind="analysis"
                            active={flatIndex === activeIndex}
                            onClick={() =>
                                onSelect({ kind: "analysis", item })
                            }
                        />
                    );
                })}
            </div>
        );
    }

    if (reports.length > 0) {
        const startIndex = flatCursor;
        flatCursor += reports.length;

        groups.push(
            <div className="search-group" key="reports">
                <div className="search-group-header">
                    <FontAwesomeIcon
                        icon={faFileLines}
                        className="search-group-icon"
                    />
                    <span>Reports</span>
                </div>
                {reports.map((item, i) => {
                    const flatIndex = startIndex + i;
                    return (
                        <SearchResultItem
                            key={item._id}
                            item={item}
                            kind="report"
                            active={flatIndex === activeIndex}
                            onClick={() =>
                                onSelect({ kind: "report", item })
                            }
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <div className="search-dropdown">
            <div className="search-dropdown-inner">{groups}</div>
        </div>
    );
};

export default SearchResults;