/* ===========================================================
   SUCCESS DIGITAL HUB (SDH)
   FINAL CONSOLIDATED SCRIPT.JS

   Designed for:
   - SDH Portfolio
   - Current HTML structure
   - Current CSS structure
   - Desktop / tablet / mobile layouts

   Main functionality:
   - Splash screen
   - Slower spinner
   - Typed welcome message
   - Platform update notice on EVERY refresh
   - Dark / light mode
   - Theme persistence
   - Mobile navigation
   - Active navigation
   - Scroll reveal
   - Header scroll state
   - Back-to-top button
   - External-link protection
   - Accessibility support
   - Reduced-motion support
   - Defensive error handling
=========================================================== */

"use strict";


/* ===========================================================
   CONFIGURATION
=========================================================== */

const SDH_CONFIG = Object.freeze({

    /* Navigation */
    scrollOffset: 120,

    /* Scroll reveal */
    revealThreshold: 0.15,

    /* Back-to-top */
    topButtonThreshold: 500,

    /* Mobile navigation breakpoint */
    desktopBreakpoint: 993,

    /* Splash screen */
    splash: Object.freeze({

        /*
         * Spinner is intentionally slower than the previous
         * version so the loading stage feels deliberate.
         */
        spinnerDuration: 2600,

        /*
         * Speed of the welcome message typing effect.
         * Smaller number = faster typing.
         */
        welcomeTypingSpeed: 30,

        /*
         * Pause after the welcome message finishes typing.
         * This is the requested short 1–3 second pause.
         */
        welcomeHoldDuration: 1800,

        /*
         * Splash fade-out time.
         */
        exitDuration: 700
    })
});


/* ===========================================================
   SAFE DOM HELPERS
=========================================================== */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);


const $$ = (selector, parent = document) =>
    parent.querySelectorAll(selector);


const addClass = (element, className) => {

    if (element) {
        element.classList.add(className);
    }

};


const removeClass = (element, className) => {

    if (element) {
        element.classList.remove(className);
    }

};


const wait = (milliseconds) =>
    new Promise((resolve) =>
        window.setTimeout(resolve, milliseconds)
    );


/* ===========================================================
   SAFE STORAGE
=========================================================== */

const SDHStorage = {

    get(key) {

        try {

            return window.localStorage.getItem(key);

        } catch (error) {

            return null;

        }

    },


    set(key, value) {

        try {

            window.localStorage.setItem(
                key,
                value
            );

        } catch (error) {

            /* Storage may be unavailable.
               The website continues normally. */

        }

    }

};


/* ===========================================================
   DOM READY
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           CORE ELEMENTS
        ===================================================== */

        const body =
            document.body;

        const header =
            $(".header");

        const menuBtn =
            $("#menu-btn");

        const navLinks =
            $(".nav-links");

        const themeToggle =
            $("#theme-toggle");

        const topBtn =
            $("#topBtn");


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        const reducedMotion =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        /* =====================================================
           BODY SAFETY
        ===================================================== */

        function revealBody() {

            if (body) {

                body.classList.add(
                    "loaded"
                );

            }

        }


        /* =====================================================
           THEME MANAGEMENT
        ===================================================== */

        function updateThemeIcon() {

            if (!themeToggle) {
                return;
            }

            const icon =
                $("i", themeToggle);

            if (!icon) {
                return;
            }

            const isLight =
                body.classList.contains(
                    "light-mode"
                );


            icon.classList.toggle(
                "fa-sun",
                isLight
            );

            icon.classList.toggle(
                "fa-moon",
                !isLight
            );


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


            themeToggle.setAttribute(
                "aria-pressed",
                String(isLight)
            );

        }


        function getInitialTheme() {

            const savedTheme =
                SDHStorage.get(
                    "sdh-theme"
                );


            if (
                savedTheme === "light" ||
                savedTheme === "dark"
            ) {

                return savedTheme;

            }


            if (
                window.matchMedia &&
                window.matchMedia(
                    "(prefers-color-scheme: light)"
                ).matches
            ) {

                return "light";

            }


            return "dark";

        }


        function applyTheme(theme) {

            if (
                theme === "light"
            ) {

                body.classList.add(
                    "light-mode"
                );

            } else {

                body.classList.remove(
                    "light-mode"
                );

            }


            updateThemeIcon();

        }


        applyTheme(
            getInitialTheme()
        );


        if (themeToggle) {

            themeToggle.addEventListener(
                "click",
                function () {

                    const isLight =
                        body.classList.toggle(
                            "light-mode"
                        );


                    SDHStorage.set(
                        "sdh-theme",
                        isLight
                            ? "light"
                            : "dark"
                    );


                    updateThemeIcon();

                }
            );

        }


        /* =====================================================
           MOBILE NAVIGATION
        ===================================================== */

        function setMenuState(
            isOpen
        ) {

            if (
                !menuBtn ||
                !navLinks
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


            menuBtn.setAttribute(
                "aria-label",
                isOpen
                    ? "Close Navigation"
                    : "Open Navigation"
            );


            const icon =
                $("i", menuBtn);


            if (icon) {

                /*
                 * Font Awesome 6 uses fa-xmark.
                 */
                icon.classList.toggle(
                    "fa-bars",
                    !isOpen
                );

                icon.classList.toggle(
                    "fa-xmark",
                    isOpen
                );

                /*
                 * Compatibility with older
                 * Font Awesome naming.
                 */
                icon.classList.toggle(
                    "fa-times",
                    isOpen
                );

            }

        }


        function closeMenu() {

            setMenuState(false);

        }


        function openMenu() {

            setMenuState(true);

        }


        if (
            menuBtn &&
            navLinks
        ) {

            setMenuState(false);


            menuBtn.addEventListener(
                "click",
                function (event) {

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


            $$(".nav-links a")
                .forEach(
                    function (link) {

                        link.addEventListener(
                            "click",
                            function () {

                                closeMenu();

                            }
                        );

                    }
                );


            document.addEventListener(
                "click",
                function (event) {

                    if (
                        !menuBtn.contains(
                            event.target
                        ) &&
                        !navLinks.contains(
                            event.target
                        )
                    ) {

                        closeMenu();

                    }

                }
            );

        }


        /* =====================================================
           ESCAPE KEY
        ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeMenu();

                    closeNotice();

                }

            }
        );


        /* =====================================================
           RESPONSIVE NAVIGATION SAFETY
        ===================================================== */

        function handleResize() {

            if (
                window.innerWidth >=
                SDH_CONFIG.desktopBreakpoint
            ) {

                closeMenu();

            }

        }


        window.addEventListener(
            "resize",
            handleResize,
            {
                passive: true
            }
        );


        /* =====================================================
           HEADER SCROLL EFFECT
        ===================================================== */

        function updateHeader() {

            if (!header) {
                return;
            }


            header.classList.toggle(
                "scrolled",
                window.scrollY > 50
            );

        }


        /* =====================================================
           SCROLL REVEAL
        ===================================================== */

        const revealElements =
            $$(".reveal, .fade-up");


        function revealOnScroll() {

            if (!revealElements.length) {
                return;
            }


            const trigger =
                window.innerHeight *
                (
                    1 -
                    SDH_CONFIG.revealThreshold
                );


            revealElements.forEach(
                function (element) {

                    const position =
                        element.getBoundingClientRect()
                            .top;


                    if (
                        position <
                        trigger
                    ) {

                        addClass(
                            element,
                            "active"
                        );

                        addClass(
                            element,
                            "show"
                        );

                    }

                }
            );

        }


        /* =====================================================
           REDUCED-MOTION REVEAL
        ===================================================== */

        if (
            reducedMotion
        ) {

            revealElements.forEach(
                function (element) {

                    addClass(
                        element,
                        "active"
                    );

                    addClass(
                        element,
                        "show"
                    );

                }
            );

        }


        /* =====================================================
           ACTIVE NAVIGATION
        ===================================================== */

        const sections =
            $$("section[id]");

        const navItems =
            $$(".nav-links a");


        function updateActiveNav() {

            if (
                !sections.length ||
                !navItems.length
            ) {

                return;

            }


            let currentSection =
                "";


            sections.forEach(
                function (section) {

                    const sectionTop =
                        section.offsetTop -
                        SDH_CONFIG.scrollOffset;


                    if (
                        window.scrollY >=
                        sectionTop
                    ) {

                        currentSection =
                            section.id;

                    }

                }
            );


            navItems.forEach(
                function (link) {

                    const target =
                        link.getAttribute(
                            "href"
                        );


                    const isActive =
                        target ===
                        "#" +
                        currentSection;


                    link.classList.toggle(
                        "active",
                        isActive
                    );

                }
            );

        }


        /* =====================================================
           BACK TO TOP
        ===================================================== */

        function updateTopButton() {

            if (!topBtn) {
                return;
            }


            topBtn.classList.toggle(
                "show",
                window.scrollY >
                SDH_CONFIG.topButtonThreshold
            );

        }


        if (topBtn) {

            topBtn.addEventListener(
                "click",
                function () {

                    if (
                        reducedMotion
                    ) {

                        window.scrollTo(
                            0,
                            0
                        );

                    } else {

                        window.scrollTo({

                            top: 0,

                            behavior: "smooth"

                        });

                    }

                }
            );

        }


        /* =====================================================
           EXTERNAL LINK SAFETY
        ===================================================== */

        $$(
            'a[target="_blank"]'
        ).forEach(
            function (link) {

                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );

            }
        );


        /* =====================================================
           SCROLL HANDLER
        ===================================================== */

        function handleScroll() {

            updateHeader();

            revealOnScroll();

            updateActiveNav();

            updateTopButton();

        }


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );


        /* =====================================================
           INITIAL PAGE STATE
        ===================================================== */

        handleScroll();


        /* =====================================================
           PLATFORM UPDATE NOTICE
        ===================================================== */

        const notice =
            $("#sdh-notice-modal");


        const noticeButton =
            $(
                ".sdh-notice-btn, #sdh-notice-ok"
            );


        function openNotice() {

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


            /*
             * Prevent background scrolling while
             * the platform notice is active.
             */
            body.style.overflow =
                "hidden";


            if (noticeButton) {

                window.setTimeout(
                    function () {

                        noticeButton.focus();

                    },
                    100
                );

            }

        }


        function closeNotice() {

            if (!notice) {
                return;
            }


            notice.classList.add(
                "sdh-notice-hidden"
            );


            notice.setAttribute(
                "aria-hidden",
                "true"
            );


            /*
             * Restore normal page scrolling.
             */
            body.style.overflow =
                "";

        }


        if (noticeButton) {

            noticeButton.addEventListener(
                "click",
                function () {

                    closeNotice();

                }
            );

        }


        /*
         * Clicking directly on the modal backdrop
         * does NOT automatically close it.
         *
         * The user should intentionally press
         * OK / Continue.
         */
        if (notice) {

            notice.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        /* =====================================================
           PLACEHOLDER LINK PROTECTION
        ===================================================== */

        const placeholderLinks =
            $$(
                'a[href="#"],' +
                'a[href="https://YOUR_BEHANCE_URL"]'
            );


        placeholderLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        /*
                         * Only intercept obvious
                         * placeholder destinations.
                         */
                        if (
                            href === "#" ||
                            href ===
                            "https://YOUR_BEHANCE_URL"
                        ) {

                            event.preventDefault();

                            openNotice();

                        }

                    }
                );

            }
        );


        /* =====================================================
           SPLASH SCREEN
           
           FINAL SDH SEQUENCE:

           1. Show splash
           2. Spinner runs slowly
           3. Spinner disappears
           4. Welcome message types
           5. Hold welcome for a short period
           6. Splash disappears
           7. Platform update notice appears
           8. User presses OK / Continue
           9. Full portfolio becomes available
        ===================================================== */

        const splash =
            $("#sdh-splash");


        /*
         * Current / updated splash elements.
         */
        const spinner =
            $(".sdh-splash-spinner");


        const welcome =
            $(".sdh-splash-message");


        /*
         * Legacy typing element is supported defensively.
         * If the updated HTML still contains it, it will
         * not cause an error.
         */
        const legacyTypingText =
            $(".sdh-typing-text");


        const preparing =
            $(".sdh-loading-text");


        const loadingDots =
            $(".sdh-loading-dots");


        /* =====================================================
           SPLASH ELEMENT VISIBILITY
        ===================================================== */

        function setSplashElementVisible(
            element,
            visible
        ) {

            if (!element) {
                return;
            }


            element.style.display =
                visible
                    ? ""
                    : "none";


            element.classList.toggle(
                "sdh-stage-visible",
                visible
            );

        }


        /* =====================================================
           RESET SPLASH
        ===================================================== */

        function resetSplash() {

            if (!splash) {
                return;
            }


            splash.classList.remove(
                "hidden",
                "sdh-stage-spinner",
                "sdh-stage-welcome",
                "sdh-stage-preparing"
            );


            /*
             * Spinner starts hidden.
             */
            setSplashElementVisible(
                spinner,
                false
            );


            /*
             * Welcome starts hidden.
             */
            setSplashElementVisible(
                welcome,
                false
            );


            /*
             * Preparing stage is no longer part
             * of the main SDH startup sequence,
             * but we hide it defensively if it exists.
             */
            setSplashElementVisible(
                preparing,
                false
            );


            if (loadingDots) {

                loadingDots.textContent =
                    "";

            }


            /*
             * Hide any legacy typing element.
             */
            if (legacyTypingText) {

                legacyTypingText.textContent =
                    "";

            }

        }


        /* =====================================================
           SHOW SPINNER
        ===================================================== */

        async function runSpinner() {

            if (!splash) {
                return;
            }


            splash.classList.add(
                "sdh-stage-spinner"
            );


            setSplashElementVisible(
                spinner,
                true
            );


            /*
             * Slower spinner duration.
             */
            await wait(
                reducedMotion
                    ? 800
                    : SDH_CONFIG.splash.spinnerDuration
            );


            setSplashElementVisible(
                spinner,
                false
            );


            splash.classList.remove(
                "sdh-stage-spinner"
            );

        }


        /* =====================================================
           GET WELCOME MESSAGE
        ===================================================== */

        function getWelcomeMessage() {

            /*
             * If HTML contains an explicit data attribute,
             * use it first.
             *
             * Example:
             * data-message="Welcome to Success Digital Hub"
             */
            if (welcome) {

                const customMessage =
                    welcome.getAttribute(
                        "data-message"
                    );


                if (
                    customMessage &&
                    customMessage.trim()
                ) {

                    return customMessage.trim();

                }


                /*
                 * Otherwise use the text already
                 * written inside the HTML.
                 */
                const existingText =
                    welcome.textContent.trim();


                if (existingText) {

                    return existingText;

                }

            }


            /*
             * Safe SDH fallback.
             */
            return "Welcome to Success Digital Hub";

        }


        /* =====================================================
           TYPE WELCOME MESSAGE
        ===================================================== */

        async function typeWelcome() {

            if (!welcome) {
                return;
            }


            const message =
                getWelcomeMessage();


            /*
             * Remove existing text before typing.
             */
            welcome.textContent =
                "";


            /*
             * Make welcome message visible.
             */
            splash.classList.add(
                "sdh-stage-welcome"
            );


            setSplashElementVisible(
                welcome,
                true
            );


            /*
             * Reduced motion:
             * display immediately instead of
             * animating character-by-character.
             */
            if (reducedMotion) {

                welcome.textContent =
                    message;

                await wait(900);

                return;

            }


            /*
             * Actual typing effect.
             */
            for (
                const character
                of message
            ) {

                welcome.textContent +=
                    character;


                await wait(
                    SDH_CONFIG.splash
                        .welcomeTypingSpeed
                );

            }


            /*
             * Keep the complete welcome
             * message visible for a short while.
             */
            await wait(
                SDH_CONFIG.splash
                    .welcomeHoldDuration
            );

        }


        /* =====================================================
           CLOSE SPLASH
        ===================================================== */

        async function closeSplash() {

            if (!splash) {
                return;
            }


            /*
             * Hide splash.
             */
            splash.classList.add(
                "hidden"
            );


            /*
             * Allow CSS transition to complete.
             */
            await wait(
                reducedMotion
                    ? 0
                    : SDH_CONFIG.splash
                        .exitDuration
            );


            /*
             * Ensure it remains inaccessible
             * after the transition.
             */
            splash.setAttribute(
                "aria-hidden",
                "true"
            );


            /*
             * Restore scrolling.
             */
            body.style.overflow =
                "";

        }


        /* =====================================================
           COMPLETE SPLASH SEQUENCE
        ===================================================== */

        async function runSplashSequence() {

            /*
             * If the splash is absent, the main
             * portfolio should still function.
             */
            if (!splash) {

                revealBody();

                /*
                 * Still show the platform notice
                 * on every refresh.
                 */
                openNotice();

                return;

            }


            /*
             * Keep the page locked while splash
             * is running.
             */
            body.style.overflow =
                "hidden";


            splash.setAttribute(
                "aria-hidden",
                "false"
            );


            resetSplash();


            /*
             * STEP 1
             * Slower spinner.
             */
            await runSpinner();


            /*
             * STEP 2
             * Typed welcome message.
             */
            await typeWelcome();


            /*
             * STEP 3
             * Close splash.
             */
            await closeSplash();


            /*
             * STEP 4
             * Immediately after splash:
             * platform update notice.
             */
            openNotice();

        }


        /* =====================================================
           SPLASH FAIL-SAFE
        ===================================================== */

        function splashFailSafe(
            error
        ) {

            console.error(
                "SDH Splash error:",
                error
            );


            if (splash) {

                splash.classList.add(
                    "hidden"
                );


                splash.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            body.style.overflow =
                "";


            revealBody();


            /*
             * Even if the splash fails,
             * the platform notice must still
             * appear on this refresh.
             */
            openNotice();

        }


        /* =====================================================
           START SDH
        ===================================================== */

        revealBody();


        runSplashSequence()
            .catch(
                splashFailSafe
            );


    }
);