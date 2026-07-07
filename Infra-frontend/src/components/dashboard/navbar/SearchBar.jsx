import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchBar() {
    const [query, setQuery] = useState("");

    return (
        <form className="search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
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
