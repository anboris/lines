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
  // 1. Change labels
  const labels = formWrap.querySelectorAll("label");
  labels.forEach((label) => {
    const text = label.textContent.trim();
    if (text.includes("Фамилия и Имя")) {
      label.textContent = "Ваше имя";
    } else if (text.includes("Телефон")) {
      label.textContent = "Телефон";
    } else if (text.includes("Email")) {
      label.textContent = "Email";
    } else if (text.includes("Комментарий")) {
      label.textContent = "Комментарий";
    }
  });

  const phoneError = document.getElementById(
    "phoneError9091c97600126aeaf5f497e14b01f4ae",
  );
  if (phoneError) {
    phoneError.textContent = "Введите корректный номер";
  }

  // 2. Add direction select – note the corrected selector for the fields container
  const fieldsContainer = formWrap.querySelector(
    "#form9091c97600126aeaf5f497e14b01f4ae > div:nth-child(2)",
  );
  if (!fieldsContainer) {
    console.warn("Fields container not found.");
    return;
  }

  const selectDiv = document.createElement("div");

  const label = document.createElement("label");
  label.style.fontSize = "14px";
  label.style.fontWeight = "500";
  label.style.color = "#1d1d1f";
  label.textContent = "Интересующее направление";
  selectDiv.appendChild(label);

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
  }

  // 3. Append direction to comment
  const commentTextarea = document.getElementById(
    "note9091c97600126aeaf5f497e14b01f4ae",
  );
  if (commentTextarea) {
    select.addEventListener("change", function () {
      if (select.value) {
        const directionText = select.options[select.selectedIndex].text;
        if (!commentTextarea.value.includes(directionText)) {
          commentTextarea.value = commentTextarea.value.trim()
            ? commentTextarea.value.trim() + "\n" + directionText
            : directionText;
        }
      }
    });
  }
}
