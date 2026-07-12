import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

function PasswordInput({
    label,
    name,
    value,
    onChange,
    placeholder = "••••••••",
    disabled = false,
    required = false,
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="form-group">
            {label && <label htmlFor={name}>{label}</label>}

            <div className="password-input-wrapper">
                <input
                    id={name}
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete="off"
                />

                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() =>
                        setShowPassword((prev) => !prev)
                    }
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    <FontAwesomeIcon
                        icon={
                            showPassword
                                ? faEyeSlash
                                : faEye
                        }
                    />
                </button>
            </div>
        </div>
    );
}

export default PasswordInput;