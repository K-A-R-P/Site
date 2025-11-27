function toggleMenu() {
  const menu = document.getElementById('menu');
  const burger = document.querySelector('.burger');
  menu.classList.toggle('open');
  burger.classList.toggle('active');
}

function closeMenu() {
  document.getElementById('menu').classList.remove('open');
  document.querySelector('.burger').classList.remove('active');
  document.body.style.overflow = '';
}

// === ГЛАВНАЯ АНИМАЦИЯ ПРИ ЗАГРУЗКЕ ===
window.addEventListener('load', () => {
  // 1. Обычные fade-up и fade-left (шапка, about)
  document.querySelectorAll('.fade-up, .fade-left').forEach(el => {
    el.classList.add('visible');
  });

  // 2. Заголовок «Мої продукти» — появляется первым
  setTimeout(() => {
    const header = document.querySelector('.products-header');
    if (header) header.classList.add('visible');

    // 3. Через 400 мс после заголовка — начинаем показывать ВСЕ карточки по очереди
    const cards = document.querySelectorAll('.cards > .card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, 400 + index * 300); // 400мс после заголовка + 300мс между карточками
    });
  }, 700); // сам заголовок через 700мс
});

// Остальные анимации при скролле (ниже по странице)
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.card-scroll').forEach(card => scrollObserver.observe(card));

const footerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.3 });
footerObserver.observe(document.querySelector('footer'));

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.addEventListener('scroll', () => {
  document.querySelector('.scroll-top').classList.toggle('visible', window.scrollY > 200);
});

// === ВСЕ ОСТАЛЬНЫЕ ФУНКЦИИ (модалки, оферта и т.д.) — ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ ===
function openContactsModal() {
  document.getElementById('contactsModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeContactsModal() {
  document.getElementById('contactsModal').classList.remove('active');
  document.body.style.overflow = '';
}

function openModal(card) {
  const img = card.querySelector('img').src;
  let content = card.querySelector('.card-content').innerHTML;
  content = content.replace(/style="display:none;"/g, '');
  content = content.replace('<div class="readmore">Читати далі →</div>', '');

  document.getElementById('modalImg').src = img;
  document.getElementById('modalContent').innerHTML = content;
  document.getElementById('cardModal').classList.add('active');
  document.body.style.overflow = 'hidden';

  // ← ВАЖНО: теперь любой клик по модалке (кроме кнопок) — закрывает её
  document.getElementById('cardModal').onclick = function(e) {
    if (!e.target.closest('button') && !e.target.closest('a')) {
      closeModal();
    }
  };
}

function closeModal() {
  document.getElementById('cardModal').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('cardModal').onclick = null; // сбрасываем обработчик
}

document.getElementById('cardModal').addEventListener('click', e => {
  if (e.target === document.getElementById('cardModal')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function openPricePopup(e, title, price) {
  e.stopPropagation();
  document.getElementById('priceTitle').textContent = 'Запис на ' + title;
  document.getElementById('priceLabel').textContent = 'Вартість: ' + price;
  document.getElementById('pricePopup').style.display = 'flex';
}
function closePricePopup() {
  document.getElementById('pricePopup').style.display = 'none';
}

document.getElementById('pricePopup').addEventListener('click', e => {
  if (e.target === document.getElementById('pricePopup')) closePricePopup();
});

function openCalendly(e, url) {
  e.stopPropagation();
  const clean = url + (url.includes('?') ? '&' : '?') + 'hide_event_type_details=1&hide_gdpr_banner=1&hide_landing_page_details=1';
  document.getElementById('calendlyIframe').src = clean;
  document.getElementById('calendlyModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCalendlyModal() {
  document.getElementById('calendlyModal').classList.remove('active');
  document.getElementById('calendlyIframe').src = '';
  document.body.style.overflow = '';
}

document.getElementById('calendlyModal').addEventListener('click', e => {
  if (e.target === document.getElementById('calendlyModal')) closeCalendlyModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('calendlyModal')?.classList.contains('active')) {
    closeCalendlyModal();
  }
});

function openWayForPay(button) {
  // ГАСИМ ВСПЛЫТИЕ СОБЫТИЯ — ЭТО ГЛАВНОЕ
  event.stopPropagation();          // ← ЭТА СТРОЧКА УБИВАЕТ МОРГАНИЕ

  const baseUrl = button.getAttribute('data-url');
  if (!baseUrl) return;

  const returnUrl = encodeURIComponent(window.location.href);
  const finalUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}returnUrl=${returnUrl}`;

  window.location.href = finalUrl;
}

// === ОТКРЫТИЕ ОФЕРТЫ — теперь повторный клик по тексту закрывает ===
function openOfferModal() {
  console.log('Кнопка оферти клікнута!');
  const modal = document.getElementById('offerModal');
  const content = document.getElementById('offerContent');

  if (content.innerHTML.trim() !== '') {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    activateOfferClickToClose();        // ← включаем магию
    return;
  }

  fetch('offer.txt?t=' + Date.now())
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(text => {
      content.innerHTML = text;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      activateOfferClickToClose();      // ← включаем магию после загрузки
    })
    .catch(() => {
      content.innerHTML = `<h1>Публічна оферта</h1><p>Це резервний текст...</p>`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      activateOfferClickToClose();
    });
}

// Вспомогательная функция — включаем закрытие по клику в любое место (кроме кнопок/ссылок)
function activateOfferClickToClose() {
  document.getElementById('offerModal').onclick = function(e) {
    if (!e.target.closest('a') && !e.target.closest('button')) {
      closeOfferModal();
    }
  };
}

// === ЗАКРЫТИЕ ОФЕРТЫ ===
function closeOfferModal() {
  document.getElementById('offerModal').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('offerModal').onclick = null;   // ← сбрасываем обработчик
}

const offerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      offerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.offer-scroll').forEach(el => offerObserver.observe(el));

function openPaymentModal() {
  document.getElementById('paymentModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closePaymentModal() {
  document.getElementById('paymentModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Закрытие по клику на фон и Escape
document.getElementById('paymentModal').addEventListener('click', e => {
  if (e.target === document.getElementById('paymentModal')) closePaymentModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('paymentModal')?.classList.contains('active')) {
    closePaymentModal();
  }
});

// ВЕРСИЯ PRO — супер-плавный параллакс с requestAnimationFrame
let aboutParallax = 0;
let currentY = 0;

function updateParallax() {
  const about = document.getElementById('about');
  if (!about) return;

  const rect = about.getBoundingClientRect();
  const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
  aboutParallax = offset * -0.12; // коэффицент скорости (меньше = медленнее)

  currentY += (aboutParallax - currentY) * 0.08; // сглаживание
  about.querySelector('.about-photo').style.transform = `translateY(${currentY}px) scale(1.06)`;

  if (Math.abs(aboutParallax - currentY) > 0.5) requestAnimationFrame(updateParallax);
}

window.addEventListener('scroll', () => requestAnimationFrame(updateParallax));
window.addEventListener('load', updateParallax);

// ——— ИДЕАЛЬНОЕ ПОЛЕ ТЕЛЕФОНА +38 (0XX) XXX XX XX ———
const phoneInput = document.getElementById('phoneInput');
if (phoneInput) {
  phoneInput.addEventListener('focus', function() {
    if (!this.value) this.value = '+38 ';
  });

  phoneInput.addEventListener('blur', function() {
    if (this.value === '+38 ') this.value = '';
  });

  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length === 0) {
      e.target.value = '';
      return;
    }

    if (value.length > 12) value = value.slice(0, 12);
    if (value.startsWith('38')) value = value.slice(2);

    let formatted = '+38 ';
    if (value.length > 0) formatted += '(' + value.slice(0, 3);
    if (value.length >= 3) formatted += ') ' + value.slice(3, 6);
    if (value.length >= 6) formatted += ' ' + value.slice(6, 8);
    if (value.length >= 8) formatted += ' ' + value.slice(8, 10);

    e.target.value = formatted;
  });
}



// ——— УСПЕШНАЯ МОДАЛКА ———
function showSuccessModal() {
  document.getElementById('successModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
  document.getElementById('successModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ——— ОБНОВЛЁННАЯ ОТПРАВКА ФОРМЫ ———
document.getElementById('bookingForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const title = document.getElementById('priceTitle').textContent.replace('Запис на ', '').trim();
  const price = document.getElementById('priceLabel').textContent;
  const name = e.target.name.value.trim();
  let phone = document.getElementById('phoneInput').value.trim();
  phone = phone.replace(/\D/g, '');
  if (phone.startsWith('38')) phone = phone.slice(2);
  if (phone.length !== 10) {
    document.getElementById('popupStatus').innerHTML = '<span style="color:red;">Введіть коректний номер телефону!</span>';
    return;
  }
  phone = '+38' + phone;

  const comment = e.target.comment.value.trim();
  const status = document.getElementById('popupStatus');

  // ← ВАЖНО: всегда начинаем с чистого состояния
  status.innerHTML = 'Відправляємо...';
  status.style.color = '#f7c843';

  try {
    const response = await fetch('https://addonsaf.pythonanywhere.com/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'new_booking',
        product: title,
        //price: price,
        name: name,
        phone: phone,
        comment: comment || '—'
      })
    });

    if (response.ok) {
      // УСПЕХ — закрываем форму, открываем success, сбрасываем форму
      closePricePopup();           // ← ЗАКРЫВАЕМ ФОРМУ
      showSuccessModal();          // ← ОТКРЫВАЕМ УСПЕШКУ
      e.target.reset();            // ← чистим поля
      document.getElementById('phoneInput').value = ''; // на всякий случай
      status.innerHTML = '';       // очищаем статус
    } else {
      throw new Error();
    }
  } catch (err) {
    status.innerHTML = `
      <div style="color:#d32f2f; margin-bottom:16px; font-size:17px; font-weight:600;">
        Помилка відправки
      </div>
      <div style="margin:24px 0 16px; font-size:18px; color:#333;">
        Напишіть мені в Direct
      </div>
      <div style="margin:20px 0;">
        <a href="https://ig.me/m/stetsurina.irina_coach" target="_blank">
          <img src="assets/icons/instagram.png"
               alt="Instagram Direct"
               style="width:68px; height:68px; animation: wiggle 2s ease-in-out infinite;">
        </a>
      </div>
    `;
  }
});

// ← ДОБАВЬ ЭТУ ФУНКЦИЮ — она будет сбрасывать форму и статус при каждом открытии попапа
function openPricePopup(e, title, price) {
  e.stopPropagation();

  // Сбрасываем всё перед открытием
  document.getElementById('priceTitle').textContent = 'Запис на ' + title;
  document.getElementById('priceLabel').textContent = 'Вартість: ' + price;
  document.getElementById('bookingForm').reset();
  document.getElementById('phoneInput').value = '';
  document.getElementById('popupStatus').innerHTML = '';

  document.getElementById('pricePopup').style.display = 'flex';
}

// ——— УНИВЕРСАЛЬНАЯ ПОДСВЕТКА ДЛЯ ИМЕНИ И ТЕЛЕФОНА ———
document.querySelectorAll('#bookingForm input[required]').forEach(input => {
  const check = () => {
    const val = input.value.trim();
    const digits = input.id === 'phoneInput' ? input.value.replace(/\D/g, '').length : 0;
    const valid =
      (input.name === 'name' && val.length >= 2) ||
      (input.id === 'phoneInput' && digits === 12);

    input.style.borderColor = valid ? '#4caf50' : '#ddd';
    input.style.boxShadow = valid ? '0 0 12px rgba(76,175,80,0.3)' : 'none';
  };

  input.addEventListener('input', check);
  input.addEventListener('blur', check);
  check(); // на случай автозаполнения
});