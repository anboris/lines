export function initEmbeddedForm() {
  const formWrap = document.getElementById(
    "formwrap9091c97600126aeaf5f497e14b01f4ae",
  );
  if (!formWrap) {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      const retryFormWrap = document.getElementById(
        "formwrap9091c97600126aeaf5f497e14b01f4ae",
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
  if (commentTextarea) {
    commentTextarea.placeholder =
      "Расскажите о ваших целях, пожеланиях или вопросах...";
  }

  // ===== 5. Add direction select =====
  const fieldsContainer = formWrap.querySelector(
    "#form9091c97600126aeaf5f497e14b01f4ae > div:nth-child(2)",
  );
  if (!fieldsContainer) {
    console.warn("Fields container not found.");
    return;
  }

  const selectDiv = document.createElement("div");
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

  const emailField = fieldsContainer.children[2];
  if (emailField) {
    emailField.insertAdjacentElement("afterend", selectDiv);
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
        observer.disconnect();
      }
    });
    observer.observe(formContainer, { childList: true, subtree: true });
  }

  // ===== 8. Add Privacy Policy Checkbox & Robust Validation =====
  const submitBtn = document.getElementById(
    "btn9091c97600126aeaf5f497e14b01f4ae",
  );
  if (submitBtn) {
    // Функция для внедрения чекбокса (вынесена, чтобы можно было восстановить при перерисовке CRM)
    const injectCheckbox = () => {
      if (document.getElementById("privacyPolicyCheckbox")) return; // Уже существует

      const checkboxDiv = document.createElement("div");
      checkboxDiv.className = "checkbox-group";
      checkboxDiv.style.marginBottom = "15px";
      checkboxDiv.style.textAlign = "left"; // Выравнивание текста чекбокса

      // ВАЖНО: замените /privacy-policy на реальный URL вашей политики
      checkboxDiv.innerHTML = `
        <label class="checkbox-label" style="justify-content: flex-start;">
          <input type="checkbox" id="privacyPolicyCheckbox">
          <span class="checkmark"></span>
          <span class="checkbox-text">
            Я соглашаюсь с <a href="/privacy" target="_blank" rel="noopener">политикой
              конфиденциальности</a>
          </span>
        </label>
        <div id="privacyError" class="form-error"
          style="display: none; margin-top: 4px; font-size: 13px; color: #e74c3c;">
          Необходимо согласие с политикой конфиденциальности
        </div>
      `;

      submitBtn.parentElement.insertBefore(checkboxDiv, submitBtn);

      // Скрываем ошибку при клике на чекбокс
      const cb = document.getElementById("privacyPolicyCheckbox");
      if (cb) {
        cb.addEventListener("change", function () {
          const err = document.getElementById("privacyError");
          if (this.checked && err) err.style.display = "none";
        });
      }
    };

    // Внедряем сразу
    injectCheckbox();

    // Перехватываем клик в фазе capture (true), чтобы сработать ДО скрипта CRM
    submitBtn.addEventListener(
      "click",
      function (e) {
        const checkbox = document.getElementById("privacyPolicyCheckbox");
        const errorDiv = document.getElementById("privacyError");

        if (!checkbox || !checkbox.checked) {
          e.preventDefault();
          e.stopPropagation(); // Блокируем передачу клика в CRM, форма НЕ отправится
          if (errorDiv) errorDiv.style.display = "block";
          return false;
        }

        // Если галочка стоит, мы НЕ вызываем preventDefault/stopPropagation.
        // Событие клика спокойно дойдет до CRM-скрипта, и форма отправится как обычно.
        if (errorDiv) errorDiv.style.display = "none";
      },
      true,
    );

    // ===== 9. Safety Net: Восстановление чекбокса =====
    // Если CRM перерисует кнопку (например, при своей внутренней ошибке валидации),
    // наш чекбокс может исчезнуть. Этот наблюдатель вернет его на место.
    const buttonContainer = submitBtn.parentElement;
    if (buttonContainer) {
      const mutationObserver = new MutationObserver(() => {
        if (
          !document.getElementById("privacyPolicyCheckbox") &&
          document.getElementById("btn9091c97600126aeaf5f497e14b01f4ae")
        ) {
          injectCheckbox();
        }
      });
      mutationObserver.observe(buttonContainer, {
        childList: true,
        subtree: true,
      });
    }
  }
}
