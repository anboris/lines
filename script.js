(function () {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("paginationDots");
  const cards = track.querySelectorAll(".card");
  const totalCards = cards.length;

  let currentIndex = 0;
  const cardsPerView = 3.5;
  const maxIndex = totalCards - Math.floor(cardsPerView);

  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll(".dot");

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentIndex),
    );
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateCarousel();
  }

  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

  let isDown = false,
    startX;
  track.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
  });
  track.addEventListener("mouseleave", () => {
    isDown = false;
  });
  track.addEventListener("mouseup", (e) => {
    if (!isDown) return;
    isDown = false;
    const diff = startX - e.pageX;
    if (Math.abs(diff) > 50) goToSlide(currentIndex + (diff > 0 ? 1 : -1));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToSlide(currentIndex - 1);
    if (e.key === "ArrowRight") goToSlide(currentIndex + 1);
  });

  window.addEventListener("resize", updateCarousel);
  updateCarousel();
})();

// ===== HEADER: Toggle transparent/frosted =====
(function () {
  const header = document.getElementById("siteHeader");
  let ticking = false;

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 50);
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

// ===== БЛОКИРОВКА ТОЛЬКО ТЕЛЕФОНОВ (Планшеты разрешены) =====
(function () {
  // Блокируем только телефоны, не планшеты
  const isPhone =
    /Android(?!.*Mobile)|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) ||
    (navigator.userAgent.includes("Android") &&
      navigator.userAgent.includes("Mobile"));

  // Проверяем ширину экрана (телефоны обычно меньше 768px)
  const isPhoneScreen = window.innerWidth < 768;

  if (isPhone || ("ontouchstart" in window && isPhoneScreen)) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      padding: 24px;
      text-align: center;
    `;

    overlay.innerHTML = `
      <div style="max-width:440px;">
        <div style="font-size:72px;margin-bottom:24px;line-height:1;">🚧</div>
        <h1 style="font-size:26px;font-weight:600;color:#1d1d1f;margin-bottom:12px;letter-spacing:-0.02em;">
          Мобильная версия в разработке
        </h1>
        <p style="font-size:17px;color:#6e6e73;line-height:1.6;margin-bottom:8px;">
          Это демо-версия сайта, которая ещё не опубликована.
        </p>
        <p style="font-size:15px;color:#a1a1a6;line-height:1.5;margin-bottom:24px;">
          Пожалуйста, откройте сайт на компьютере для просмотра.
        </p>
        <div style="padding:16px 24px;background:rgba(0,0,0,0.03);border-radius:16px;">
          <span style="font-size:13px;color:#6e6e73;">💡 Скоро мобильная версия будет доступна</span>
        </div>
      </div>
    `;

    document.body.prepend(overlay);
  }
})();
