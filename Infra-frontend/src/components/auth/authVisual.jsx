import backgroundImage from "../../assets/images/auth/background.png";

function AuthVisual() {
    return (
        <section className="auth-visual" aria-label="Infrastructure illustration panel">
            <img className="auth-visual-image" src={backgroundImage} alt="" aria-hidden="true" />
            <div className="auth-visual-overlay" aria-hidden="true" />
            <div className="auth-visual-copy">
                <p className="auth-visual-kicker">InfraCrackNet</p>
                <h2>Monitor structural integrity with clarity.</h2>
                <p>
                    Keep inspection, detection, and response workflows in one focused place.
                </p>
            </div>
        </section>
    );
}

export default AuthVisual;
