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

function openWayForPay() {
  const paymentUrl = "https://secure.wayforpay.com/button/b93e5be4236e3";
  const currentUrl = encodeURIComponent(window.location.href);
  const finalUrl = `${paymentUrl}?returnUrl=${currentUrl}`;
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