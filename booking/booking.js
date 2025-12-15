'use strict';

/* =====================================================
   BOOKING APP — SAFE, BASED ON WORKING VERSION
===================================================== */

/* ===== BACKEND ===== */
const BOOKING_API = 'https://booking-backend-riod.onrender.com';
let AVAILABILITY = {};

/* ===== STATE ===== */
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

/* ---------- LOAD SLOTS FROM BACKEND ---------- */
async function loadAvailability() {
  try {
    const res = await fetch(`${BOOKING_API}/api/slots`);
    if (!res.ok) throw new Error('slots fetch failed');
    AVAILABILITY = await res.json();
  } catch (e) {
    console.error('Slots load error:', e);
    AVAILABILITY = {};
  }
}

/* ---------- calendar ---------- */
function renderCalendar(root) {
  const grid  = root.querySelector('.calendar-grid');
  const label = root.querySelector('.month-label');
  if (!grid || !label || !state.currentMonth) return;

  grid.innerHTML = '';

  const today = startOfDay(new Date());
  const y = state.currentMonth.getFullYear();
  const m = state.currentMonth.getMonth();

  label.textContent = state.currentMonth.toLocaleString('uk-UA', {
    month: 'long',
    year: 'numeric'
  });

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

    const hasSlots = (AVAILABILITY[iso] || []).length > 0;

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
  const times = AVAILABILITY[state.selectedDate] || [];

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

/* ---------- phone mask ---------- */
function initPhoneMask(input) {
  if (!input) return;

  function format(digits) {
    digits = digits.replace(/\D/g, '');
    if (!digits.startsWith('38')) digits = '38' + digits.replace(/^0+/, '');
    digits = digits.slice(0, 12);

    const body = digits.slice(2);
    let out = '+38';
    if (body.length > 0) out += ' (' + body.substring(0, 3);
    if (body.length >= 3) out += ')';
    if (body.length > 3) out += ' ' + body.substring(3, 6);
    if (body.length > 6) out += ' ' + body.substring(6, 8);
    if (body.length > 8) out += ' ' + body.substring(8, 10);
    return out;
  }

  input.addEventListener('focus', () => {
    if (!input.value) input.value = '+38 ';
  });

  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '');
    input.value = format(digits);
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
   INIT — CALLED FROM MODAL OPEN
===================================================== */
window.initBookingApp = async function () {
  const root = document.getElementById('bookingApp');
  if (!root) return;

  const formOld = root.querySelector('#bookingForm');
  if (!formOld) return;

  // reload slots EACH open
  await loadAvailability();

  // reset state
  const now = new Date();
  state.currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  state.selectedDate = null;
  state.selectedTime = null;

  // nav
  root.querySelector('.nav-btn.prev')?.addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    renderCalendar(root);
  });

  root.querySelector('.nav-btn.next')?.addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    renderCalendar(root);
  });

  root.querySelector('.back-to-date')?.addEventListener('click', () => {
    setStep(root, '.step-date');
  });

  root.querySelector('.back-to-time')?.addEventListener('click', () => {
    setStep(root, '.step-time');
  });

  const form = formOld.cloneNode(true);
  formOld.replaceWith(form);

  const name  = form.querySelector('input[name="name"]');
  const email = form.querySelector('input[name="email"]');
  const phone = form.querySelector('input[name="phone"]') || form.querySelector('#phoneInput');
  const status = root.querySelector('.form-status');

  initPhoneMask(phone);

  const repaint = () => {
    mark(name, validName(name.value));
    mark(email, validEmail(email.value));
    mark(phone, validPhone(phone.value));
  };

  name.addEventListener('input', repaint);
  email.addEventListener('input', repaint);
  phone.addEventListener('input', repaint);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!state.selectedDate || !state.selectedTime) {
      if (status) status.textContent = 'Оберіть дату та час';
      return;
    }

    if (!validName(name.value) || !validEmail(email.value) || !validPhone(phone.value)) {
      if (status) status.textContent = 'Заповніть форму коректно';
      repaint();
      return;
    }

    if (status) status.textContent = 'Надсилаємо заявку…';

    try {
      const res = await fetch(`${BOOKING_API}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: state.selectedDate,
          time: state.selectedTime,
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          product: window.bookingProduct || '',
          price: window.bookingPrice || '',
          pay_link: window.bookingPayLink || '',
          comment: ''
        })
      });

      if (res.status === 409) {
        status.textContent = 'Цей час вже зайнятий 🙏';
        return;
      }

      if (!res.ok) {
        status.textContent = 'Помилка сервера';
        return;
      }

      status.textContent = 'Заявку прийнято ✔';

// 1️⃣ сначала ЗАКРЫВАЕМ booking modal
document.getElementById('bookingModal')?.classList.remove('active');

// 2️⃣ потом ОТКРЫВАЕМ success
document.getElementById('successModal')?.classList.add('active');

// 3️⃣ и только потом reset
form.reset();
repaint();


    } catch (err) {
      console.error(err);
      status.textContent = 'Сервер недоступний';
    }
  });

  updateMeta(root);
  setStep(root, '.step-date');
  renderCalendar(root);
};
