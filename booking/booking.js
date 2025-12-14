'use strict';

/* =====================================================
   BOOKING APP — SCOPED TO BOOKING MODAL (NO EXIT CONFLICT)
===================================================== */

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

/* ---------- helpers ---------- */
function pad2(n) { return String(n).padStart(2, '0'); }
function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function toLocalISO(d) { return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }

function setStep(root, cls) {
  root.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  root.querySelector(cls)?.classList.add('active');
}

function updateMeta(root) {
  const txt =
    state.selectedDate && state.selectedTime ? `Обрано: ${state.selectedDate} • ${state.selectedTime}` :
    state.selectedDate ? `Обрано: ${state.selectedDate}` : '';

  root.querySelectorAll('.selected-meta').forEach(el => el.textContent = txt);
}

/* ---------- calendar ---------- */
function renderCalendar(root) {
  const grid  = root.querySelector('.calendar-grid');
  const label = root.querySelector('.month-label');
  if (!grid || !label) return;

  grid.innerHTML = '';

  const today = startOfDay(new Date());
  const y = state.currentMonth.getFullYear();
  const m = state.currentMonth.getMonth();

  label.textContent = state.currentMonth.toLocaleString('uk-UA', { month: 'long', year: 'numeric' });

  const firstDay = new Date(y, m, 1);
  const offset = (firstDay.getDay() + 6) % 7;

  for (let i = 0; i < offset; i++) {
    const sp = document.createElement('div');
    sp.className = 'day-spacer';
    grid.appendChild(sp);
  }

  const daysInMonth = new Date(y, m + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(y, m, day);
    const iso = toLocalISO(d);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'day';
    btn.textContent = day;

    const hasSlots = (MOCK_AVAILABILITY[iso] || []).length > 0;

    if (startOfDay(d) <= today || !hasSlots) {
      btn.disabled = true;
      btn.classList.add('disabled');
    } else {
      btn.classList.add('available');
      btn.addEventListener('click', () => {
        state.selectedDate = iso;
        state.selectedTime = null;
        updateMeta(root);
        setStep(root, '.step-time');
        renderTimes(root);
      });
    }

    grid.appendChild(btn);
  }
}

function renderTimes(root) {
  const list = root.querySelector('.time-list');
  if (!list) return;

  list.innerHTML = '';
  const times = MOCK_AVAILABILITY[state.selectedDate] || [];

  if (!times.length) {
    list.innerHTML = "<div class='step-sub'>На цю дату немає вільного часу</div>";
    return;
  }

  times.forEach(time => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-slot';
    btn.textContent = time;

    btn.addEventListener('click', () => {
      state.selectedTime = time;
      updateMeta(root);
      setStep(root, '.step-form');
    });

    list.appendChild(btn);
  });
}

/* ---------- phone mask (booking only) ---------- */
function initPhoneMask(input) {
  if (!input) return;

  function format(digits) {
    // digits must be max 12 for UA: 380XXXXXXXXX
    digits = digits.replace(/\D/g, '');
    if (digits.startsWith('8') && digits.length > 1) digits = '3' + digits;
    if (!digits.startsWith('38')) digits = '38' + digits.replace(/^0+/, '');
    digits = digits.slice(0, 12);

    // +38 (0XX) XXX XX XX style, but digits are 38 + 10
    const body = digits.slice(2); // 10 digits
    let out = '+38';
    if (body.length > 0) out += ' (' + body.substring(0, 3);
    if (body.length >= 3) out += ')';
    if (body.length > 3) out += ' ' + body.substring(3, 6);
    if (body.length > 6) out += ' ' + body.substring(6, 8);
    if (body.length > 8) out += ' ' + body.substring(8, 10);
    return out;
  }

  input.addEventListener('focus', () => {
    if (!input.value) {
      input.value = '+38 ';
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });

  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '');
    input.value = format(digits);
    input.setSelectionRange(input.value.length, input.value.length);
  });

  input.addEventListener('blur', () => {
    if (input.value.replace(/\D/g, '').length <= 2) input.value = '';
  });
}

/* ---------- validation ---------- */
function validName(v) { return (v || '').trim().length >= 2; }
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()); }
function validPhone(v) { return (v || '').replace(/\D/g, '').length === 12; }

function mark(el, ok) {
  el.classList.toggle('valid', !!ok);
  el.classList.toggle('invalid', !ok);
}

/* =====================================================
   INIT — called from openBookingModal (every open)
===================================================== */
window.initBookingApp = function () {
  // scope strictly to booking modal DOM (so we never touch exit popup)
  const modal = document.getElementById('bookingModal');
  const root = modal ? modal : document;

  const container = root.querySelector('#bookingContainer') || root;
  const formOld = container.querySelector('#bookingForm');
  if (!formOld) return;

  // убираем старые обработчики без перезаписи всего DOM
  const form = formOld.cloneNode(true);
  formOld.replaceWith(form);

  const now = new Date();
  state.currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  state.selectedDate = null;
  state.selectedTime = null;

  // nav
  container.querySelector('.nav-btn.prev')?.addEventListener('click', () => {
    state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
    renderCalendar(container);
  });

  container.querySelector('.nav-btn.next')?.addEventListener('click', () => {
    state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
    renderCalendar(container);
  });

  container.querySelector('.back-to-date')?.addEventListener('click', () => {
    state.selectedTime = null;
    updateMeta(container);
    setStep(container, '.step-date');
  });

  container.querySelector('.back-to-time')?.addEventListener('click', () => {
    updateMeta(container);
    setStep(container, '.step-time');
  });

  // fields (ВАЖНО: только внутри bookingForm!)
  const name  = form.querySelector('input[name="name"]');
  const email = form.querySelector('input[name="email"]');
  const phone = form.querySelector('input[name="phone"]') || form.querySelector('#phoneInput'); // на всякий

  const status = container.querySelector('.form-status');

  if (!name || !email || !phone) return;

  // mask + live validation
  initPhoneMask(phone);

  const repaint = () => {
    mark(name,  validName(name.value));
    mark(email, validEmail(email.value));
    mark(phone, validPhone(phone.value));
  };

  name.addEventListener('input', repaint);
  email.addEventListener('input', repaint);
  phone.addEventListener('input', repaint);

  repaint();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!state.selectedDate || !state.selectedTime) {
      if (status) status.textContent = 'Оберіть дату та час';
      return;
    }

    const ok1 = validName(name.value);
    const ok2 = validEmail(email.value);
    const ok3 = validPhone(phone.value);

    mark(name, ok1);
    mark(email, ok2);
    mark(phone, ok3);

    if (!ok1 || !ok2 || !ok3) {
      if (status) status.textContent = 'Заповніть форму коректно';
      return;
    }

    console.log({
      product: window.bookingProduct,
      price: window.bookingPrice,
      date: state.selectedDate,
      time: state.selectedTime,
      name: name.value,
      email: email.value,
      phone: phone.value
    });

    if (status) status.textContent = 'Заявку прийнято ✔';
    form.reset();
    [name, email, phone].forEach(el => el.classList.remove('valid', 'invalid'));
  });

  updateMeta(container);
  renderCalendar(container);
};
