import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AdminModal = ({ isOpen, title, subtitle, onClose, children, footer, wide = false }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`adm-modal ${wide ? "adm-modal--wide" : ""}`}
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="adm-modal-header">
                    <div>
                        <h2 className="adm-modal-title">{title}</h2>
                        {subtitle && <p className="adm-modal-subtitle">{subtitle}</p>}
                    </div>

                    <button
                        type="button"
                        className="adm-modal-close"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </header>

                <div className="adm-modal-body">{children}</div>

                {footer && <footer className="adm-modal-footer">{footer}</footer>}
            </div>
        </div>
    );
};

export default AdminModal;