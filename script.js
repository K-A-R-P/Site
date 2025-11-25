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

window.addEventListener('load', () => {
  document.querySelectorAll('.fade-up, .fade-left').forEach(el => {
    el.classList.add('visible');
  });

  setTimeout(() => {
    document.querySelector('.products-header').classList.add('visible');
    document.querySelectorAll('.cards > .card:nth-child(-n+2)').forEach(card => {
      card.classList.add('visible');
    });
  }, 700);
});

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card-scroll').forEach(card => {
  scrollObserver.observe(card);
});

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
}
function closeModal() {
  document.getElementById('cardModal').classList.remove('active');
  document.body.style.overflow = '';
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

document.getElementById('contactsModal').addEventListener('click', e => {
  if (e.target === document.getElementById('contactsModal')) closeContactsModal();
});
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
  if (e.target === document.getElementById('calendlyModal')) {
    closeCalendlyModal();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('calendlyModal').classList.contains('active')) {
    closeCalendlyModal();
  }
});

function openWayForPay() {
  const paymentUrl = "https://secure.wayforpay.com/button/b93e5be4236e3";
  const currentUrl = encodeURIComponent(window.location.href);
  const finalUrl = `${paymentUrl}?returnUrl=${currentUrl}`;
  window.location.href = finalUrl;
}

function openOfferModal() {
  console.log('Кнопка оферти клікнута!'); // Для дебагу — дивись в F12 > Console
  const modal = document.getElementById('offerModal');
  const content = document.getElementById('offerContent');

  if (content.innerHTML.trim() !== '') {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    return;
  }

  fetch('offer.txt')
    .then(r => {
      console.log('Fetch успішний, статус:', r.status); // Дебаг
      if (!r.ok) throw new Error('offer.txt не найден');
      return r.text();
    })
    .then(text => {
      console.log('Текст завантажено:', text.substring(0, 100) + '...'); // Дебаг перших 100 символів
      content.innerHTML = text;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    })
    .catch(err => {
      console.error('Помилка fetch:', err); // Дебаг помилки
      // Fallback: вставляємо ТЕКСТ ПРЯМО ЗУПИНИТИСЯ ТУТ, бо .txt може не працювати — вшиваємо базовий текст
      content.innerHTML = `
        <h1>Публічна оферта</h1>
        <p>Цей документ є офіційною пропозицією (публічною офертою) ФОП Стецуріна Ірина Олександрівна (надалі — Виконавець) укласти договір на надання консультаційних послуг на зазначених нижче умовах.</p>

        <h2>1. Загальні положення</h2>
        <p>1.1. Ця оферта адресована будь-яким фізичним та юридичним особам.<br>
           1.2. Акцепт оферти = оплата послуг або запис на консультацію через сайт чи Calendly.</p>

        <h2>2. Предмет договору</h2>
        <p>2.1. Виконавець надає консультаційні, коучингові та менторські послуги.<br>
           2.2. Формат: онлайн (Zoom) або офлайн (м. Київ).</p>

        <h2>3. Вартість та порядок оплати</h2>
        <p>3.1. Актуальна вартість вказана на сайті.<br>
           3.2. Оплата 100% передоплатою через WayForPay.<br>
           3.3. Перенесення можливо не пізніше ніж за 24 години до зустрічі.</p>

        <h2>4. Конфіденційність та відповідальність</h2>
        <p>Виконавець гарантує повну конфіденційність. Послуги мають рекомендаційний характер і не є медичною допомогою.</p>

        <h2>5. Реквізити</h2>
        <p><strong>ФОП Стецуріна Ірина Олександрівна</strong><br>
           ІПН: 3194610477<br>
           м. Київ, Україна<br>
           тел.: +380 (67) 404-07-07<br>
           e-mail: stetsurina.irina@gmail.com</p>
        <!-- Додай сюди свої 4 листа тексту — скільки завгодно, модалка прокрутиться -->
      `;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
}

function closeOfferModal() {
  document.getElementById('offerModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('offerModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('offerModal')) closeOfferModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('offerModal')?.classList.contains('active')) {
    closeOfferModal();
  }
});

// Анимация кнопки оферты
const offerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      offerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.offer-scroll').forEach(el => offerObserver.observe(el));