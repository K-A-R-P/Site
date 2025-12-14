'use strict';

/* =====================================================
   BOOKING APP — STABLE VERSION
   Работает с lazy-loaded booking.html
===================================================== */

/* ---------- защита от повторной загрузки ---------- */
if (!window.__BOOKING_APP_LOADED__) {
  window.__BOOKING_APP_LOADED__ = true;
}

/* ---------- MOCK availability (пока без backend) ---------- */
const MOCK_AVAILABILITY = {
  "2025-12-15": ["09:00", "11:00"],
  "2025-12-16": ["09:00", "11:00", "13:00"],
  "2025-12-18": ["11:00"]
};

/* ---------- состояние ---------- */
const bookingState = {
  currentMonth: null,
  selectedDate: null,
  selectedTime: null
};

/* =====================================================
   HELPERS
===================================================== */
function pad2(n) {
  return String(n).padStart(2, '0');
}

function toLocalISO(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function setStep(cls) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const el = document.querySelector(cls);
  if (el) el.classList.add('active');
}

function updateMeta() {
  const text =
    bookingState.selectedDate && bookingState.selectedTime
      ? `Обрано: ${bookingState.selectedDate} • ${bookingState.selectedTime}`
      : bookingState.selectedDate
      ? `Обрано: ${bookingState.selectedDate}`
      : '';

  document.querySelectorAll('.selected-meta').forEach(el => {
    el.textContent = text;
  });
}

/* =====================================================
   CALENDAR
===================================================== */
function renderCalendar() {
  const grid = document.querySelector('.calendar-grid');
  const label = document.querySelector('.month-label');
  if (!grid || !label) return;

  grid.innerHTML = '';

  const today = startOfDay(new Date());
  const y = bookingState.currentMonth.getFullYear();
  const m = bookingState.currentMonth.getMonth();

  label.textContent = bookingState.currentMonth.toLocaleString('uk-UA', {
    month: 'long',
    year: 'numeric'
  });

  const firstDay = new Date(y, m, 1);
  const offset = (firstDay.getDay() + 6) % 7;

  for (let i = 0; i < offset; i++) {
    const spacer = document.createElement('div');
    spacer.className = 'day-spacer';
    grid.appendChild(spacer);
  }

  const daysInMonth = new Date(y, m + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const iso = toLocalISO(date);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'day';
    btn.textContent = d;

    const hasSlots = (MOCK_AVAILABILITY[iso] || []).length > 0;

    if (startOfDay(date) <= today) {
      btn.classList.add('disabled');
      btn.disabled = true;
    } else if (!hasSlots) {
      btn.classList.add('blocked');
      btn.disabled = true;
    } else {
      btn.classList.add('available');
      btn.addEventListener('click', () => selectDate(iso));
    }

    if (bookingState.selectedDate === iso) {
      btn.classList.add('selected');
    }

    grid.appendChild(btn);
  }
}

function changeMonth(delta) {
  const d = bookingState.currentMonth;
  bookingState.currentMonth = new Date(d.getFullYear(), d.getMonth() + delta, 1);
  renderCalendar();
}

function selectDate(iso) {
  bookingState.selectedDate = iso;
  bookingState.selectedTime = null;
  updateMeta();
  setStep('.step-time');
  renderTimes();
}

/* =====================================================
   TIME SLOTS
===================================================== */
function renderTimes() {
  const list = document.querySelector('.time-list');
  if (!list) return;

  list.innerHTML = '';
  const times = MOCK_AVAILABILITY[bookingState.selectedDate] || [];

  if (!times.length) {
    list.innerHTML = '<div class="step-sub">На цю дату немає вільного часу</div>';
    return;
  }

  times.forEach(time => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-slot';
    btn.textContent = time;

    btn.addEventListener('click', () => {
      bookingState.selectedTime = time;
      updateMeta();
      setStep('.step-form');
    });

    list.appendChild(btn);
  });
}

/* =====================================================
   PHONE MASK (BOOKING ONLY)
===================================================== */
function initPhoneMask(input) {
  if (!input) return;

  input.addEventListener('focus', () => {
    if (!input.value) input.value = '+380 ';
  });

  input.addEventListener('input', () => {
    let d = input.value.replace(/\D/g, '');
    if (d.startsWith('380')) d = d.slice(3);
    if (d.startsWith('0')) d = d.slice(1);
    d = d.slice(0, 9);

    let out = '+380';
    if (d.length) out += ' ' + d.slice(0, 2);
    if (d.length > 2) out += ' ' + d.slice(2, 5);
    if (d.length > 5) out += ' ' + d.slice(5, 7);
    if (d.length > 7) out += ' ' + d.slice(7, 9);

    input.value = out;
  });
}

/* =====================================================
   VALIDATION
===================================================== */
function validName(i) {
  return /^[A-Za-zА-Яа-яІіЇїЄєҐґ'ʼ\- ]{2,}$/.test(i.value.trim());
}
function validEmail(i) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim());
}
function validPhone(i) {
  return i.value.replace(/\D/g, '').length === 12;
}
function mark(i, ok) {
  i.classList.toggle('valid', ok);
  i.classList.toggle('invalid', !ok);
}

/* =====================================================
   INIT — вызывается из openBookingModal
===================================================== */
window.initBookingApp = function () {
  if (window.__BOOKING_INITED__) return;
  window.__BOOKING_INITED__ = true;

  const now = new Date();
  bookingState.currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  document.querySelector('.nav-btn.prev')?.addEventListener('click', () => changeMonth(-1));
  document.querySelector('.nav-btn.next')?.addEventListener('click', () => changeMonth(1));

  document.querySelector('.back-to-date')?.addEventListener('click', () => {
    setStep('.step-date');
    bookingState.selectedTime = null;
    updateMeta();
    renderCalendar();
  });

  document.querySelector('.back-to-time')?.addEventListener('click', () => {
    setStep('.step-time');
    updateMeta();
  });

  const form = document.getElementById('bookingForm');
  const status = document.querySelector('.form-status');
  if (!form) return;

  requestAnimationFrame(() => {
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = document.getElementById('phoneInput');

    initPhoneMask(phone);

    name.addEventListener('input', () => mark(name, validName(name)));
    email.addEventListener('input', () => mark(email, validEmail(email)));
    phone.addEventListener('input', () => mark(phone, validPhone(phone)));

    form.addEventListener('submit', e => {
      e.preventDefault();

      if (!bookingState.selectedDate || !bookingState.selectedTime) {
        status.textContent = 'Оберіть дату та час';
        return;
      }

      const ok1 = validName(name);
      const ok2 = validEmail(email);
      const ok3 = validPhone(phone);

      mark(name, ok1);
      mark(email, ok2);
      mark(phone, ok3);

      if (!ok1 || !ok2 || !ok3) {
        status.textContent = 'Заповніть форму коректно';
        return;
      }

      console.log({
        product: window.bookingProduct,
        price: window.bookingPrice,
        date: bookingState.selectedDate,
        time: bookingState.selectedTime,
        name: name.value,
        email: email.value,
        phone: phone.value
      });

      status.textContent = 'Заявку прийнято ✔';
      form.reset();
      [name, email, phone].forEach(i => i.classList.remove('valid', 'invalid'));
    });
  });

  updateMeta();
  renderCalendar();
};
