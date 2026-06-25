const formFieldsByType = {
    login: [
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "engineer@infrastructure.com",
            fullWidth: true,
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            fullWidth: true,
        },
    ],

    signup: [
        {
            name: "name",
            label: "Full Name",
            type: "text",
            placeholder: "John Doe",
            fullWidth: true,
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "engineer@infrastructure.com",
            fullWidth: true,
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Create a password",
            halfWidth: true,
        },
        {
            name: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            placeholder: "Confirm your password",
            halfWidth: true,
        },
        // Role field is now defined here but will be rendered separately
    ],

    forgot: [
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "engineer@infrastructure.com",
            fullWidth: true,
        },
    ],

    reset: [
        {
            name: "password",
            label: "New Password",
            type: "password",
            placeholder: "Enter a new password",
            fullWidth: true,
        },
        {
            name: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            placeholder: "Confirm the new password",
            fullWidth: true,
        },
    ],
};

const submitLabelByType = {
    login: "Sign In",
    signup: "Create Account",
    forgot: "Send reset link",
    reset: "Reset password",
};

function AuthForm({
    type = "login",
    values = {},
    onChange,
    onSubmit,
    loading = false,
    message = "",
    messageTone = "error",
    submitLabel,
    onRoleSelect,
}) {
    const fields = formFieldsByType[type] ?? formFieldsByType.login;
    const buttonLabel = submitLabel ?? submitLabelByType[type] ?? submitLabelByType.login;

    const handleRoleSelect = (role) => {
        if (onRoleSelect) {
            onRoleSelect(role);
        }
    };

    return (
        <form
            className={`auth-form ${type === "signup" ? "auth-form-grid" : ""}`.trim()}
            onSubmit={onSubmit}
            noValidate
        >
            {/* Render all form fields */}
            {fields.map((field) => (
                <div
                    key={field.name}
                    className={`auth-field ${field.fullWidth ? "auth-field-full" : "auth-field-half"}`.trim()}
                >
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={values[field.name] ?? ""}
                        onChange={onChange}
                        required
                        placeholder={field.placeholder}
                        minLength={
                            field.name === "password" || field.name === "confirmPassword"
                                ? 6
                                : undefined
                        }
                    />
                </div>
            ))}

            {/* Role Selection for Signup - placed AFTER all fields */}
            {type === "signup" && (
                <div className="auth-field auth-field-full auth-role-field">
                    <label className="auth-role-label">Select Your Role</label>
                    <div className="auth-role-toggle">
                        <button
                            type="button"
                            className={`auth-role-btn ${values.role === "Inspector" ? "active" : ""}`}
                            onClick={() => handleRoleSelect("Inspector")}
                        >
                            <span className="auth-role-icon"></span>
                            Inspector
                        </button>
                        <button
                            type="button"
                            className={`auth-role-btn ${values.role === "Engineer" ? "active" : ""}`}
                            onClick={() => handleRoleSelect("Engineer")}
                        >
                            <span className="auth-role-icon"></span>
                            Engineer
                        </button>
                    </div>
                </div>
            )}

            {message ? (
                <p className={`auth-message auth-message-${messageTone}`}>{message}</p>
            ) : (
                <p className="auth-message auth-message-placeholder">&nbsp;</p>
            )}

            <button className="auth-submit-button" type="submit" disabled={loading}>
                {loading ? `${buttonLabel}...` : buttonLabel}
            </button>
        </form>
    );
}

export default AuthForm;