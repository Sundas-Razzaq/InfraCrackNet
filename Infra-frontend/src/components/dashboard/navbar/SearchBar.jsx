import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBar() {
    const [query, setQuery] = useState("");

    return (
        <form className="search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
            <span className="search-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <input
                type="search"
                className="search-input"
                placeholder="Search..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search"
            />
        </form>
    );
}

export default SearchBar;
