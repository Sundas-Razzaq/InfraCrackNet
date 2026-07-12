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
    placeholder = "",
    required = false,
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="form-group">
            <label>{label}</label>

            <div className="password-input-wrapper">
                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />

                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() =>
                        setShowPassword(!showPassword)
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