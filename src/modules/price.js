// modules/pricing.js

/**
 * Pricing module - handles tab switching, sub-tabs, and price updates
 */
export function initPricing() {
  // ===== PRICING TABS =====
  const tabs = document.querySelectorAll(".pricing-tab");
  const panes = {
    single: document.getElementById("pane-single"),
    individual: document.getElementById("pane-individual"),
    group: document.getElementById("pane-group"),
  };

  function activatePane(paneId) {
    // Deactivate all panes
    Object.values(panes).forEach((pane) => {
      if (pane) pane.classList.remove("active");
    });

    // Deactivate all tabs
    tabs.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    // Activate target pane
    const target = document.getElementById(paneId);
    if (target) target.classList.add("active");

    // Activate matching tab
    const matchingTab = document.querySelector(
      `.pricing-tab[data-pane="${paneId}"]`,
    );
    if (matchingTab) {
      matchingTab.classList.add("active");
      matchingTab.setAttribute("aria-selected", "true");
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const paneId = tab.dataset.pane;
      if (paneId) activatePane(paneId);
    });
  });

  // (Optional) set default from URL hash
  const hash = window.location.hash.replace("#", "");
  if (hash && panes[hash]) activatePane(hash);

  // ===== SUB-TABS (Individual pane) =====
  document.querySelectorAll(".sub-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const parent = tab.closest(".pricing-pane");
      const targetId = tab.dataset.subpane;

      if (!parent) return;

      // Deactivate all sub-tabs in this pane
      parent.querySelectorAll(".sub-tab").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });

      // Activate clicked sub-tab
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Deactivate all sub-panes in this pane
      parent.querySelectorAll(".sub-pane").forEach((pane) => {
        pane.classList.remove("active");
      });

      // Activate target sub-pane
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // ===== PRICE UPDATER for dropdowns =====
  // Update price function (exposed globally for inline onclick)
  window.updatePrice = function (selectElement, cardPrefix) {
    const totalPrice =
      parseInt(selectElement.value).toLocaleString("ru-RU") + " ₽";
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const perClassValue = selectedOption.getAttribute("data-per-class");

    let perClassText = "";

    // Custom label handling for split (price per person)
    if (cardPrefix === "split") {
      perClassText = `${parseInt(perClassValue).toLocaleString("ru-RU")} ₽ за человека`;
    } else if (perClassValue === "Без лимита") {
      perClassText = "Безлимитные посещения";
    } else {
      perClassText = `${parseInt(perClassValue).toLocaleString("ru-RU")} ₽ / занятие`;
    }

    const priceEl = document.getElementById(`${cardPrefix}-price`);
    const perClassEl = document.getElementById(`${cardPrefix}-per-class`);

    if (priceEl) priceEl.innerText = totalPrice;
    if (perClassEl) perClassEl.innerText = perClassText;
  };

  // Auto-update dropdowns on page load
  document.querySelectorAll("select[data-update-price]").forEach((select) => {
    const cardPrefix = select.getAttribute("data-update-price");
    if (cardPrefix && window.updatePrice) {
      // Initial update
      window.updatePrice(select, cardPrefix);

      // Add change listener
      select.addEventListener("change", function () {
        window.updatePrice(this, cardPrefix);
      });
    }
  });
}
