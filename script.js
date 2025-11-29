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

// === ГЛАВНАЯ АНИМАЦИЯ ПРИ ЗАГРУЗКЕ (2025 — чисто, без косяков) ===
window.addEventListener('load', () => {
  // 1. Шапка, about и всё, что с классами .fade-up / .fade-left — сразу
  document.querySelectorAll('.fade-up, .fade-left').forEach(el => {
    // Исключаем карточки продуктов — их анимируем отдельно и красивее
    if (!el.closest('.cards')) {
      el.classList.add('visible');
    }
  });

  // 2. Заголовок «Мої продукти» — через 500 мс
  setTimeout(() => {
    const header = document.querySelector('.products-header');
    if (header) header.classList.add('visible');

    // 3. Карточки — по очереди, с правильным reflow и плавным выездом
    const cards = document.querySelectorAll('.cards > .card');
    cards.forEach((card, index) => {
      setTimeout(() => {

        // Магия — запускаем пересчёт стилей
        void card.offsetHeight;

        // Теперь анимируем появление
        card.classList.add('visible');
      }, 200 + index * 220); // плавная лесенка: 200, 420, 640 мс
    });
  }, 500); // заголовок появляется через полсекунды
});

// === АНИМАЦИЯ ПРИ СКРОЛЛЕ (ниже по странице) ===
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card-scroll, .offer-scroll').forEach(el => {
  scrollObserver.observe(el);
});

// Футер — отдельно, чуть позже
const footerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });
const footer = document.querySelector('footer');
if (footer) footerObserver.observe(footer);

// Кнопка вверх
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.addEventListener('scroll', () => {
  document.querySelector('.scroll-top')?.classList.toggle('visible', window.scrollY > 300);
});

// =============== Контакты ===
function openContactsModal() {
  document.getElementById('contactsModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeContactsModal() {
  document.getElementById('contactsModal').classList.remove('active');
  document.body.style.overflow = '';
}
//==========Карточки услуг===================================
function openModal(card) {
  const img = card.querySelector('img').src;
  let content = card.querySelector('.card-content').innerHTML;
  content = content.replace(/style="display:none;"/g, '');
  content = content.replace('<div class="readmore">Читати далі →</div>', '');

  document.getElementById('modalImg').src = img;
  document.getElementById('modalContent').innerHTML = content;
  document.getElementById('cardModal').classList.add('active');
  document.body.style.overflow = 'hidden';

  const modalCard = document.querySelector('.modal-card');
  modalCard.scrollTop = 0;

  document.getElementById('cardModal').onclick = function(e) {
    // Закрываем по клику на фон ИЛИ внутри карточки, но НЕ по кнопкам/ссылкам
    if (e.target === document.getElementById('cardModal') ||
        (e.target.closest('.modal-card') && !e.target.closest('button') && !e.target.closest('a'))) {
      closeModal();
    }
  };

    // ПЛАВНЫЙ СКРОЛЛ ВВЕРХ — С РАЗНЫМИ ЗНАЧЕНИЯМИ ДЛЯ ДЕСКТОПА И МОБИЛКИ
  setTimeout(() => {
    // Автоопределение: мобилка или десктоп
    const isMobile = window.innerWidth <= 768;

    const distance = isMobile ? 230 : 300;     // ← мобилка: 230px, десктоп: 300px
    const duration = isMobile ? 1400 : 1500;   // ← можно чуть быстрее на мобилке
    // или так: const duration = 1500; // если хочешь одинаковую длительность

    const start = modalCard.scrollTop;
    const startTime = performance.now();

    function scrollStep(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);

      modalCard.scrollTop = start + distance * ease;

      if (progress < 1) requestAnimationFrame(scrollStep);
    }

    requestAnimationFrame(scrollStep);
  }, 200); // твоя задержка остаётся
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



//================Calendly===============================
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

//=================WayForPay========================
function openWayForPay(button) {
  event.stopPropagation();          // ← ЭТА СТРОЧКА УБИВАЕТ МОРГАНИЕ
  const baseUrl = button.getAttribute('data-url');
  if (!baseUrl) return;
  const returnUrl = encodeURIComponent(window.location.href);
  const finalUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}returnUrl=${returnUrl}`;
  window.location.href = finalUrl;
}

// === ОТКРЫТИЕ ОФЕРТЫ  ===
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

//================ЗАПИСАТСЯ==================================
function openPaymentModal() {
  document.getElementById('paymentModal').classList.add('active');
  document.body.style.overflow = 'hidden';

  // ← СБРАСЫВАЕМ СКРОЛЛ ВВЕРХ КАЖДЫЙ РАЗ ПРИ ОТКРЫТИИ
  const modal = document.getElementById('paymentModal');
  modal.scrollTop = 0;                 // работает, если скроллится сам #paymentModal
  // Если у тебя внутри есть отдельный блок со скроллом (например .payment-modal-content), то так:
  // document.querySelector('#paymentModal .payment-modal-content')?.scrollTop = 0;
}

function closePaymentModal() {
  document.getElementById('paymentModal').classList.remove('active');
  document.body.style.overflow = '';

  // На всякий случай сбрасываем и при закрытии (не обязательно, но надёжно)
  document.getElementById('paymentModal').scrollTop = 0;
}

// Закрытие по клику на фон и Escape — оставляем как было
document.getElementById('paymentModal').addEventListener('click', e => {
  if (e.target === document.getElementById('paymentModal')) closePaymentModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('paymentModal')?.classList.contains('active')) {
    closePaymentModal();
  }
});

// ========================плавный параллакс с requestAnimationFrame===================
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

// ——— ТВОЯ ЗОЛОТАЯ МАСКА — ИСПРАВЛЕНА И РАБОТАЕТ НА ВСЕХ УСТРОЙСТВАХ ———
const phoneInput = document.getElementById('phoneInput');
if (phoneInput) {
  let lastDigits = '';

  // ФОРМАТЕР — ОСТАВЛЯЕМ КАК БЫЛ, ОН ИДЕАЛЬНЫЙ
  function formatPhone(d) {
    if (d.length <= 2) return '+' + d;
    const body = d.slice(2);
    let out = '+38';
    if (body.length > 0) out += ' (' + body.substring(0, 3);
    if (body.length >= 3) out += ')';
    if (body.length > 3) out += ' ' + body.substring(3, 6);
    if (body.length > 6) out += ' ' + body.substring(6, 8);
    if (body.length > 8) out += ' ' + body.substring(8, 10);
    return out;
  }

  // ГЛАВНЫЙ ФИКС: перехватываем Backspace и удаляем по одной цифре
  phoneInput.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace') {
      const pos = this.selectionStart;
      const current = this.value;

      // Если стоим после закрывающей скобки или пробела — удаляем предыдущую цифру
      if (current[pos - 1] === ')' || current[pos - 1] === ' ') {
        e.preventDefault();
        const digits = current.replace(/\D/g, '').slice(0, -1);
        this.value = formatPhone(digits);
        this.setSelectionRange(this.value.length, this.value.length);
      }
      // Полное удаление +38 при пустом поле
      else if (current === '+38 ' || current === '+38') {
        e.preventDefault();
        this.value = '';
      }
    }
  });

  // Обычный ввод — всё как было
  phoneInput.addEventListener('input', function() {
    let d = this.value.replace(/\D/g, '');
    if (d.startsWith('8') && d.length > 1) d = '3' + d;
    d = d.slice(0, 12);
    this.value = formatPhone(d);
    this.setSelectionRange(this.value.length, this.value.length);
    lastDigits = d;
  });

  // Фокус и блюр — как было
  phoneInput.addEventListener('focus', () => {
    if (!phoneInput.value) {
      phoneInput.value = '+38 ';
      phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
    }
  });

  phoneInput.addEventListener('blur', () => {
    if (phoneInput.value.replace(/\D/g, '').length <= 2) {
      phoneInput.value = '';
    }
  });
}

// ——— УСПЕШНАЯ МОДАЛКА ———
function showSuccessModal() {
  document.getElementById('successModal').classList.add('active');
  document.body.style.overflow = 'hidden';

  // КОНФЕТТИ
  confetti({ particleCount: 180, spread: 76, origin: { y: 0.58 }, colors: ['#f7c843', '#ffffff', '#333333'], scalar: 1.3 });

  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.6 } });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 } });
  }, 200);

  // ФОРСИМ КОНФЕТТИ НА ПЕРЕДНИЙ ПЛАН
  setTimeout(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.zIndex = '99999';
      canvas.style.position = 'fixed';
    }
  }, 100);
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

function openPricePopup(e, title, price) {
  e.stopPropagation();

  document.getElementById('priceTitle').textContent = title;
  document.getElementById('priceLabel').textContent = 'Вартість: ' + price;

  // Сброс формы и подсветки
  document.getElementById('bookingForm').reset();
  document.getElementById('phoneInput').value = '';
  document.getElementById('popupStatus').innerHTML = '';

  document.querySelectorAll('#pricePopup input, #pricePopup textarea').forEach(input => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  });

  // ← ГЛАВНОЕ: сбрасываем скролл модалки при каждом открытии
  const popup = document.getElementById('pricePopup');
  popup.style.display = 'flex';
  popup.scrollTop = 0;                     // ← всегда открывается сверху
}

function closePricePopup() {
  const popup = document.getElementById('pricePopup');
  popup.style.display = 'none';
  popup.scrollTop = 0;                     // ← гарантируем чистоту при следующем открытии
  resetFormHighlights();
  document.getElementById('popupStatus').innerHTML = '';
}
// Закриття по кліку на фон + Escape
document.getElementById('pricePopup').addEventListener('click', e => {
  if (e.target === document.getElementById('pricePopup')) closePricePopup();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('pricePopup').style.display === 'flex') {
    closePricePopup();
  }
});

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

// === ПОЛНЫЙ СБРОС ПОДСВЕТКИ ПОЛЕЙ ПРИ ЗАКРЫТИИ ФОРМЫ ===
function resetFormHighlights() {
  document.querySelectorAll('#pricePopup input, #pricePopup textarea').forEach(input => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  });
}

// Обновляем функцию закрытия
function closePricePopup() {
  document.getElementById('pricePopup').style.display = 'none';

  // Сбрасываем всё:
  resetFormHighlights();                    // ← убираем зелёные рамки
  document.getElementById('popupStatus').innerHTML = '';

  // На всякий случай — сбрасываем форму (хотя reset() уже есть)
  setTimeout(() => {
    document.getElementById('bookingForm')?.reset();
    document.getElementById('phoneInput').value = '';
  }, 100);
}

// ------------------Жорстке рішення проблеми "пливе вгору після F5-----------------"
(function fixScrollRestore() {
  // 1. Примусово блокуємо автоматичне відновлення скролу
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // 2. Після завантаження сторінки — ставимо правильний padding і прокручуємо на 0
  window.addEventListener('load', () => {
    // Даємо браузеру 50 мс, щоб він "заспокоївся"
    setTimeout(() => {
      const headerHeight = document.querySelector('.topbar').offsetHeight;
      document.documentElement.style.scrollPaddingTop = headerHeight + 20 + 'px';

      // Якщо ми не на самому верху — плавно підправляємо позицію
      if (window.scrollY > 0) {
        const correctY = window.scrollY + headerHeight + 20;
        window.scrollTo({
          top: correctY,
          behavior: 'instant'  // без анімації, щоб не помітно
        });
      }

      // Додатково — ще раз через 100 мс (на випадок лагаючих шрифтів/зображень)
      setTimeout(() => {
        const headerHeight2 = document.querySelector('.topbar').offsetHeight;
        document.documentElement.style.scrollPaddingTop = headerHeight2 + 20 + 'px';
      }, 150);
    }, 50);
  });

  // На resize теж оновлюємо (мобілка ↔ десктоп, меню відкрите і т.д.)
  window.addEventListener('resize', () => {
    const headerHeight = document.querySelector('.topbar').offsetHeight;
    document.documentElement.style.scrollPaddingTop = headerHeight + 20 + 'px';
  });
})();
//__________________________________________________________________________