export function initNavigation() {
  const wrapper = document.getElementById("navbar-wrapper");

  if (!wrapper) return;

  const navBg = document.getElementById("navBg");
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileMenuPanel = document.getElementById("mobileMenuPanel");

  let lastScrollY = window.scrollY;
  const scrollThreshold = 50;
  let isMenuOpen = false;

  function updateShadow() {
    const currentScrollY = window.scrollY;
    const isExpanded = !wrapper.classList.contains("is-hidden") || isMenuOpen;

    if (currentScrollY > 10 && isExpanded) {
      navBg.classList.add("has-shadow");
    } else {
      navBg.classList.remove("has-shadow");
    }
  }

  function closeMobileMenu() {
    if (!isMenuOpen) return;

    isMenuOpen = false;
    wrapper.classList.remove("is-menu-open");
    menuBtn.classList.remove("is-open");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("is-open");
    if (mobileMenuPanel) mobileMenuPanel.classList.remove("is-open");
    document.body.style.overflow = "";

    updateShadow();
  }

  function toggleMobileMenu() {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      isMenuOpen = true;
      wrapper.classList.add("is-menu-open");
      menuBtn.classList.add("is-open");
      if (mobileMenuOverlay) mobileMenuOverlay.classList.add("is-open");
      if (mobileMenuPanel) mobileMenuPanel.classList.add("is-open");
      document.body.style.overflow = "hidden";
      updateShadow();
    }
  }

  function handleScroll() {
    const currentScrollY = window.scrollY;

    if (isMenuOpen) return;

    if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
      wrapper.classList.add("is-hidden");
    } else if (currentScrollY < lastScrollY) {
      wrapper.classList.remove("is-hidden");
    }

    updateShadow();
    lastScrollY = currentScrollY;
  }

  function handleMenuClick() {
    if (window.innerWidth > 768) {
      wrapper.classList.remove("is-hidden");
      updateShadow();
    } else {
      toggleMobileMenu();
    }
  }

  function handleResize() {
    if (isMenuOpen && window.innerWidth > 768) {
      closeMobileMenu();
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  menuBtn.addEventListener("click", handleMenuClick);

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", closeMobileMenu);
  }

  window.addEventListener("resize", handleResize);

  if (mobileMenuPanel) {
    const menuLinks = mobileMenuPanel.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });
  }

  updateShadow();
}
