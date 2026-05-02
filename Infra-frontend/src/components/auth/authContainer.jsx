import AuthCard from "./authCard";
import AuthVisual from "./authVisual";

function AuthContainer({ children, visual = <AuthVisual />, title, subtitle, footer }) {
    return (
        <div className="auth-container-shell">
            <div className="auth-container-inner">
                <div className="auth-container-visual">{visual}</div>
                <AuthCard title={title} subtitle={subtitle} footer={footer}>
                    {children}
                </AuthCard>
            </div>
        </div>
    );
}

export default AuthContainer;
