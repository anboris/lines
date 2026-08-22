// ===== CAROUSEL with Vertical Scroll Support =====
(function () {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("paginationDots");
  const cards = track.querySelectorAll(".card");
  const totalCards = cards.length;

  let currentIndex = 0;
  let maxIndex = 0;
  let cardWidth = 0;
  let gap = 20;
  let isTransitioning = false;

  // Create dots (will be updated after dimensions are calculated)
  function createDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  let dots = [];

  function getDimensions() {
    if (cards.length === 0) return;
    cardWidth = cards[0].offsetWidth;
    const computedStyle = getComputedStyle(track);
    gap = parseFloat(computedStyle.gap) || 20;

    const trackWrapper = track.parentElement;
    const trackWrapperStyles = getComputedStyle(trackWrapper);
    const paddingLeft = parseFloat(trackWrapperStyles.paddingLeft) || 0;
    const paddingRight = parseFloat(trackWrapperStyles.paddingRight) || 0;
    const trackWidth = trackWrapper.clientWidth - paddingLeft - paddingRight;

    const fullCardsVisible = Math.floor(trackWidth / (cardWidth + gap));
    const remainingSpace = trackWidth - fullCardsVisible * (cardWidth + gap);
    const hasPartialCard = remainingSpace > cardWidth * 0.3;
    const visibleCards = fullCardsVisible + (hasPartialCard ? 1 : 0);

    maxIndex = Math.max(0, totalCards - visibleCards);

    if (dots.length !== maxIndex + 1) {
      createDots();
      dots = dotsContainer.querySelectorAll(".dot");
    }

    return maxIndex;
  }

  function getOffset(index) {
    return index * (cardWidth + gap);
  }

  function updateCarousel(animate = true) {
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    if (!animate) {
      track.style.transition = "none";
    } else {
      track.style.transition =
        "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
    }

    const offset = getOffset(currentIndex);
    track.style.transform = `translateX(-${offset}px)`;

    if (!animate) {
      void track.offsetHeight;
      track.style.transition =
        "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
    }

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    if (dots.length > 0) {
      dots.forEach((dot, i) =>
        dot.classList.toggle("active", i === currentIndex),
      );
    }
  }

  function goToSlide(index) {
    if (isTransitioning) return;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateCarousel(true);
  }

  // ===== TOUCH SUPPORT WITH VERTICAL SCROLL DETECTION =====
  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchStartIndex = 0;
  let isDragging = false;
  let isSwipingHorizontally = false; // Track if we're doing horizontal swipe
  let touchMoved = false;

  track.addEventListener(
    "touchstart",
    (e) => {
      if (isTransitioning) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchCurrentX = touch.clientX;
      touchStartIndex = currentIndex;
      isDragging = false;
      isSwipingHorizontally = false;
      touchMoved = false;
      track.style.transition = "none";
      track.style.cursor = "grabbing";
    },
    { passive: true },
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      // If we haven't determined the direction yet
      if (!isSwipingHorizontally && !touchMoved) {
        // Check if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
          // Horizontal swipe - prevent default (block vertical scroll)
          isSwipingHorizontally = true;
          isDragging = true;
          e.preventDefault();
        } else if (Math.abs(deltaY) > 10) {
          // Vertical scroll - don't prevent default, allow page to scroll
          isSwipingHorizontally = false;
          touchMoved = true;
          // Reset carousel position
          track.style.transition =
            "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
          updateCarousel(true);
          return;
        }
      }

      // If we're doing a horizontal swipe
      if (isSwipingHorizontally) {
        e.preventDefault();
        isDragging = true;
        touchCurrentX = touch.clientX;
        const deltaX = touchCurrentX - touchStartX;

        const baseOffset = getOffset(touchStartIndex);
        const newOffset = Math.max(0, baseOffset - deltaX);
        const maxOffset = getOffset(maxIndex);
        const clampedOffset = Math.min(newOffset, maxOffset);
        track.style.transform = `translateX(-${clampedOffset}px)`;
      }
    },
    { passive: false },
  );

  track.addEventListener(
    "touchend",
    () => {
      if (!isDragging || !isSwipingHorizontally) {
        // Reset if it was a vertical scroll
        track.style.transition =
          "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
        isDragging = false;
        isSwipingHorizontally = false;
        touchMoved = false;
        track.style.cursor = "grab";
        return;
      }

      isDragging = false;
      track.style.cursor = "grab";
      track.style.transition =
        "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";

      const threshold = 50;
      const deltaX = touchCurrentX - touchStartX;

      if (Math.abs(deltaX) > threshold) {
        const direction = deltaX > 0 ? -1 : 1;
        const newIndex = Math.max(
          0,
          Math.min(touchStartIndex + direction, maxIndex),
        );
        currentIndex = newIndex;
        updateCarousel(true);
      } else {
        updateCarousel(true);
      }

      isSwipingHorizontally = false;
      touchMoved = false;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchcancel",
    () => {
      isDragging = false;
      isSwipingHorizontally = false;
      touchMoved = false;
      track.style.cursor = "grab";
      track.style.transition =
        "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
      updateCarousel(true);
    },
    { passive: true },
  );

  // ===== MOUSE SUPPORT =====
  let isMouseDown = false;
  let mouseStartX = 0;
  let mouseStartY = 0;
  let mouseCurrentX = 0;
  let mouseStartIndex = 0;
  let isMouseSwiping = false;

  track.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isMouseDown = true;
    isMouseSwiping = false;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    mouseCurrentX = e.clientX;
    mouseStartIndex = currentIndex;
    track.style.transition = "none";
    track.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;
    const deltaX = e.clientX - mouseStartX;
    const deltaY = e.clientY - mouseStartY;

    if (
      !isMouseSwiping &&
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 10
    ) {
      isMouseSwiping = true;
    }

    if (!isMouseSwiping) return;

    mouseCurrentX = e.clientX;
    const baseOffset = getOffset(mouseStartIndex);
    const newOffset = Math.max(0, baseOffset - deltaX);
    const maxOffset = getOffset(maxIndex);
    const clampedOffset = Math.min(newOffset, maxOffset);
    track.style.transform = `translateX(-${clampedOffset}px)`;
  });

  document.addEventListener("mouseup", () => {
    if (!isMouseDown) return;
    isMouseDown = false;
    track.style.cursor = "grab";
    track.style.transition = "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";

    if (!isMouseSwiping) {
      updateCarousel(true);
      return;
    }

    const threshold = 50;
    const deltaX = mouseCurrentX - mouseStartX;

    if (Math.abs(deltaX) > threshold) {
      const direction = deltaX > 0 ? -1 : 1;
      const newIndex = Math.max(
        0,
        Math.min(mouseStartIndex + direction, maxIndex),
      );
      currentIndex = newIndex;
      updateCarousel(true);
    } else {
      updateCarousel(true);
    }

    isMouseSwiping = false;
  });

  // Prevent text selection during drag
  track.addEventListener("dragstart", (e) => e.preventDefault());

  // ===== BUTTON NAVIGATION =====
  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

  // ===== KEYBOARD =====
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToSlide(currentIndex - 1);
    if (e.key === "ArrowRight") goToSlide(currentIndex + 1);
  });

  // ===== RESIZE =====
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      getDimensions();
      updateCarousel(false);
    }, 100);
  });

  // ===== INIT =====
  setTimeout(() => {
    getDimensions();
    updateCarousel(false);
  }, 50);

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      getDimensions();
      updateCarousel(false);
    });
    ro.observe(track);
  }
})();

// ===== HEADER: Toggle transparent/frosted =====
(function () {
  const header = document.getElementById("siteHeader");
  let ticking = false;

  function updateHeader() {
    header.classList.toggle("site-header--scrolled", window.scrollY > 50);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true },
  );
})();

// ===== PRICING TABS =====
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".pricing-tab");
  const panes = {
    single: document.getElementById("pane-single"),
    individual: document.getElementById("pane-individual"),
    group: document.getElementById("pane-group"),
  };

  function activatePane(paneId) {
    // Deactivate all panes
    Object.values(panes).forEach((pane) => pane.classList.remove("active"));
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
});

// ===== SUB-TABS (Individual pane) =====
document.querySelectorAll(".sub-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const parent = tab.closest(".pricing-pane");
    const targetId = tab.dataset.subpane;

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

function updatePrice(selectElement, cardPrefix) {
  // Get selected option values
  const totalPrice =
    parseInt(selectElement.value).toLocaleString("ru-RU") + " ₽";
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const perClassValue = selectedOption.getAttribute("data-per-class");

  // Format per-class subtitle text
  const perClassText =
    perClassValue === "Без лимита"
      ? "Безлимитные посещения"
      : `${parseInt(perClassValue).toLocaleString("ru-RU")} ₽ / занятие`;

  // Apply real-time DOM updates
  document.getElementById(`${cardPrefix}-price`).innerText = totalPrice;
  document.getElementById(`${cardPrefix}-per-class`).innerText = perClassText;
}

// ===== PRICE UPDATER for dropdowns =====
function updatePrice(selectElement, cardPrefix) {
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

  document.getElementById(`${cardPrefix}-price`).innerText = totalPrice;
  document.getElementById(`${cardPrefix}-per-class`).innerText = perClassText;
}

// ===== MAIN TABS =====
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".pricing-tab");
  const panes = {
    group: document.getElementById("pane-group"),
    individual: document.getElementById("pane-individual"),
    single: document.getElementById("pane-single"),
  };

  function activatePane(paneId) {
    Object.values(panes).forEach((pane) => pane.classList.remove("active"));
    tabs.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    const target = document.getElementById(paneId);
    if (target) target.classList.add("active");

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

  // ===== SUB-TABS (Individual pane) =====
  document.querySelectorAll(".sub-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const parent = tab.closest(".pricing-pane");
      const targetId = tab.dataset.subpane;

      parent.querySelectorAll(".sub-tab").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      parent.querySelectorAll(".sub-pane").forEach((pane) => {
        pane.classList.remove("active");
      });

      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");
    });
  });
});

// ===== QUIZ DATA =====
const fitnessQuiz = {
  questions: {
    1: {
      text: "У Вас есть опыт тренировок?",
      type: "choice",
      options: [
        { text: "Да", next: 2 },
        { text: "Нет", next: 33 },
      ],
    },
    2: {
      text: "Был ли у Вас длительный перерыв (от месяца) в тренировках?",
      type: "choice",
      options: [
        { text: "Да", next: 3 },
        { text: "Нет", next: 6 },
      ],
    },
    3: {
      text: "Вас беспокоит боль в спине или суставах?",
      type: "choice",
      options: [
        { text: "Да", next: 4 },
        { text: "Нет", next: 5 },
      ],
    },
    33: {
      text: "Вас беспокоит боль в спине или суставах?",
      type: "choice",
      options: [
        { text: "Да", next: 11 },
        { text: "Нет", next: 111 },
      ],
    },
    4: {
      text: "Комплексная тренировка базовый уровень. Здоровая спина и осанка. МФР",
      type: "outcome",
    },
    5: {
      text: "Комплексная тренировка базовый уровень. Комплексная тренировка средний уровень.",
      type: "outcome",
    },
    6: {
      text: "Вам интересны оздоровительные тренировки?",
      type: "choice",
      options: [
        { text: "Да", next: 7 },
        { text: "Нет", next: 8 },
      ],
    },
    7: {
      text: "Комплексная тренировка базовый уровень. Комплексная тренировка средний уровень. Здоровая спина и осанка. МФР.",
      type: "outcome",
    },
    8: {
      text: "Вам интересны тренировки повышенного уровня сложности?",
      type: "choice",
      options: [
        { text: "Да", next: 9 },
        { text: "Нет", next: 10 },
      ],
    },
    9: {
      text: "Комплексная тренировка продолжающие. Растяжка у станка. Гимнастические элементы.",
      type: "outcome",
    },
    10: {
      text: "Комплексная тренировка средний уровень. Комплексная тренировка продолжающие. Растяжка у станка.",
      type: "outcome",
    },
    11: {
      text: "Вам хотелось бы научиться садиться на шпагат?",
      type: "choice",
      options: [
        { text: "Да", next: 12 },
        { text: "Нет", next: 13 },
      ],
    },
    111: {
      text: "Вам хотелось бы научиться садиться на шпагат?",
      type: "choice",
      options: [
        { text: "Да", next: 16 },
        { text: "Нет", next: 17 },
      ],
    },
    12: { text: "Комплексная тренировка базовый уровень.", type: "outcome" },
    13: {
      text: "Вам хотелось бы поработать над осанкой?",
      type: "choice",
      options: [
        { text: "Да", next: 14 },
        { text: "Нет", next: 15 },
      ],
    },
    14: { text: "Здоровая спина и осанка. МФР.", type: "outcome" },
    15: { text: "МФР.", type: "outcome" },
    16: {
      text: "Комплексная тренировка базовый уровень. Комплексная тренировка средний уровень.",
      type: "outcome",
    },
    17: {
      text: "Здоровая спина и осанка. Тренировка стоп. МФР",
      type: "outcome",
    },
  },
};

// ===== POPOVER MAPPING =====
// Maps recommendation text → popover ID
const recommendationPopovers = {
  "Комплексная тренировка базовый уровень": "popover-0",
  "Комплексная тренировка средний уровень": "popover-1",
  "Комплексная тренировка продолжающие": "popover-2",
  "Здоровая спина и осанка": "popover-3",
  МФР: "popover-4",
  "Растяжка у станка": "popover-5",
  "Тренировка стоп": "popover-6",
  "Гимнастические элементы": "popover-7",
  "Вертикальные шпагаты": "popover-8",
};

// ===== RENDER ENGINE =====
const MAX_DEPTH = 4;

function renderQuestion(quiz, id, depth = 1) {
  const container = document.getElementById("quiz-container");
  const stepEl = document.getElementById("quiz-step");
  const progressFill = document.getElementById("progress-fill");

  if (!container) return;

  const currentData = quiz.questions[id];
  container.innerHTML = "";

  // ===== PROGRESS UPDATE =====
  if (currentData.type === "outcome") {
    if (progressFill) progressFill.style.width = "100%";
    if (stepEl) stepEl.textContent = "Готово";
  } else {
    const progress = Math.min((depth / (MAX_DEPTH + 1)) * 100, 90);
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (stepEl) stepEl.textContent = `Шаг ${depth} из ${MAX_DEPTH}`;
  }

  // ===== OUTCOME (recommendation) =====
  if (currentData.type === "outcome") {
    const recommendations = currentData.text
      .split(". ")
      .filter((s) => s.trim());

    const outcomeBox = document.createElement("div");
    outcomeBox.className = "outcome-box";

    let html = `
      <div class="outcome-header">
        <span class="outcome-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-check-icon lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg></span>
        <strong>Вам подойдут:</strong>
      </div>
      <div class="outcome-tags">
    `;

    recommendations.forEach((rec) => {
      const trimmed = rec.trim();
      if (!trimmed) return;

      // Find matching popover ID
      let popoverId = null;
      for (const [key, value] of Object.entries(recommendationPopovers)) {
        if (trimmed.includes(key) || key.includes(trimmed)) {
          popoverId = value;
          break;
        }
      }

      // If no exact match, try partial match
      if (!popoverId) {
        for (const [key, value] of Object.entries(recommendationPopovers)) {
          if (
            trimmed.toLowerCase().includes(key.toLowerCase()) ||
            key.toLowerCase().includes(trimmed.toLowerCase())
          ) {
            popoverId = value;
            break;
          }
        }
      }

      html += `<span class="outcome-tag">${trimmed}`;

      if (popoverId) {
        html += `
          <button 
            class="tag-info-btn" 
            popovertarget="${popoverId}" 
            popovertargetaction="toggle"
            aria-label="Подробнее о ${trimmed}"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
        `;
      }

      html += `</span>`;
    });

    html += `
      </div>
      <div class="outcome-actions">
        <a href="#contacts" class="outcome-cta">Записаться сегодня</a>
        <button class="quiz-restart" onclick="restartQuiz()">↻ Пройти заново</button>
      </div>
    `;

    outcomeBox.innerHTML = html;
    container.appendChild(outcomeBox);
    return;
  }

  // ===== CHOICE (question with buttons) =====
  const title = document.createElement("h3");
  title.className = "quiz-question";
  title.innerText = currentData.text;
  container.appendChild(title);

  const btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";

  currentData.options.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option.text;
    button.className = "quiz-btn";
    button.onclick = () => {
      renderQuestion(quiz, option.next, depth + 1);
    };
    btnContainer.appendChild(button);
  });

  container.appendChild(btnContainer);
}

// ===== RESTART =====
function restartQuiz() {
  renderQuestion(fitnessQuiz, 1, 1);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", function () {
  renderQuestion(fitnessQuiz, 1, 1);
});

// ============================================================
// CONTACT FORM VALIDATION
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const successDiv = document.getElementById("formSuccess");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    form
      .querySelectorAll(".form-group")
      .forEach((g) => g.classList.remove("error"));

    // Validate name
    const name = document.getElementById("form-name");
    if (!name.value.trim()) {
      name.closest(".form-group").classList.add("error");
      isValid = false;
    }

    // Validate phone (simple check)
    const phone = document.getElementById("form-phone");
    const phoneClean = phone.value.replace(/\D/g, "");
    if (phoneClean.length < 10) {
      phone.closest(".form-group").classList.add("error");
      isValid = false;
    }

    // Validate consent
    const consent = document.getElementById("form-consent");
    if (!consent.checked) {
      consent.closest(".form-group").classList.add("error");
      isValid = false;
    }

    if (isValid) {
      // Simulate submission
      const submitBtn = form.querySelector(".form-submit");
      submitBtn.textContent = "Отправка...";
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = "none";
        successDiv.style.display = "block";
        successDiv.classList.add("show");
        submitBtn.textContent = "Отправить заявку";
        submitBtn.disabled = false;
      }, 1500);
    }
  });

  // Real-time validation clearing
  form.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", function () {
      this.closest(".form-group")?.classList.remove("error");
    });
  });

  // Phone mask (basic)
  const phoneInput = document.getElementById("form-phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);
      let formatted = "";
      if (value.length > 0) {
        formatted = "+7 ";
        if (value.length > 1) {
          formatted += "(" + value.slice(1, 4);
        }
        if (value.length > 4) {
          formatted += ") " + value.slice(4, 7);
        }
        if (value.length > 7) {
          formatted += "-" + value.slice(7, 9);
        }
        if (value.length > 9) {
          formatted += "-" + value.slice(9, 11);
        }
      }
      this.value = formatted;
    });
  }
});

// Add this to your script.js (after the existing code)

// ===== MOBILE MENU: Close when link is clicked =====
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-menu__link");

  mobileLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only close if the menu is open
      if (mobileMenu.matches(":popover-open")) {
        // Use the Popover API to hide the menu
        mobileMenu.hidePopover();
      }
    });
  });
});
