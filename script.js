/* =========================================================
   SUCCESS DIGITAL HUB (SDH)
   MAIN JAVASCRIPT
   =========================================================

   Handles:
   - Theme toggle
   - Mobile navigation
   - Active navigation
   - Scroll reveal
   - Header scroll state
   - Back-to-top button
   - Splash screen + typing animation
   - Platform update notification modal
   - Placeholder social/business links
   - External link safety
   - Reduced-motion accessibility
   - Defensive error handling
========================================================= */

(() => {
  "use strict";


  /* =========================================================
     1. SDH CONFIGURATION
  ========================================================= */

  const SDH_CONFIG = Object.freeze({

    scrollOffset: 120,

    revealThreshold: 0.15,

    topButtonThreshold: 500,

    desktopBreakpoint: 993,

    splash: Object.freeze({
      spinnerDuration: 4000,
      welcomeTypingSpeed: 20,
      welcomeHoldDuration: 1800,
      exitDuration: 700,
      failSafeDuration: 10000
    })

  });


  /* =========================================================
     2. HELPER FUNCTIONS
  ========================================================= */

  const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
  };


  const $$ = (selector, parent = document) => {
    return Array.from(parent.querySelectorAll(selector));
  };


  const wait = (milliseconds) => {
    return new Promise(resolve => {
      window.setTimeout(resolve, milliseconds);
    });
  };


  const isReducedMotion = () => {
    try {
      return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    } catch (error) {
      return false;
    }
  };


  const safeStorageGet = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };


  const safeStorageSet = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* Storage may be unavailable. Ignore safely. */
    }
  };


  /* =========================================================
     3. ELEMENT REFERENCES
  ========================================================= */

  const body = document.body;

  const header = $(".header");

  const themeToggle = $("#theme-toggle");

  const menuButton = $("#menu-btn");

  const navigation = $("#site-navigation");

  const navLinks = $$(".nav-links a");

  const topButton = $("#topBtn");

  const splash = $("#sdh-splash");

  const splashSpinner = $(".sdh-splash-spinner");

  const splashMessage = $(".sdh-splash-message");

  const noticeModal = $("#sdh-notice-modal");

  const noticeButton = $("#sdh-notice-ok");


  /* =========================================================
     4. THEME SYSTEM
  ========================================================= */

  function updateThemeButton() {

    if (!themeToggle) return;

    const lightMode = body.classList.contains("light-mode");

    themeToggle.setAttribute(
      "aria-label",
      lightMode
        ? "Switch to dark mode"
        : "Switch to light mode"
    );

    themeToggle.setAttribute(
      "aria-pressed",
      lightMode ? "true" : "false"
    );

    /*
      Keep compatibility with either:
      <i class="fas fa-moon"></i>
      or
      <i class="fas fa-sun"></i>
    */

    const icon = $("i", themeToggle);

    if (icon) {

      icon.classList.toggle("fa-moon", !lightMode);

      icon.classList.toggle("fa-sun", lightMode);

    }

  }


  function applySavedTheme() {

    const savedTheme = safeStorageGet("sdh-theme");

    if (savedTheme === "light") {

      body.classList.add("light-mode");

    } else if (savedTheme === "dark") {

      body.classList.remove("light-mode");

    }

    updateThemeButton();

  }


  function toggleTheme() {

    const isLight = body.classList.toggle("light-mode");

    safeStorageSet(
      "sdh-theme",
      isLight ? "light" : "dark"
    );

    updateThemeButton();

  }


  function setupTheme() {

    applySavedTheme();

    if (!themeToggle) return;

    themeToggle.addEventListener("click", toggleTheme);

  }


  /* =========================================================
     5. MOBILE NAVIGATION
  ========================================================= */

  function closeMobileNavigation() {

    if (!navigation) return;

    navigation.classList.remove("active");

    if (menuButton) {

      menuButton.classList.remove("active");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }


  function toggleMobileNavigation() {

    if (!navigation) return;

    const isOpen = navigation.classList.toggle("active");

    if (menuButton) {

      menuButton.classList.toggle(
        "active",
        isOpen
      );

      menuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    }

  }


  function setupMobileNavigation() {

    if (!menuButton || !navigation) return;

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-controls",
      navigation.id || "site-navigation"
    );


    menuButton.addEventListener(
      "click",
      toggleMobileNavigation
    );


    navLinks.forEach(link => {

      link.addEventListener(
        "click",
        closeMobileNavigation
      );

    });


    document.addEventListener(
      "click",
      event => {

        if (!navigation.classList.contains("active")) {
          return;
        }

        const clickedInsideNavigation =
          navigation.contains(event.target);

        const clickedMenuButton =
          menuButton.contains(event.target);

        if (
          !clickedInsideNavigation &&
          !clickedMenuButton
        ) {

          closeMobileNavigation();

        }

      }
    );


    window.addEventListener(
      "resize",
      () => {

        if (
          window.innerWidth >=
          SDH_CONFIG.desktopBreakpoint
        ) {

          closeMobileNavigation();

        }

      }
    );

  }


  /* =========================================================
     6. ACTIVE NAVIGATION
  ========================================================= */

  function setupActiveNavigation() {

    if (!navLinks.length) return;

    const sections = $$("main section[id]");

    if (!sections.length) return;


    const updateActiveNavigation = () => {

      const scrollPosition =
        window.scrollY +
        SDH_CONFIG.scrollOffset;


      let currentSection = "";


      sections.forEach(section => {

        const sectionTop = section.offsetTop;

        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {

          currentSection = section.id;

        }

      });


      navLinks.forEach(link => {

        const href = link.getAttribute("href");

        const isActive =
          currentSection &&
          href === `#${currentSection}`;

        link.classList.toggle(
          "active",
          Boolean(isActive)
        );

      });

    };


    let ticking = false;


    const onScroll = () => {

      if (ticking) return;

      window.requestAnimationFrame(() => {

        updateActiveNavigation();

        ticking = false;

      });

      ticking = true;

    };


    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );


    updateActiveNavigation();

  }


  /* =========================================================
     7. HEADER SCROLL EFFECT
  ========================================================= */

  function setupHeaderScroll() {

    if (!header) return;


    const updateHeader = () => {

      header.classList.toggle(
        "scrolled",
        window.scrollY > 50
      );

    };


    window.addEventListener(
      "scroll",
      updateHeader,
      { passive: true }
    );


    updateHeader();

  }


  /* =========================================================
     8. SCROLL REVEAL
  ========================================================= */

  function setupScrollReveal() {

    const revealElements =
      $$(".reveal, .fade-in, .slide-up, .scroll-reveal");


    if (!revealElements.length) return;


    /*
      If the visitor prefers reduced motion,
      reveal everything immediately.
    */

    if (isReducedMotion()) {

      revealElements.forEach(element => {

        element.classList.add(
          "visible",
          "active",
          "revealed"
        );

      });

      return;

    }


    if (!("IntersectionObserver" in window)) {

      revealElements.forEach(element => {

        element.classList.add(
          "visible",
          "active",
          "revealed"
        );

      });

      return;

    }


    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }


            entry.target.classList.add(
              "visible",
              "active",
              "revealed"
            );


            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold:
            SDH_CONFIG.revealThreshold
        }
      );


    revealElements.forEach(element => {

      observer.observe(element);

    });

  }


  /* =========================================================
     9. BACK-TO-TOP BUTTON
  ========================================================= */

  function setupBackToTop() {

    if (!topButton) return;


    const updateTopButton = () => {

      topButton.classList.toggle(
        "show",
        window.scrollY >
          SDH_CONFIG.topButtonThreshold
      );

    };


    topButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior:
            isReducedMotion()
              ? "auto"
              : "smooth"
        });

      }
    );


    window.addEventListener(
      "scroll",
      updateTopButton,
      { passive: true }
    );


    updateTopButton();

  }


  /* =========================================================
     10. EXTERNAL LINK SAFETY
  ========================================================= */

  function setupExternalLinks() {

    const links = $$(
      'a[target="_blank"]'
    );


    links.forEach(link => {

      const currentRel =
        link.getAttribute("rel") || "";


      const relValues =
        currentRel
          .split(/\s+/)
          .filter(Boolean);


      if (!relValues.includes("noopener")) {

        relValues.push("noopener");

      }


      if (!relValues.includes("noreferrer")) {

        relValues.push("noreferrer");

      }


      link.setAttribute(
        "rel",
        relValues.join(" ")
      );

    });

  }


  /* =========================================================
     11. PLATFORM UPDATE MODAL
  ========================================================= */

  function openNotice() {

    if (!noticeModal) return;


    noticeModal.classList.remove(
      "sdh-notice-hidden"
    );


    noticeModal.setAttribute(
      "aria-hidden",
      "false"
    );


    /*
      Prevent the background page from scrolling
      while the notification is open.
    */

    body.style.overflow = "hidden";


    if (noticeButton) {

      window.setTimeout(() => {

        noticeButton.focus();

      }, 50);

    }

  }


  function closeNotice() {

    if (!noticeModal) return;


    noticeModal.classList.add(
      "sdh-notice-hidden"
    );


    noticeModal.setAttribute(
      "aria-hidden",
      "true"
    );


    body.style.overflow = "";

  }


  function setupNoticeModal() {

    if (!noticeModal) return;


    noticeModal.setAttribute(
      "aria-hidden",
      "true"
    );


    /*
      Close using the existing OK button.
    */

    if (noticeButton) {

      noticeButton.addEventListener(
        "click",
        closeNotice
      );

    }


    /*
      Clicking the dark overlay closes the modal.
    */

    noticeModal.addEventListener(
      "click",
      event => {

        if (
          event.target === noticeModal
        ) {

          closeNotice();

        }

      }
    );


    /*
      Escape key closes the modal.
    */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          !noticeModal.classList.contains(
            "sdh-notice-hidden"
          )
        ) {

          closeNotice();

        }

      }
    );

  }


  /* =========================================================
     12. PLACEHOLDER LINKS
  ========================================================= */

  function setupPlaceholderLinks() {

    /*
      IMPORTANT:
      We intentionally KEEP these placeholder URLs
      inside the HTML.

      Behance:
      https://YOUR_BEHANCE_URL

      Facebook:
      href="#"

      Instead of allowing either one to behave
      like a broken link, clicking them opens
      the existing SDH Platform Update modal.
    */


    const behancePlaceholderLinks =
      $$(
        'a[href="https://YOUR_BEHANCE_URL"]'
      );


    const facebookPlaceholderLinks =
      $$(
        'a[aria-label="Facebook"][href="#"]'
      );


    const placeholderLinks = [
      ...behancePlaceholderLinks,
      ...facebookPlaceholderLinks
    ];


    placeholderLinks.forEach(link => {

      link.addEventListener(
        "click",
        event => {

          event.preventDefault();

          openNotice();

        }
      );

    });

  }


  /* =========================================================
     13. SPLASH MESSAGE CONTENT
  ========================================================= */

  function prepareSplashMessage() {

    if (!splashMessage) return null;


    /*
      We rebuild ONLY the inside of the welcome
      message so the typing effect can work while
      preserving the three SDH brand colours.
    */


    splashMessage.innerHTML = "";


    const welcomeText =
      document.createElement("span");

    welcomeText.className =
      "sdh-splash-typing-white";

    splashMessage.appendChild(
      welcomeText
    );


    const successText =
      document.createElement("span");

    successText.className =
      "sdh-brand-white";

    splashMessage.appendChild(
      successText
    );


    const digitalText =
      document.createElement("span");

    digitalText.className =
      "sdh-brand-blue";

    splashMessage.appendChild(
      digitalText
    );


    const hubText =
      document.createElement("span");

    hubText.className =
      "sdh-brand-white";

    splashMessage.appendChild(
      hubText
    );


    return {
      welcomeText,
      successText,
      digitalText,
      hubText
    };

  }


  /* =========================================================
     14. SPLASH TYPING EFFECT
  ========================================================= */

  async function typeText(
    element,
    text,
    speed
  ) {

    if (!element) return;


    element.textContent = "";


    for (
      let index = 0;
      index < text.length;
      index++
    ) {

      element.textContent +=
        text.charAt(index);


      await wait(speed);

    }

  }


  async function runSplashTyping() {

    if (!splashMessage) return;


    const parts =
      prepareSplashMessage();


    if (!parts) return;


    const {
      welcomeText,
      successText,
      digitalText,
      hubText
    } = parts;


    /*
      Reduced-motion users should not be forced
      through a character-by-character animation.
    */

    if (isReducedMotion()) {

      welcomeText.textContent =
        "Welcome to ";

      successText.textContent =
        "SUCCESS ";

      digitalText.textContent =
        "DIGITAL ";

      hubText.textContent =
        "HUB";

      splashMessage.classList.remove(
        "typing"
      );

      splashMessage.classList.add(
        "typed"
      );

      return;

    }


    splashMessage.classList.add(
      "typing"
    );


    /*
      The wording and order remain exactly:

      Welcome to
      SUCCESS
      DIGITAL
      HUB
    */

    await typeText(
      welcomeText,
      "Welcome to ",
      SDH_CONFIG.splash.welcomeTypingSpeed
    );


    await typeText(
      successText,
      "SUCCESS ",
      SDH_CONFIG.splash.welcomeTypingSpeed
    );


    await typeText(
      digitalText,
      "DIGITAL ",
      SDH_CONFIG.splash.welcomeTypingSpeed
    );


    await typeText(
      hubText,
      "HUB",
      SDH_CONFIG.splash.welcomeTypingSpeed
    );


    splashMessage.classList.remove(
      "typing"
    );


    splashMessage.classList.add(
      "typed"
    );

  }


  /* =========================================================
     15. SPLASH SCREEN CONTROL
  ========================================================= */

  function resetSplash() {

    if (!splash) return;


    splash.classList.remove(
      "hidden"
    );


    splash.setAttribute(
      "aria-hidden",
      "false"
    );


    /*
      Ensure the spinner is visible.
    */

    if (splashSpinner) {

      splashSpinner.style.display =
        "block";

    }


    /*
      Ensure the welcome message is visible.
    */

    if (splashMessage) {

      splashMessage.style.display =
        "block";

      splashMessage.classList.remove(
        "typed"
      );

      splashMessage.classList.remove(
        "typing"
      );

    }

  }


  async function closeSplash() {

    if (!splash) return;


    splash.classList.add(
      "hidden"
    );


    splash.setAttribute(
      "aria-hidden",
      "true"
    );


    body.style.overflow = "";


    /*
      Allow the CSS transition to complete.
    */

    if (!isReducedMotion()) {

      await wait(
        SDH_CONFIG.splash.exitDuration
      );

    }


    /*
      Remove the splash from keyboard interaction
      after the transition.
    */

    splash.setAttribute(
      "inert",
      ""
    );

  }


  function splashFailSafe() {

    if (!splash) return;


    splash.classList.add(
      "hidden"
    );


    splash.setAttribute(
      "aria-hidden",
      "true"
    );


    body.style.overflow = "";


    /*
      If something unexpectedly prevents the normal
      splash sequence from finishing, the website
      remains usable.
    */

  }


  async function runSplashSequence() {

    if (!splash) return;


    resetSplash();


    /*
      Keep the original SDH splash independent from
      the site's light/dark theme.
    */

    body.style.overflow = "hidden";


    /*
      Reduced-motion users get the content immediately.
    */

    if (isReducedMotion()) {

  await runSplashTyping();

  await closeSplash();

  // Show the platform update notice after the splash closes.
  await wait(500);
  openNotice();

  return;

}

    /*
      Start the typing effect immediately while the
      splash remains visible.
    */

    const typingPromise =
      runSplashTyping();


    /*
      Keep the spinner/splash visible for the configured
      duration.
    */

    await wait(
      SDH_CONFIG.splash.spinnerDuration
    );


    /*
      Make sure typing has completed before leaving.
    */

    await typingPromise;


    /*
      Give the completed welcome message a short moment
      to remain visible.
    */

    await wait(
      SDH_CONFIG.splash.welcomeHoldDuration
    );
    

  await closeSplash();

// Show the platform update notice after the splash closes.
await wait(500);
openNotice();

}

  function setupSplash() {

    if (!splash) return;


    /*
      Make sure the splash starts in a known state.
    */

    splash.removeAttribute(
      "inert"
    );


    resetSplash();


    /*
      Safety mechanism.
    */

    const failSafeTimer =
      window.setTimeout(
        splashFailSafe,
        SDH_CONFIG.splash.failSafeDuration
      );


    runSplashSequence()
      .catch(error => {

        console.error(
          "SDH Splash Error:",
          error
        );

        splashFailSafe();

      })
      .finally(() => {

        window.clearTimeout(
          failSafeTimer
        );

      });

  }


  /* =========================================================
     16. KEYBOARD ACCESSIBILITY
  ========================================================= */

  function setupKeyboardAccessibility() {

    document.addEventListener(
      "keydown",
      event => {

        /*
          Escape closes the mobile navigation.
        */

        if (
          event.key === "Escape" &&
          navigation &&
          navigation.classList.contains("active")
        ) {

          closeMobileNavigation();

          if (menuButton) {

            menuButton.focus();

          }

        }

      }
    );

  }


  /* =========================================================
     17. INITIALIZATION
  ========================================================= */

  function initializeSDH() {

    /*
      Theme first so the main website has the correct
      appearance as soon as possible.
    */

    setupTheme();


    setupMobileNavigation();


    setupActiveNavigation();


    setupHeaderScroll();


    setupScrollReveal();


    setupBackToTop();


    setupExternalLinks();


    setupNoticeModal();


    setupPlaceholderLinks();


    setupKeyboardAccessibility();


    setupSplash();

  }


  /* =========================================================
     18. DOM READY
  ========================================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeSDH,
      { once: true }
    );

  } else {

    initializeSDH();

  }


  /* =========================================================
     19. GLOBAL ERROR PROTECTION
  ========================================================= */

  window.addEventListener(
    "error",
    event => {

      /*
        Do not allow an unexpected JavaScript error
        to permanently trap the splash screen.
      */

      if (
        splash &&
        !splash.classList.contains("hidden")
      ) {

        splashFailSafe();

      }

      console.error(
        "SDH JavaScript Error:",
        event.error || event.message
      );

    }
  );


  window.addEventListener(
    "unhandledrejection",
    event => {

      if (
        splash &&
        !splash.classList.contains("hidden")
      ) {

        splashFailSafe();

      }

      console.error(
        "SDH Promise Error:",
        event.reason
      );

    }
  );


})();