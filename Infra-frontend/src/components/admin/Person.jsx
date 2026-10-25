import { initialsOf } from "./initialsOf";

// Reuses the .dtl-person / .dtl-avatar look from the details pages.
const Person = ({ name, sub, children }) => (
    <li className="dtl-person">
        <span className="dtl-avatar" aria-hidden="true">
            {initialsOf(name)}
        </span>

        <span className="dtl-person-info">
            <span className="dtl-person-name">{name}</span>
            {sub && <span className="dtl-person-sub">{sub}</span>}
        </span>

        {children && <span className="adm-person-actions">{children}</span>}
    </li>
);

export default Person;