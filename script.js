/* ===========================================================
   SUCCESS DIGITAL HUB (SDH)
   VERSION 1 — CONSOLIDATED CONTROLLER
   SCRIPT.JS

   Author: Success Osawemi Afeisume
   Developed with AI Assistance

   Features:
   ✔ Sticky Header
   ✔ Mobile Navigation
   ✔ Active Navigation
   ✔ Scroll Reveal
   ✔ Back To Top
   ✔ Dark / Light Mode
   ✔ Saved Theme Preference
   ✔ External Link Security
   ✔ Image Loading
   ✔ Page Loaded State
   ✔ Splash Screen
   ✔ Typing Animation
   ✔ Spinner Stage
   ✔ Welcome Stage
   ✔ Preparing Stage
   ✔ Animated Loading Dots
   ✔ Development Notice
   ✔ Accessibility Support
=========================================================== */

"use strict";


/* ===========================================================
   CONFIGURATION
=========================================================== */

const CONFIG = {

    scrollOffset: 120,

    revealThreshold: 0.15,


    /* -------------------------------------------------------
   SPLASH TIMING
------------------------------------------------------- */

splashTypingSpeed: 100,

splashBrandPause: 700,

splashSpinnerDuration: 2000,

splashWelcomeDuration: 2000,

splashPreparingDuration: 3000,

splashDotsDuration: 3000,

splashDotsSpeed: 350,

splashExitDuration: 700

  };


/* ===========================================================
   DOM READY — SINGLE APPLICATION CONTROLLER
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const body = document.body;

        if (!body) {
            return;
        }


        /* ===================================================
           DOM REFERENCES
        =================================================== */

        const header =
            document.querySelector(
                ".header"
            );


        const menuBtn =
            document.getElementById(
                "menu-btn"
            );


        const navLinks =
            document.querySelector(
                ".nav-links"
            );


        const themeToggle =
            document.getElementById(
                "theme-toggle"
            );


        const topBtn =
            document.getElementById(
                "topBtn"
            );


        const navItems =
            document.querySelectorAll(
                ".nav-links a"
            );


        const sections =
            document.querySelectorAll(
                "section[id]"
            );


        const revealElements =
            document.querySelectorAll(
                ".reveal, .fade-up"
            );


        /* ===================================================
           ACCESSIBILITY / MOTION PREFERENCE
        =================================================== */

        const prefersReducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        /* ===================================================
           UTILITY
        =================================================== */

        const wait = (milliseconds) =>
            new Promise(
                (resolve) => {

                    window.setTimeout(
                        resolve,
                        milliseconds
                    );

                }
            );


        /* ===================================================
           PAGE LOADED STATE
        =================================================== */

        body.classList.add(
            "loaded"
        );


        /* ===================================================
           THEME SYSTEM
        =================================================== */

        function updateThemeIcon() {

            if (!themeToggle) {
                return;
            }


            const isLight =
                body.classList.contains(
                    "light-mode"
                );


            themeToggle.innerHTML =
                isLight

                    ? '<i class="fas fa-sun" aria-hidden="true"></i>'

                    : '<i class="fas fa-moon" aria-hidden="true"></i>';


            themeToggle.setAttribute(
                "aria-label",
                isLight
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            );


            themeToggle.setAttribute(
                "title",
                isLight
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            );

        }


        function loadSavedTheme() {

            try {

                const savedTheme =
                    localStorage.getItem(
                        "sdh-theme"
                    );


                if (
                    savedTheme ===
                    "light"
                ) {

                    body.classList.add(
                        "light-mode"
                    );

                } else {

                    body.classList.remove(
                        "light-mode"
                    );

                }

            } catch (error) {

                console.warn(
                    "SDH: Unable to read saved theme.",
                    error
                );

            }


            updateThemeIcon();

        }


        function toggleTheme() {

            const isLight =
                body.classList.toggle(
                    "light-mode"
                );


            try {

                localStorage.setItem(
                    "sdh-theme",
                    isLight
                        ? "light"
                        : "dark"
                );

            } catch (error) {

                console.warn(
                    "SDH: Unable to save theme preference.",
                    error
                );

            }


            updateThemeIcon();

        }


        loadSavedTheme();


        if (themeToggle) {

            themeToggle.addEventListener(
                "click",
                toggleTheme
            );

        }


        /* ===================================================
           MOBILE NAVIGATION
        =================================================== */

        function setMenuState(isOpen) {

            if (
                !navLinks ||
                !menuBtn
            ) {

                return;

            }


            navLinks.classList.toggle(
                "active",
                isOpen
            );


            menuBtn.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            const icon =
                menuBtn.querySelector(
                    "i"
                );


            if (icon) {

                icon.classList.toggle(
                    "fa-bars",
                    !isOpen
                );


                icon.classList.toggle(
                    "fa-times",
                    isOpen
                );

            }

        }


        if (
            menuBtn &&
            navLinks
        ) {

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );


            menuBtn.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    const isOpen =
                        navLinks.classList.contains(
                            "active"
                        );


                    setMenuState(
                        !isOpen
                    );

                }
            );

        }


        navItems.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        setMenuState(
                            false
                        );

                    }
                );

            }
        );


        document.addEventListener(
            "click",
            (event) => {

                if (
                    !menuBtn ||
                    !navLinks
                ) {

                    return;

                }


                if (
                    !menuBtn.contains(
                        event.target
                    ) &&
                    !navLinks.contains(
                        event.target
                    )
                ) {

                    setMenuState(
                        false
                    );

                }

            }
        );


        /* ===================================================
           HEADER SCROLL STATE
        =================================================== */

        function updateHeader() {

            if (!header) {
                return;
            }


            header.classList.toggle(
                "scrolled",
                window.scrollY > 50
            );

        }


        /* ===================================================
           BACK TO TOP
        =================================================== */

        function updateBackToTop() {

            if (!topBtn) {
                return;
            }


            const isVisible =
                window.scrollY > 500;


            topBtn.classList.toggle(
                "show",
                isVisible
            );


            topBtn.setAttribute(
                "aria-hidden",
                String(!isVisible)
            );


            /*
             * Prevent an invisible back-to-top
             * button from receiving keyboard focus.
             */

            topBtn.tabIndex =
                isVisible
                    ? 0
                    : -1;

        }


        if (topBtn) {

            topBtn.addEventListener(
                "click",
                () => {

                    window.scrollTo({

                        top: 0,

                        behavior:
                            prefersReducedMotion
                                ? "auto"
                                : "smooth"

                    });

                }
            );

        }


        /* ===================================================
           ACTIVE NAVIGATION
        =================================================== */

        function updateActiveNavigation() {

            if (!sections.length) {
                return;
            }


            const scrollPosition =
                window.scrollY +
                CONFIG.scrollOffset;


            let currentId =
                "";


            sections.forEach(
                (section) => {

                    if (
                        scrollPosition >=
                        section.offsetTop
                    ) {

                        currentId =
                            section.id;

                    }

                }
            );


            navItems.forEach(
                (link) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    const isActive =
                        href ===
                        `#${currentId}`;


                    link.classList.toggle(
                        "active",
                        isActive
                    );

                }
            );

        }


        /* ===================================================
           SCROLL REVEAL
        =================================================== */

        function initializeReveal() {

            if (
                !revealElements.length
            ) {

                return;

            }


            /* ------------------------------------------------
               REDUCED MOTION
            ------------------------------------------------ */

            if (
                prefersReducedMotion
            ) {

                revealElements.forEach(
                    (element) => {

                        element.classList.add(
                            "active",
                            "show"
                        );

                    }
                );


                return;

            }


            /* ------------------------------------------------
               INTERSECTION OBSERVER
            ------------------------------------------------ */

            if (
                "IntersectionObserver"
                in window
            ) {

                const revealObserver =
                    new IntersectionObserver(

                        (
                            entries,
                            observer
                        ) => {

                            entries.forEach(
                                (entry) => {

                                    if (
                                        !entry.isIntersecting
                                    ) {

                                        return;

                                    }


                                    entry.target.classList.add(
                                        "active",
                                        "show"
                                    );


                                    observer.unobserve(
                                        entry.target
                                    );

                                }
                            );

                        },

                        {
                            threshold:
                                CONFIG.revealThreshold
                        }

                    );


                revealElements.forEach(
                    (element) => {

                        revealObserver.observe(
                            element
                        );

                    }
                );


            } else {

                /* --------------------------------------------
                   FALLBACK
                -------------------------------------------- */

                revealElements.forEach(
                    (element) => {

                        element.classList.add(
                            "active",
                            "show"
                        );

                    }
                );

            }

        }


        initializeReveal();


        /* ===================================================
           EXTERNAL LINK SECURITY
        =================================================== */

        document
            .querySelectorAll(
                'a[target="_blank"]'
            )
            .forEach(
                (link) => {

                    link.setAttribute(
                        "rel",
                        "noopener noreferrer"
                    );

                }
            );


        /* ===================================================
           IMAGE HANDLING
        =================================================== */

        document
            .querySelectorAll(
                "img"
            )
            .forEach(
                (image) => {

                    const isHeroImage =
                        Boolean(
                            image.closest(
                                ".hero"
                            )
                        );


                    const isSplashImage =
                        Boolean(
                            image.closest(
                                ".sdh-splash"
                            )
                        );


                    const isLogo =
                        image.classList.contains(
                            "logo"
                        ) ||
                        Boolean(
                            image.closest(
                                ".logo"
                            )
                        );


                    /*
                     * Important images should
                     * not be lazy-loaded.
                     */

                    if (
                        isHeroImage ||
                        isSplashImage ||
                        isLogo
                    ) {

                        if (
                            image.getAttribute(
                                "loading"
                            ) === "lazy"
                        ) {

                            image.removeAttribute(
                                "loading"
                            );

                        }


                        return;

                    }


                    /*
                     * Other images may use
                     * lazy loading.
                     */

                    if (
                        !image.hasAttribute(
                            "loading"
                        )
                    ) {

                        image.setAttribute(
                            "loading",
                            "lazy"
                        );

                    }

                }
            );


        /* ===================================================
           SCROLL CONTROLLER
        =================================================== */

        let scrollTicking =
            false;


        function handleScroll() {

            if (
                scrollTicking
            ) {

                return;

            }


            scrollTicking =
                true;


            window.requestAnimationFrame(
                () => {

                    updateHeader();

                    updateBackToTop();

                    updateActiveNavigation();


                    scrollTicking =
                        false;

                }
            );

        }


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );


        /*
         * Set initial state immediately.
         */

        updateHeader();

        updateBackToTop();

        updateActiveNavigation();


        /* ===================================================
           SPLASH SCREEN
           
           REQUIRED HTML HOOKS:

           #sdh-splash
           .sdh-typing-text
           .sdh-splash-spinner
           .sdh-splash-message
           .sdh-loading-text
           .sdh-loading-dots
           #sdh-notice-modal
           .sdh-notice-btn

           STAGE CLASSES:

           .sdh-stage-spinner
           .sdh-stage-welcome
           .sdh-stage-preparing
           .hidden

           VISIBILITY CLASS:

           .sdh-stage-visible
        =================================================== */

        async function initializeSplash() {

            const splash =
                document.getElementById(
                    "sdh-splash"
                );


            const typingText =
                document.querySelector(
                    ".sdh-typing-text"
                );


            const spinner =
                document.querySelector(
                    ".sdh-splash-spinner"
                );


            const welcome =
                document.querySelector(
                    ".sdh-splash-message"
                );


            const preparing =
                document.querySelector(
                    ".sdh-loading-text"
                );


            const loadingDots =
                document.querySelector(
                    ".sdh-loading-dots"
                );


            const notice =
                document.getElementById(
                    "sdh-notice-modal"
                );


            const noticeButton =
                document.querySelector(
                    ".sdh-notice-btn"
                );


            /* =================================================
               SPLASH NOT PRESENT
            ================================================= */

            if (!splash) {

                return;

            }


            /*
             * If the typing element is missing,
             * never trap the website behind
             * an incomplete splash screen.
             */

            if (!typingText) {

                splash.classList.add(
                    "hidden"
                );


                return;

            }


            /* =================================================
               NOTICE INITIAL STATE
            ================================================= */

            if (notice) {

                notice.classList.add(
                    "sdh-notice-hidden"
                );


                notice.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            /* =================================================
               RESET SPLASH STATE
            ================================================= */

            splash.classList.remove(

                "hidden",

                "sdh-stage-spinner",

                "sdh-stage-welcome",

                "sdh-stage-preparing"

            );


            typingText.classList.remove(
                "sdh-stage-visible"
            );


            typingText.textContent =
                "";


            if (spinner) {

                spinner.classList.remove(
                    "sdh-stage-visible"
                );

            }


            if (welcome) {

                welcome.classList.remove(
                    "sdh-stage-visible"
                );

            }


            if (preparing) {

                preparing.classList.remove(
                    "sdh-stage-visible"
                );

            }


            if (loadingDots) {

                loadingDots.classList.remove(
                    "sdh-stage-visible"
                );


                loadingDots.textContent =
                    "";

            }


            /* =================================================
               STAGE 1 — TYPE BRAND
            ================================================= */

            async function typeBrand() {

                typingText.classList.add(
                    "sdh-stage-visible"
                );


                const brand =
                    "Success Digital Hub";


                for (
                    const character
                    of brand
                ) {

                    typingText.textContent +=
                        character;


                    await wait(

                        prefersReducedMotion
                            ? 150
                            : CONFIG.splashTypingSpeed

                    );

                }

            }


            /* =================================================
               STAGE 2 — SPINNER
            ================================================= */

            async function showSpinnerStage() {

                splash.classList.add(
                    "sdh-stage-spinner"
                );


                if (spinner) {

                    spinner.classList.add(
                        "sdh-stage-visible"
                    );

                }


                await wait(

                    prefersReducedMotion
                        ? 2000
                        : CONFIG.splashSpinnerDuration

                );


                /*
                 * Remove both before
                 * moving to Welcome.
                 */

                typingText.classList.remove(
                    "sdh-stage-visible"
                );


                if (spinner) {

                    spinner.classList.remove(
                        "sdh-stage-visible"
                    );

                }

            }


            /* =================================================
               STAGE 3 — WELCOME
            ================================================= */

            async function showWelcomeStage() {

                splash.classList.remove(
                    "sdh-stage-spinner"
                );


                splash.classList.add(
                    "sdh-stage-welcome"
                );


                if (welcome) {

                    welcome.classList.add(
                        "sdh-stage-visible"
                    );

                }


                await wait(

                    prefersReducedMotion
                        ? 3500
                        : CONFIG.splashWelcomeDuration

                );


                if (welcome) {

                    welcome.classList.remove(
                        "sdh-stage-visible"
                    );

                }

            }


           /* =================================================
   STAGE 4 — PREPARING + ANIMATED DOTS
================================================= */

async function showPreparingStage() {

    console.log("🔵 SDH STAGE 4 STARTED");


    /* ------------------------------------------------
       SWITCH TO PREPARING STAGE
    ------------------------------------------------ */

    splash.classList.remove(
        "sdh-stage-welcome"
    );

    splash.classList.add(
        "sdh-stage-preparing"
    );


    /* ------------------------------------------------
       SHOW PREPARING TEXT
    ------------------------------------------------ */

    if (preparing) {

        preparing.classList.add(
            "sdh-stage-visible"
        );

    }


    /* ------------------------------------------------
       VERIFY DOT ELEMENT
    ------------------------------------------------ */

    if (!loadingDots) {

        console.error(
            "❌ SDH DOTS ERROR → .sdh-loading-dots NOT FOUND"
        );

        await wait(
            CONFIG.splashPreparingDuration
        );

        if (preparing) {

            preparing.classList.remove(
                "sdh-stage-visible"
            );

        }

        return;

    }


    console.log(
        "✅ SDH DOT ELEMENT FOUND:",
        loadingDots
    );


    /* ------------------------------------------------
       RESET DOTS
    ------------------------------------------------ */

    loadingDots.textContent = "";

    loadingDots.style.visibility =
        "visible";

    loadingDots.style.opacity =
        "1";


    /* ------------------------------------------------
       CHECK REDUCED MOTION
    ------------------------------------------------ */

    console.log(
        "🎛️ SDH REDUCED MOTION:",
        prefersReducedMotion
    );


    /* ------------------------------------------------
       REDUCED MOTION MODE
    ------------------------------------------------ */

    if (prefersReducedMotion) {

        /*
         * Accessibility behavior:
         * do not continuously animate.
         */

        loadingDots.textContent =
            "...";


        await wait(
            CONFIG.splashPreparingDuration
        );

    }


    /* ------------------------------------------------
       NORMAL ANIMATED MODE
    ------------------------------------------------ */

    else {

        let dotCount = 1;


        /*
         * Show the first dot immediately.
         */

        loadingDots.textContent =
            ".";


        console.log(
            "🟢 SDH DOT ANIMATION STARTED"
        );


        /*
         * Change the number of dots repeatedly.
         */

        const dotInterval =
            window.setInterval(
                () => {

                    dotCount++;

                    if (
                        dotCount > 3
                    ) {

                        dotCount = 1;

                    }


                    loadingDots.textContent =
                        ".".repeat(
                            dotCount
                        );


                    console.log(
                        "🔵 SDH DOT COUNT:",
                        dotCount
                    );

                },
                CONFIG.splashDotsSpeed
            );


        /*
         * Keep the animation running
         * for the configured dot duration.
         */

        await wait(
            CONFIG.splashDotsDuration
        );


        /*
         * Always stop the interval.
         */

        window.clearInterval(
            dotInterval
        );


        console.log(
            "🛑 SDH DOT ANIMATION STOPPED"
        );


        /*
         * Remove the dots after
         * their animation period.
         */

        loadingDots.textContent =
            "";


        /*
         * If the Preparing stage is
         * longer than the dot animation,
         * wait for the remaining time.
         */

        const remainingPreparationTime =
            Math.max(
                0,
                CONFIG.splashPreparingDuration -
                CONFIG.splashDotsDuration
            );


        if (
            remainingPreparationTime > 0
        ) {

            await wait(
                remainingPreparationTime
            );

        }

    }


    /* ------------------------------------------------
       CLEAN UP
    ------------------------------------------------ */

    loadingDots.textContent =
        "";


    if (preparing) {

        preparing.classList.remove(
            "sdh-stage-visible"
        );

    }


    console.log(
        "✅ SDH STAGE 4 COMPLETE"
    );

}

            /* =================================================
               STAGE 5 — CLOSE SPLASH
            ================================================= */

            async function closeSplash() {

                splash.classList.remove(

                    "sdh-stage-spinner",

                    "sdh-stage-welcome",

                    "sdh-stage-preparing"

                );


                splash.classList.add(
                    "hidden"
                );


                await wait(
                    CONFIG.splashExitDuration
                );

            }


            /* =================================================
               DEVELOPMENT NOTICE
            ================================================= */

            function showNotice() {

                if (!notice) {
                    return;
                }


                notice.classList.remove(
                    "sdh-notice-hidden"
                );


                notice.setAttribute(
                    "aria-hidden",
                    "false"
                );


                if (noticeButton) {

                    noticeButton.focus();

                }

            }


            /* =================================================
               NOTICE BUTTON
            ================================================= */

            if (
                noticeButton &&
                notice
            ) {

                noticeButton.addEventListener(
                    "click",
                    () => {

                        notice.classList.add(
                            "sdh-notice-hidden"
                        );


                        notice.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                    }
                );

            }


            /* =================================================
               ESCAPE KEY — CLOSE NOTICE
            ================================================= */

            if (notice) {

                document.addEventListener(
                    "keydown",
                    (event) => {

                        if (
                            event.key ===
                                "Escape" &&

                            !notice.classList.contains(
                                "sdh-notice-hidden"
                            )
                        ) {

                            notice.classList.add(
                                "sdh-notice-hidden"
                            );


                            notice.setAttribute(
                                "aria-hidden",
                                "true"
                            );

                        }

                    }
                );

            }


            /* =================================================
               COMPLETE SPLASH SEQUENCE
            ================================================= */

            try {

                /*
                 * 1. Type brand.
                 */

                await typeBrand();


                /*
                 * 2. Pause after typing.
                 */

                await wait(

                    prefersReducedMotion
                        ? 100
                        : CONFIG.splashBrandPause

                );


                /*
                 * 3. Spinner.
                 */

                await showSpinnerStage();


                /*
                 * 4. Welcome.
                 */

                await showWelcomeStage();


                /*
                 * 5. Preparing + animated dots.
                 */

                await showPreparingStage();


                /*
                 * 6. Remove splash.
                 */

                await closeSplash();


                /*
                 * 7. Show development notice.
                 */

                showNotice();


            } catch (error) {

                /*
                 * Safety fallback.
                 *
                 * Never leave the website trapped
                 * behind the splash screen.
                 */

                console.error(
                    "SDH Splash error:",
                    error
                );


                splash.classList.remove(

                    "sdh-stage-spinner",

                    "sdh-stage-welcome",

                    "sdh-stage-preparing"

                );


                splash.classList.add(
                    "hidden"
                );

            }

        }


        /* ===================================================
           START SPLASH CONTROLLER
        =================================================== */

        initializeSplash();

    }
);