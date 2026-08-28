export function initEmbeddedForm() {
  const formWrap = document.getElementById(
    "form9091c97600126aeaf5f497e14b01f4ae",
  );
  if (!formWrap) {
    let attempts = 0;
    const maxAttempts = 5;
    const interval = setInterval(() => {
      const retryFormWrap = document.getElementById(
        "form9091c97600126aeaf5f497e14b01f4ae",
      );
      if (retryFormWrap) {
        clearInterval(interval);
        setupEmbeddedForm(retryFormWrap);
      } else if (++attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn("Embedded form not found after retries.");
      }
    }, 500);
    return;
  }
  setupEmbeddedForm(formWrap);
}

function setupEmbeddedForm(formWrap) {
  // ===== 1. Hide the default title =====
  const titleDiv = formWrap.querySelector(
    "#form9091c97600126aeaf5f497e14b01f4ae > div:first-child",
  );
  if (titleDiv && titleDiv.textContent.includes("Форма")) {
    titleDiv.style.display = "none";
  }

  // ===== 2. Change labels =====
  const labels = formWrap.querySelectorAll("label");
  labels.forEach((label) => {
    const text = label.textContent.trim();
    if (text.includes("Фамилия и Имя")) label.textContent = "Ваше имя";
    else if (text.includes("Телефон")) label.textContent = "Телефон";
    else if (text.includes("Email")) label.textContent = "Email";
    else if (text.includes("Комментарий")) label.textContent = "Комментарий";
  });

  // ===== 3. Shorten error messages =====
  const nameError = document.getElementById(
    "nameError9091c97600126aeaf5f497e14b01f4ae",
  );
  if (nameError) nameError.textContent = "Введите ваше имя";

  const phoneError = document.getElementById(
    "phoneError9091c97600126aeaf5f497e14b01f4ae",
  );
  if (phoneError) phoneError.textContent = "Введите корректный номер";

  const emailError = document.getElementById(
    "emailError9091c97600126aeaf5f497e14b01f4ae",
  );
  if (emailError) emailError.textContent = "Введите корректный Email";

  // ===== 4. Set placeholders =====
  const nameInput = document.getElementById(
    "name9091c97600126aeaf5f497e14b01f4ae",
  );
  if (nameInput) nameInput.placeholder = "Например, Анна";

  const phoneInput = document.getElementById(
    "phone9091c97600126aeaf5f497e14b01f4ae",
  );
  if (phoneInput) phoneInput.placeholder = "(___) ___-__-__";

  const emailInput = document.getElementById(
    "email9091c97600126aeaf5f497e14b01f4ae",
  );
  if (emailInput) emailInput.placeholder = "anna@example.com";

  const commentTextarea = document.getElementById(
    "note9091c97600126aeaf5f497e14b01f4ae",
  );
  if (commentTextarea)
    commentTextarea.placeholder =
      "Расскажите о ваших целях, пожеланиях или вопросах...";

  // ===== 5. Add direction select =====
  const fieldsContainer = formWrap.querySelector(
    "#form9091c97600126aeaf5f497e14b01f4ae > div:nth-child(2)",
  );
  if (!fieldsContainer) {
    console.warn("Fields container not found.");
    return;
  }

  const selectDiv = document.createElement("div");
  // No inline grid-column or margin-top – CSS handles layout.

  const selectLabel = document.createElement("label");
  selectLabel.style.fontSize = "14px";
  selectLabel.style.fontWeight = "500";
  selectLabel.style.color = "#1d1d1f";
  selectLabel.textContent = "Интересующее направление";
  selectDiv.appendChild(selectLabel);

  const select = document.createElement("select");
  select.id = "directionSelectCustom";
  select.style.width = "100%";
  select.style.padding = "12px 16px";
  select.style.borderRadius = "12px";
  select.style.border = "1.5px solid rgba(0,0,0,0.08)";
  select.style.fontSize = "16px";
  select.style.fontFamily = "inherit";
  select.style.background = "#fff";
  select.style.marginTop = "5px";
  select.innerHTML = `
    <option value="">Выберите направление</option>
    <option value="stretch">Растяжка</option>
    <option value="strength">Силовая тренировка</option>
    <option value="yoga">Йога</option>
    <option value="pilates">Пилатес</option>
    <option value="acrobatics">Акробатика</option>
    <option value="mfr">МФР</option>
    <option value="other">Не знаю</option>
  `;
  selectDiv.appendChild(select);

  const emailField = fieldsContainer.children[2]; // third child = email
  if (emailField) {
    emailField.insertAdjacentElement("afterend", selectDiv);
  } else {
    console.warn("Email field not found; could not insert direction select.");
  }

  // ===== 6. Append direction to comment on change =====
  if (commentTextarea) {
    select.addEventListener("change", () => {
      if (select.value) {
        const directionText = select.options[select.selectedIndex].text;
        if (!commentTextarea.value.includes(directionText)) {
          commentTextarea.value = commentTextarea.value.trim()
            ? `${commentTextarea.value.trim()}\n${directionText}`
            : directionText;
        }
      }
    });
  }

  // ===== 7. Observe for success message =====
  const formContainer = document.getElementById(
    "form9091c97600126aeaf5f497e14b01f4ae",
  );
  if (formContainer) {
    const observer = new MutationObserver(() => {
      const successDiv = formContainer.querySelector(
        'div[style*="text-align:center"]',
      );
      if (
        successDiv &&
        successDiv.textContent.includes("Мы свяжемся с вами в ближайшее время.")
      ) {
        formWrap.classList.add("form-success-shown");
        observer.disconnect(); // Stop observing once success is detected
      }
    });
    observer.observe(formContainer, { childList: true, subtree: true });
  }
}
