// src/utils/animation.js

export const pageTransition = {
    hidden: {
        opacity: 0,
        y: 18,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: "easeOut",
        },
    },
};

export const fadeIn = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
        },
    },
};

export const fadeInUp = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
        },
    },
};

export const slideLeft = {
    hidden: {
        opacity: 0,
        x: -30,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.45,
        },
    },
};

export const slideRight = {
    hidden: {
        opacity: 0,
        x: 30,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.45,
        },
    },
};

export const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.97,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.35,
        },
    },
};

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};