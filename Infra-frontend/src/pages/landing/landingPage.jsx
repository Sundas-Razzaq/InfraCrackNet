// src/pages/LandingPage.jsx
import { useState } from 'react';
import LandingLayout from "../../layouts/landingLayout.jsx";
import HeroSection from "../../components/landing/heroSection.jsx";
import StatsSection from "../../components/landing/statsSection.jsx";
import FeatureSection from "../../components/landing/featureSection.jsx";
import UsecaseSection from "../../components/landing/usecaseSection.jsx";
import WorkFlowSection from "../../components/landing/workFlowSection.jsx";
import CTASection from "../../components/landing/CTAsection.jsx";
import PricingModal from "../../components/landing/PricingModal.jsx"; // Import the modal

function LandingPage() {
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    return (
        <>
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
                    <CTASection onOpenPricing={() => setIsPricingOpen(true)} />
                </section>
            </LandingLayout>

            {/* Pricing Modal */}
            <PricingModal
                isOpen={isPricingOpen}
                onClose={() => setIsPricingOpen(false)}
            />
        </>
    );
}
export default LandingPage;