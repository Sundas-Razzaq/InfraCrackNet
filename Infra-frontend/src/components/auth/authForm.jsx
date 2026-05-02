const formFieldsByType = {
    login: [
        { name: "email", label: "Email", type: "email", placeholder: "engineer@infrastructure.com", fullWidth: true },
        { name: "password", label: "Password", type: "password", placeholder: "Enter your password", fullWidth: true },
    ],
    signup: [
        { name: "name", label: "Full Name", type: "text", placeholder: "John Doe", fullWidth: true },
        { name: "email", label: "Email", type: "email", placeholder: "engineer@infrastructure.com", fullWidth: true },
        { name: "password", label: "Password", type: "password", placeholder: "Create a password", halfWidth: true },
        { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password", halfWidth: true },
    ],
    forgot: [
        { name: "email", label: "Email", type: "email", placeholder: "engineer@infrastructure.com", fullWidth: true },
    ],
    reset: [
        { name: "password", label: "New Password", type: "password", placeholder: "Enter a new password", fullWidth: true },
        { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm the new password", fullWidth: true },
    ],
};

const submitLabelByType = {
    login: "Login",
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
}) {
    const fields = formFieldsByType[type] ?? formFieldsByType.login;
    const buttonLabel = submitLabel ?? submitLabelByType[type] ?? submitLabelByType.login;

    return (
        <form className={`auth-form ${type === "signup" ? "auth-form-grid" : ""}`.trim()} onSubmit={onSubmit} noValidate>
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
                        minLength={field.name === "password" || field.name === "confirmPassword" ? 6 : undefined}
                    />
                </div>
            ))}

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
