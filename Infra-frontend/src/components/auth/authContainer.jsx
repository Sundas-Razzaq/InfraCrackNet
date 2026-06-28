import AuthCard from "./authCard";

function AuthContainer({ children, title, subtitle, footer }) {
    return (
        <div className="auth-container-split">
            <div className="auth-card-wrapper-split">
                <AuthCard title={title} subtitle={subtitle} footer={footer}>
                    {children}
                </AuthCard>
            </div>
        </div>
    );
}

export default AuthContainer;