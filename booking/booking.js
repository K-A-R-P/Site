// === MOCK availability (пока без API) ===
// Важно: тут даты должны быть "в будущем", иначе они будут disabled.
const MOCK_AVAILABILITY = {
  "2025-12-15": ["09:00", "11:00"],
  "2025-12-16": ["09:00", "11:00", "13:00"],
  "2025-12-18": ["11:00"]
};

const state = {
  currentMonth: null,
  selectedDate: null,
  selectedTime: null
};

// ---------- helpers ----------
function pad2(n) { return String(n).padStart(2, "0"); }

// Локальный ISO (без toISOString() — там UTC и может сдвигать дату)
function toLocalISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function setStep(stepClass) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.querySelector(stepClass).classList.add("active");
}

function updateMeta() {
  const metaText = (state.selectedDate && state.selectedTime)
    ? `Обрано: ${state.selectedDate} • ${state.selectedTime}`
    : (state.selectedDate ? `Обрано: ${state.selectedDate}` : "");

  document.querySelectorAll(".selected-meta").forEach(el => {
    el.textContent = metaText;
  });
}

// ---------- calendar ----------
function renderCalendar() {
  const grid = document.querySelector(".calendar-grid");
  const label = document.querySelector(".month-label");
  if (!grid || !label) return;

  grid.innerHTML = "";

  const today = startOfDay(new Date());

  const year = state.currentMonth.getFullYear();
  const month = state.currentMonth.getMonth();

  label.textContent = state.currentMonth.toLocaleString("uk-UA", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7; // monday=0

  for (let i = 0; i < startDay; i++) {
    const spacer = document.createElement("div");
    spacer.className = "day-spacer";
    grid.appendChild(spacer);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const iso = toLocalISODate(date);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "day";
    btn.textContent = String(day);

    const hasSlots = (MOCK_AVAILABILITY[iso] || []).length > 0;

    // Нельзя сегодня и прошлое + нельзя если нет слотов
    if (startOfDay(date) <= today) {
      btn.classList.add("disabled");
      btn.disabled = true;
    } else if (!hasSlots) {
      btn.classList.add("blocked");
      btn.disabled = true;
    } else {
      btn.classList.add("available");
      btn.addEventListener("click", () => selectDate(iso));
    }

    if (state.selectedDate === iso) {
      btn.classList.add("selected");
    }

    grid.appendChild(btn);
  }
}

function changeMonth(delta) {
  const y = state.currentMonth.getFullYear();
  const m = state.currentMonth.getMonth();
  state.currentMonth = new Date(y, m + delta, 1);
  renderCalendar();
}

function selectDate(iso) {
  state.selectedDate = iso;
  state.selectedTime = null;
  updateMeta();
  setStep(".step-time");
  renderTimes();
}

// ---------- times ----------
function renderTimes() {
  const list = document.querySelector(".time-list");
  if (!list) return;

  list.innerHTML = "";

  const times = MOCK_AVAILABILITY[state.selectedDate] || [];

  if (!times.length) {
    list.innerHTML = "<div class='step-sub'>На цю дату немає вільного часу</div>";
    return;
  }

  times.forEach(time => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "time-slot";
    btn.textContent = time;

    btn.addEventListener("click", () => {
      state.selectedTime = time;
      updateMeta();
      setStep(".step-form");
    });

    list.appendChild(btn);
  });
}
// ===== PHONE MASK (+380 XX XXX XX XX) =====
function initPhoneMask(input) {
  input.addEventListener("input", () => {
    let digits = input.value.replace(/\D/g, "");

    if (digits.startsWith("380")) {
      digits = digits.slice(3);
    }
    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    digits = digits.slice(0, 9);

    let formatted = "+380";
    if (digits.length > 0) formatted += " " + digits.slice(0, 2);
    if (digits.length > 2) formatted += " " + digits.slice(2, 5);
    if (digits.length > 5) formatted += " " + digits.slice(5, 7);
    if (digits.length > 7) formatted += " " + digits.slice(7, 9);

    input.value = formatted.trim();
  });

  input.addEventListener("focus", () => {
    if (!input.value) input.value = "+380 ";
  });
}

// ===== VALIDATION =====
function validateName(input) {
  return /^[A-Za-zА-Яа-яІіЇїЄєҐґ'ʼ\- ]{2,}$/.test(input.value.trim());
}

function validateEmail(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
}

function validatePhone(input) {
  return input.value.replace(/\D/g, "").length === 12;
}

function setValidity(input, isValid) {
  input.classList.toggle("valid", isValid);
  input.classList.toggle("invalid", !isValid);
}

// ---------- init ----------
document.addEventListener("DOMContentLoaded", () => {
  // фиксируем месяц на "сейчас"
  const now = new Date();
  state.currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // навигация месяца
  document.querySelector(".nav-btn.prev")?.addEventListener("click", () => changeMonth(-1));
  document.querySelector(".nav-btn.next")?.addEventListener("click", () => changeMonth(1));

  // back
  document.querySelector(".back-to-date")?.addEventListener("click", () => {
    setStep(".step-date");
    state.selectedTime = null;
    updateMeta();
    renderCalendar();
  });

  document.querySelector(".back-to-time")?.addEventListener("click", () => {
    setStep(".step-time");
    updateMeta();
  });

 // ===== SUBMIT WITH VALIDATION =====
const form = document.getElementById("bookingForm");
const status = document.querySelector(".form-status");

const nameInput = document.querySelector('input[name="name"]');
const emailInput = document.querySelector('input[name="email"]');
const phoneInput = document.getElementById("phoneInput");

// инициализация маски
initPhoneMask(phoneInput);

// live validation
nameInput.addEventListener("input", () => {
  setValidity(nameInput, validateName(nameInput));
});

emailInput.addEventListener("input", () => {
  setValidity(emailInput, validateEmail(emailInput));
});

phoneInput.addEventListener("input", () => {
  setValidity(phoneInput, validatePhone(phoneInput));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // проверка выбора даты и времени
  if (!state.selectedDate || !state.selectedTime) {
    if (status) status.textContent = "Оберіть дату та час.";
    return;
  }

  // валидация полей
  const isNameValid  = validateName(nameInput);
  const isEmailValid = validateEmail(emailInput);
  const isPhoneValid = validatePhone(phoneInput);

  setValidity(nameInput, isNameValid);
  setValidity(emailInput, isEmailValid);
  setValidity(phoneInput, isPhoneValid);

  if (!isNameValid || !isEmailValid || !isPhoneValid) {
    if (status) status.textContent = "Будь ласка, заповніть форму коректно";
    return;
  }

  // данные (пока mock)
  const data = {
    date: state.selectedDate,
    time: state.selectedTime,
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim()
  };

  console.log("BOOKING DATA:", data);

  if (status) status.textContent = "Заявку прийнято ✔";
  form.reset();

  // сброс визуальной валидации
  [nameInput, emailInput, phoneInput].forEach(i => {
    i.classList.remove("valid", "invalid");
  });
});


  updateMeta();
  renderCalendar();
});


const nameInput = document.querySelector('input[name="name"]');
const emailInput = document.querySelector('input[name="email"]');
const phoneInput = document.getElementById("phoneInput");

initPhoneMask(phoneInput);

nameInput.addEventListener("input", () => {
  setValidity(nameInput, validateName(nameInput));
});

emailInput.addEventListener("input", () => {
  setValidity(emailInput, validateEmail(emailInput));
});

phoneInput.addEventListener("input", () => {
  setValidity(phoneInput, validatePhone(phoneInput));
});
