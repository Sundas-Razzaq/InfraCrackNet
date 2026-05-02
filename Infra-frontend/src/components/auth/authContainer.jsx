import AuthCard from "./authCard";
import AuthVisual from "./authVisual";

function AuthContainer({ children, visual = <AuthVisual />, title, subtitle, footer }) {
    return (
        <div className="auth-container-shell">
            <div className="auth-container-visual">{visual}</div>

            <div className="auth-container-inner">
                <div className="auth-card-wrapper">
                    <AuthCard title={title} subtitle={subtitle} footer={footer}>
                        {children}
                    </AuthCard>
                </div>
            </div>
        </div>
    );
}

export default AuthContainer;