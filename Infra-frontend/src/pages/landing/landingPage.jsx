import LandingLayout from "../../layouts/landingLayout.jsx";
import HeroSection from "../../components/landing/heroSection.jsx";
import StatsSection from "../../components/landing/statsSection.jsx";
import FeatureSection from "../../components/landing/featureSection.jsx";
import UsecaseSection from "../../components/landing/usecaseSection.jsx";
import WorkFlowSection from "../../components/landing/workFlowSection.jsx";
import CTASection from "../../components/landing/CTAsection.jsx";

function LandingPage() {
    return (
        <LandingLayout>
            <section id="home">
                <HeroSection />
            </section>

            <section id="stats">
                <StatsSection />
            </section>

            <section id="features">
                <FeatureSection />
            </section>

            <UsecaseSection />
            <WorkFlowSection />

            <section id="pricing">
                <CTASection />
            </section>
        </LandingLayout>
    );
}

export default LandingPage;
