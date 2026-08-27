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

  // Safety check - prevents errors if question ID doesn't exist
  if (!currentData) {
    console.error(`Question with ID ${id} not found!`);
    container.innerHTML = `
      <div style="padding: 30px; text-align: center;">
        <p style="color: #e74c3c; margin-bottom: 15px;">Извините, произошла ошибка.</p>
        <button onclick="restartQuiz()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Перезапустить тест</button>
      </div>
    `;
    return;
  }

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
    outcomeBox.className = "quiz__outcome";

    let html = `
      <div class="quiz__outcome-header">
        <span class="quiz__outcome-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-check-icon lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg></span>
        <strong>Вам подойдут:</strong>
      </div>
      <div class="quiz__outcome-tags">
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

      html += `<span class="quiz__outcome-tag">${trimmed}`;

      if (popoverId) {
        html += `
          <button 
            class="quiz__tag-info-btn" 
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
      <div class="quiz__outcome-actions">
        <a href="#contacts" class="quiz__outcome-cta">Записаться сегодня</a>
        <button class="quiz__restart" onclick="restartQuiz()">↻ Пройти заново</button>
      </div>
    `;

    outcomeBox.innerHTML = html;
    container.appendChild(outcomeBox);
    return;
  }

  // ===== CHOICE (question with buttons) =====
  const title = document.createElement("h3");
  title.className = "quiz__question";
  title.innerText = currentData.text;
  container.appendChild(title);

  const btnContainer = document.createElement("div");
  btnContainer.className = "quiz__buttons";

  currentData.options.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option.text;
    button.className = "quiz__btn";

    // Store the next ID on the button for later use
    button.dataset.next = option.next;

    // Handle click - but prevent the stuck state
    button.addEventListener("click", function (e) {
      // Remove selected class from all buttons in this container
      const allBtns = btnContainer.querySelectorAll(".quiz__btn");
      allBtns.forEach((btn) => btn.classList.remove("selected"));

      // Add selected class to clicked button
      this.classList.add("selected");

      // Small delay to show the selected state before navigating
      setTimeout(() => {
        renderQuestion(quiz, parseInt(this.dataset.next), depth + 1);
      }, 200);
    });

    btnContainer.appendChild(button);
  });

  container.appendChild(btnContainer);
}

// ===== RESTART =====
function restartQuiz() {
  renderQuestion(fitnessQuiz, 1, 1);
}

// Make restartQuiz globally accessible for the button onclick
window.restartQuiz = restartQuiz;

// ===== EXPORT INIT FUNCTION =====
export function initQuiz() {
  renderQuestion(fitnessQuiz, 1, 1);
}
