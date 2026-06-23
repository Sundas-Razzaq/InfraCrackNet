import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const PricingModal = ({ isOpen, onClose }) => {
    const pricingPlans = [
        {
            name: 'Starter',
            price: 'Free',
            period: 'forever',
            description: 'For individual inspectors or small teams getting started with AI inspection.',
            features: [
                '5 inspections / month',
                'Basic AI crack detection',
                'PDF report export',
                '1 user seat',
                'Community support',
                'Analytics dashboard'
            ],
            cta: 'Get Started Free',
            ctaClass: 'pricing-cta-outline',
            popular: false
        },
        {
            name: 'Professional',
            price: '$49',
            period: 'per user / month',
            description: 'For growing engineering teams with regular inspection workflows and reporting.',
            features: [
                'Unlimited inspections',
                'Advanced AI analysis',
                'Custom report templates',
                'Up to 20 users',
                'Priority email support',
                '99.9% SLA uptime',
                'API access'
            ],
            cta: 'Start Free Trial',
            ctaClass: 'pricing-cta-primary',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: 'contact our team',
            description: 'For large organizations managing complex infrastructure portfolios at scale.',
            features: [
                'Everything in Professional',
                'Unlimited users',
                'Custom AI model fine-tuning',
                'SSO / SAML integration',
                'Dedicated account manager',
                'On-premise deployment option'
            ],
            cta: 'Contact Sales',
            ctaClass: 'pricing-cta-outline',
            popular: false
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="pricing-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="pricing-modal-container"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="pricing-modal-close" onClick={onClose}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <div className="pricing-modal-header">
                            <h2 className="pricing-modal-title">Simple, transparent pricing</h2>
                            <p className="pricing-modal-subtitle">
                                Start free. Scale as you grow. No hidden fees.
                            </p>
                        </div>

                        <div className="pricing-grid">
                            {pricingPlans.map((plan, index) => (
                                <motion.div
                                    key={index}
                                    className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {plan.popular && (
                                        <div className="pricing-card-badge">MOST POPULAR</div>
                                    )}

                                    <div className="pricing-card-header">
                                        <h3 className="pricing-plan-name">{plan.name}</h3>
                                        <div className="pricing-plan-price">
                                            <span className="pricing-price-amount">{plan.price}</span>
                                            <span className="pricing-price-period">{plan.period}</span>
                                        </div>
                                        <p className="pricing-plan-description">{plan.description}</p>
                                    </div>

                                    <ul className="pricing-features-list">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="pricing-feature-item">
                                                <svg className="pricing-feature-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`pricing-cta ${plan.ctaClass}`}
                                        onClick={() => {
                                            onClose();
                                            // Add your navigation or action logic here
                                        }}
                                    >
                                        {plan.cta}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PricingModal;