function toggleMenu() {
  const menu = document.getElementById('menu');
  const burger = document.querySelector('.burger');
  const topbar = document.querySelector('.topbar');

  menu.classList.toggle('open');
  burger.classList.toggle('active');
  topbar.classList.toggle('open-menu');
}

function closeMenu() {
  document.getElementById('menu').classList.remove('open');
  document.querySelector('.burger').classList.remove('active');
  document.querySelector('.topbar').classList.remove('open-menu');
  document.body.style.overflow = '';
}


/* =========================================================
   APPLE-LIKE INITIAL LOAD ANIMATION
   ========================================================= */
window.addEventListener('load', () => {

  /* 1) HERO BLOCK (header) */
  const hero = document.querySelector('header.fade-up');
  if (hero) {
    setTimeout(() => {
      hero.classList.add('visible');
    }, 200);
  }

  /* 2) ABOUT BLOCK */
  const aboutBlock = document.querySelector('#about .about-wrapper');
  if (aboutBlock) {
    setTimeout(() => {
      aboutBlock.classList.add('visible');
    }, 700);
  }

  // 3) INTRO FEATURES — stagger
  const introCards = document.querySelectorAll('#intro-features .mini-feature');
  introCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, 1600 + index * 180);
  });

}); // ← вот этого не хватало

/* =========================================================
   SCROLL ANIMATIONS (HEADERS + CARDS)
   ========================================================= */

/* --- A) Section headers appear first --- */
document.querySelectorAll('section .products-header:not(.no-scroll-trigger)').forEach(header => {
  const obsH = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        header.classList.add('visible');
        observer.unobserve(header);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -5%"
  });

  obsH.observe(header);
});

/* --- B) Cards appear AFTER headers (stagger) --- */
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      const cards = entry.target.querySelectorAll('.card.scroll-animate');

      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, 450 + index * 200);
      });

      scrollObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.07,
  rootMargin: "0px 0px -5%"
});

/* Observe only sections that have scroll-animate cards */
document.querySelectorAll('section').forEach(sec => {
  if (sec.querySelector('.card.scroll-animate')) {
    scrollObserver.observe(sec);
  }
});

/* =========================================================
   FOOTER SHOW IMMEDIATELY
   ========================================================= */
const footer = document.querySelector('footer');
if (footer) footer.classList.add('visible');

/* =========================================================
   SCROLL TO TOP
   ========================================================= */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.addEventListener('scroll', () => {
  document.querySelector('.scroll-top')?.classList.toggle('visible', window.scrollY > 300);
});

/* =========================================================
   CONTACT MODAL — PREMIUM VERSION
   ========================================================= */

function openContactsModal() {
  const modal = document.getElementById('contactsModal');
  const content = modal.querySelector('.contacts-modal-content');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // запускаем анимацию только здесь
  content.style.animation = 'contactsSoftPop .55s cubic-bezier(.16,1,.3,1) forwards';
}


function closeContactsModal() {
  const modal = document.getElementById('contactsModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* Клик по фону — закрыть */
document.getElementById('contactsModal').addEventListener('click', e => {
  if (e.target === document.getElementById('contactsModal')) closeContactsModal();
});

/* Клик внутри, НО если не кнопка/не ссылка → закрываем */
document.querySelector('.contacts-modal-content').addEventListener('click', e => {
  if (!e.target.closest('a') && !e.target.closest('button')) {
    closeContactsModal();
  }
});

/* ESC */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' &&
      document.getElementById('contactsModal').classList.contains('active')) {
    closeContactsModal();
  }
});


/* =========================================================
   CARD MODAL — FULL TEXT + GLASS EDGES + WHITE CONTENT
========================================================== */

function openModal(card) {

  // 1. Берём ПОЛНЫЙ текст карточки
  let content = card.querySelector(".card-content").innerHTML;

  // 2. Убираем скрытие длинного текста
  content = content.replace(/style="display:none;"/g, "");

  // 3. Убираем "Читати далі"
  content = content.replace('<div class="readmore">Читати далі →</div>', "");

  // 4. Вставляем
  document.getElementById("modalContent").innerHTML = content;

  // 5. Открываем модалку
  const modal = document.getElementById("cardModal");
  const modalCard = modal.querySelector(".modal-card");

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // 6. Всегда сверху
  modalCard.scrollTop = 0;

  // 7. Закрытие по клику вне окна
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

/* Клик ВНУТРИ карточки → закрыть (кроме ссылок и кнопок) */
document.querySelector('#cardModal .modal-card').addEventListener('click', e => {
  if (!e.target.closest('button') && !e.target.closest('a')) {
    closeModal();
  }
});


function closeModal() {
  const modal = document.getElementById("cardModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});


/* =========================================================
   CALENDLY MODAL
   ========================================================= */
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

/* =========================================================
   WAYFORPAY
   ========================================================= */
function openWayForPay(button) {
  event.stopPropagation();
  const baseUrl = button.getAttribute('data-url');
  if (!baseUrl) return;
  const returnUrl = encodeURIComponent(window.location.href);
  const finalUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}returnUrl=${returnUrl}`;
  window.location.href = finalUrl;
}

/* =========================================================
   OFFER MODAL
   ========================================================= */
function openOfferModal() {
  const modal = document.getElementById('offerModal');
  const content = document.getElementById('offerContent');
  const offerBtn = document.querySelector('.offer-button'); // 🔥 кнопка оферти

  // добавляем активное состояние кнопке
  if (offerBtn) offerBtn.classList.add('active');

  if (content.innerHTML.trim() !== '') {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    activateOfferClickToClose();
    return;
  }

  fetch('offer.txt?t=' + Date.now())
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(text => {
      content.innerHTML = text;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      activateOfferClickToClose();
    })
    .catch(() => {
      content.innerHTML = `<h1>Публічна оферта</h1><p>Це резервний текст...</p>`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      activateOfferClickToClose();
    });
}

function activateOfferClickToClose() {
  document.getElementById('offerModal').onclick = function(e) {
    if (!e.target.closest('a') && !e.target.closest('button')) {
      closeOfferModal();
    }
  };
}

function closeOfferModal() {
  const offerBtn = document.querySelector('.offer-button'); // 🔥 кнопка оферти

  document.getElementById('offerModal').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('offerModal').onclick = null;

  // снимаем активное состояние кнопки
  if (offerBtn) offerBtn.classList.remove('active');
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


/* =========================================================
   PAYMENT MODAL — как у контактов
========================================================= */
function openPaymentModal() {
  const modal = document.getElementById('paymentModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* Клик по фону */
document.getElementById('paymentModal').addEventListener('click', e => {
  if (e.target === document.getElementById('paymentModal')) {
    closePaymentModal();
  }
});

/* ESC */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' &&
      document.getElementById('paymentModal').classList.contains('active')) {
    closePaymentModal();
  }
});
document.querySelector('.payment-modal-content').addEventListener('click', e => {
  if (!e.target.closest('button') && !e.target.closest('a')) {
    closePaymentModal();
  }
});


/* =========================================================
   PHONE MASK
   ========================================================= */
const phoneInput = document.getElementById('phoneInput');
if (phoneInput) {
  let lastDigits = '';

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

  phoneInput.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace') {
      const pos = this.selectionStart;
      const current = this.value;

      if (current[pos - 1] === ')' || current[pos - 1] === ' ') {
        e.preventDefault();
        const digits = current.replace(/\D/g, '').slice(0, -1);
        this.value = formatPhone(digits);
        this.setSelectionRange(this.value.length, this.value.length);
      }
      else if (current === '+38 ' || current === '+38') {
        e.preventDefault();
        this.value = '';
      }
    }
  });

  phoneInput.addEventListener('input', function() {
    let d = this.value.replace(/\D/g, '');
    if (d.startsWith('8') && d.length > 1) d = '3' + d;
    d = d.slice(0, 12);
    this.value = formatPhone(d);
    this.setSelectionRange(this.value.length, this.value.length);
    lastDigits = d;
  });

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

/* =========================================================
   SUCCESS MODAL + CONFETTI + CLICK CLOSE
========================================================= */

function showSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // --- CONFETTI ---
  confetti({
    particleCount: 180,
    spread: 76,
    origin: { y: 0.58 },
    colors: ['#f7c843', '#ffffff', '#333333'],
    scalar: 1.3
  });

  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.6 } });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 } });
  }, 200);

  setTimeout(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.zIndex = '99999';
      canvas.style.position = 'fixed';
    }
  }, 100);
}

function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* =========================================================
   SUCCESS — CLICK HANDLERS (как в оплате)
========================================================= */

// Клик по фону — закрыть
document.getElementById('successModal').addEventListener('click', e => {
  const modal = document.getElementById('successModal');
  const content = modal.querySelector('.popup-content');

  // если кликнули именно по фону (modal), а не по окну — закрыть
  if (e.target === modal) {
    closeSuccessModal();
  }
});

// Клик внутри окна — закрыть (кроме кнопок/ссылок)
document.querySelector('#successModal .popup-content').addEventListener('click', e => {
  if (!e.target.closest('a') && !e.target.closest('button')) {
    closeSuccessModal();
  }
});

// ESC — закрыть
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' &&
      document.getElementById('successModal').classList.contains('active')) {
    closeSuccessModal();
  }
});


/* =========================================================
   FORM SEND
   ========================================================= */
document.getElementById('bookingForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const title = document.getElementById('priceTitle').textContent;
  const name = this.querySelector('input[name="name"]').value.trim();
  let phone = document.getElementById('phoneInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const comment = this.querySelector('textarea[name="comment"]').value.trim();

  const status = document.getElementById('popupStatus');
  status.innerHTML = "";

  // -----------------------------
  // EMAIL VALIDATION
  // -----------------------------
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    status.innerHTML = '<span style="color:red;">Введіть коректний email!</span>';
    return;
  }

  // -----------------------------
  // PHONE NORMALIZATION
  // -----------------------------
  if (!phone.startsWith("+38")) {
    phone = "+38" + phone.replace(/\D/g, '');
  }

  // -----------------------------
  // READ CONFIG FROM CARD
  // -----------------------------
  const card = window.bookingCard || null;
  let send_email = false;
  let email_template = "";
  let pay_link = "";
  let price = "";

  if (card) {
    send_email = card.dataset.sendEmail === "true";
    email_template = card.dataset.emailTemplate || "";
    pay_link = card.dataset.payLink || "";
    price = card.dataset.price || "";
  }

  // -----------------------------
  // GENERATE EMAIL HTML FROM TEMPLATE
  // -----------------------------
  let email_html = "";
  if (send_email && email_template) {
    const tpl = document.getElementById(`email-template-${email_template}`);
    if (tpl) {
      email_html = tpl.innerHTML
        .replace(/{{name}}/g, name)
        .replace(/{{product}}/g, title)
        .replace(/{{price}}/g, price)
        .replace(/{{paylink}}/g, pay_link);
    }
  }

  try {
    const response = await fetch(
      "https://addonsaf.pythonanywhere.com/webhook",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "new_booking",
          product: title,
          name,
          phone,
          email,
          comment,
          send_email,
          email_html
        })
      }
    );

    const data = await response.json();

    if (data.status === "ok") {
      // очищаем форму
      this.reset();

      // закрываем форму записи
      closePricePopup();

      // показываем успешную модалку
      showSuccessModal();

      // редирект на оплату — только для платных продуктов
      if (pay_link && card && card.dataset.redirect === "true") {
        setTimeout(() => {
          window.location.href = pay_link;
        }, 700);
      }
    } else {
      status.innerHTML = '<span style="color:red;">Помилка. Спробуйте ще раз.</span>';
    }
  } catch (err) {
    console.error(err);
    status.innerHTML = '<span style="color:red;">Помилка з’єднання. Спробуйте ще раз.</span>';
  }
});

/* =========================================================
   PRICE POPUP
   ========================================================= */
function openPricePopup(e, title, price) {
  e.stopPropagation();

  // сохраняем карточку, из которой вызвали
  window.bookingCard = e.target.closest('.card');

  document.getElementById('priceTitle').textContent = title;
  document.getElementById('priceLabel').textContent = 'Вартість: ' + price;

  document.getElementById('bookingForm').reset();
  document.getElementById('popupStatus').innerHTML = '';
  resetFormHighlights();

  const popup = document.getElementById('pricePopup');
  popup.classList.add('active');
  popup.scrollTop = 0;

  // блокируем скролл страницы
  document.body.style.overflow = 'hidden';
}

function closePricePopup() {
  const popup = document.getElementById('pricePopup');

  popup.classList.remove('active');
  popup.scrollTop = 0;

  // возвращаем скролл
  document.body.style.overflow = '';

  resetFormHighlights();
  document.getElementById('popupStatus').innerHTML = '';
}

/* Закрытие кликом по фону */
document.getElementById('pricePopup')?.addEventListener('click', e => {
  if (e.target === document.getElementById('pricePopup')) {
    closePricePopup();
  }
});

/* ESC закрытие */
document.addEventListener('keydown', e => {
  const popup = document.getElementById('pricePopup');
  if (e.key === 'Escape' && popup.classList.contains('active')) {
    closePricePopup();
  }
});


/* =========================================================
   ПОДСВЕТКА ПОЛЕЙ ВВОДА
   ========================================================= */
document.querySelectorAll('#bookingForm input[required]').forEach(input => {
  const check = () => {
    const val = input.value.trim();
    let valid = false;

    if (input.name === 'name') {
      valid = val.length >= 2;
    } else if (input.id === 'phoneInput') {
      const digits = input.value.replace(/\D/g, '').length;
      valid = digits === 12;
    } else if (input.id === 'emailInput') {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = pattern.test(val);
    }

    input.style.borderColor = valid ? '#4caf50' : '#ddd';
    input.style.boxShadow = valid ? '0 0 12px rgba(76,175,80,0.3)' : 'none';
  };

  input.addEventListener('input', check);
  input.addEventListener('blur', check);
  check();
});

function resetFormHighlights() {
  document.querySelectorAll('#pricePopup input, #pricePopup textarea').forEach(input => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  });
}


/* =========================================================
   ПОДСВЕТКА ПОЛЕЙ ВВОДА (имя, телефон, email)
   ========================================================= */
document.querySelectorAll('#bookingForm input[required]').forEach(input => {
  const check = () => {
    const val = input.value.trim();

    let valid = false;

    if (input.name === 'name') {
      valid = val.length >= 2;
    }

    if (input.id === 'phoneInput') {
      valid = input.value.replace(/\D/g, '').length === 12;
    }

    if (input.id === 'emailInput') {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = pattern.test(val);
    }

    input.style.borderColor = valid ? '#4caf50' : '#ddd';
    input.style.boxShadow = valid ? '0 0 12px rgba(76,175,80,0.3)' : 'none';
  };

  input.addEventListener('input', check);
  input.addEventListener('blur', check);
  check();
});

function resetFormHighlights() {
  document.querySelectorAll('#pricePopup input, #pricePopup textarea').forEach(input => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  });
}


/* =========================================================
   FIX SCROLL RESTORE ON RELOAD
   ========================================================= */
(function fixScrollRestore() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      const headerHeight = document.querySelector('.topbar').offsetHeight;
      document.documentElement.style.scrollPaddingTop = headerHeight + 20 + 'px';

      if (window.scrollY > 0) {
        const correctY = window.scrollY + headerHeight + 20;
        window.scrollTo({
          top: correctY,
          behavior: 'instant'
        });
      }

      setTimeout(() => {
        const headerHeight2 = document.querySelector('.topbar').offsetHeight;
        document.documentElement.style.scrollPaddingTop = headerHeight2 + 20 + 'px';
      }, 150);
    }, 50);
  });

  window.addEventListener('resize', () => {
    const headerHeight = document.querySelector('.topbar').offsetHeight;
    document.documentElement.style.scrollPaddingTop = headerHeight + 20 + 'px';
  });
})();


/* ================== DIPLOMA MODAL (FINAL PREMIUM VERSION) ================== */

document.querySelectorAll('.about-card img').forEach(img => {
  img.addEventListener('click', () => openDiplomaModal(img.src));
});

function openDiplomaModal(src) {
  const modal = document.getElementById('diplomaModal');
  const modalImg = document.getElementById('diplomaModalImg');

  modalImg.src = src;
  modal.classList.add('active');

  // ===== FIX дергания страницы при исчезновении scrollbar =====
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = scrollBarWidth + "px";
  document.body.style.overflow = "hidden";
}

// Клик по фону или по картинке — закрыть
document.getElementById('diplomaModal').addEventListener('click', closeDiplomaModal);

// ESC закрывает
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDiplomaModal();
});

function closeDiplomaModal() {
  const modal = document.getElementById('diplomaModal');
  modal.classList.remove('active');

  // Даем время анимации исчезновения пройти,
  // после чего возвращаем scroll и убираем paddingRight
  setTimeout(() => {
    if (!modal.classList.contains('active')) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, 550); // === тайминг совпадает с CSS transition для плавного fade-out
}




/* ====================================================================
CLIENTS: scroll + auto-highlight + magnetic tilt + FPS BOOST
 ======================================================================== */
window.addEventListener('load', () => {
  const section = document.getElementById('clients');
  const track = document.getElementById('clientsTrack');
  if (!section || !track) return;

  /* Плавное появление */
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        section.classList.add('visible');
        o.unobserve(section);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(section);

  /* Дублирование */
  const logos = Array.from(track.children);
  logos.forEach(el => track.appendChild(el.cloneNode(true)));

  /* ===== FPS DETECTOR ===== */
  let fps = 60;
  (function detectFPS() {
    let last = performance.now();
    let frames = 0;

    function frame(now) {
      frames++;
      if (now - last >= 1000) {
        fps = frames;
        return; // фиксируем FPS, дальше код сам подстроится
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ===== Скорость с учётом FPS ===== */
  function computeSpeed() {
    if (fps < 30) return 0.25 * 1.9;   // супер слабое устройство
    if (fps < 45) return 0.25 * 1.5;   // слабый ноут
    if (fps < 55) return 0.25 * 1.2;   // обычный ноут
    return 0.25;                       // норм
  }

  function computeSlow() {
    if (fps < 30) return 0.07 * 1.9;
    if (fps < 45) return 0.07 * 1.5;
    if (fps < 55) return 0.07 * 1.2;
    return 0.07;
  }

  /* Первичная инициализация скоростей */
  let normalSpeed = window.innerWidth < 900 ? computeSpeed() * 1.8 : computeSpeed();
  let slowSpeed   = window.innerWidth < 900 ? computeSlow() * 1.8  : computeSlow();

  let pos = 0;
  let speed = normalSpeed;
  let targetSpeed = normalSpeed;

  const boxes = track.querySelectorAll('.logo-box');
  const imgs = track.querySelectorAll('.logo-box img');

  /* Hover fix */
  boxes.forEach(box => {
    box.addEventListener('mouseenter', () => box.classList.add('hovered'));
    box.addEventListener('mouseleave', () => box.classList.remove('hovered'));
  });

  /* AUTO-HIGHLIGHT */
  function applyAutoHighlight() {
    const center = window.innerWidth / 2;

    boxes.forEach((box, i) => {
      if (box.classList.contains('hovered')) return;

      const img = imgs[i];
      const rect = box.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;

      const dist = Math.abs(mid - center);
      const k = Math.max(0, 1 - dist / 500);

      const scale = 1 + k * 0.22;
      const opacity = 0.55 + k * 0.45;
      const gray = 1 - k;

      box.style.transform = `scale(${scale})`;
      img.style.opacity = opacity;
      img.style.filter = `grayscale(${gray})`;
    });
  }

  /* TILT */
  function applyTilt(e) {
    const mouseX = e.clientX;

    boxes.forEach((box, i) => {
      const img = imgs[i];

      if (box.classList.contains('hovered')) return;

      const rect = box.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      const diff = mouseX - centerX;
      const rotateY = Math.max(-12, Math.min(12, diff * -0.06));

      img.style.transform = `rotateY(${rotateY}deg)`;
    });
  }

  function resetTilt() {
    imgs.forEach(img => img.style.transform = "rotateY(0deg)");
  }

  track.addEventListener('mousemove', e => {
    if (window.innerWidth > 900) applyTilt(e);
  });
  track.addEventListener('mouseleave', resetTilt);

  /* ===== LOOP ===== */
  function loop() {
    pos -= speed;
    if (pos <= -track.scrollWidth / 2) pos = 0;

    track.style.transform = `translateX(${pos}px)`;
    speed += (targetSpeed - speed) * 0.05;

    applyAutoHighlight();

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* Hover замедление */
  track.addEventListener('mouseenter', () => {
    targetSpeed = slowSpeed;
  });
  track.addEventListener('mouseleave', () => {
    targetSpeed = normalSpeed;
  });

  /* Resize */
  window.addEventListener('resize', () => {
    normalSpeed = computeSpeed();
    slowSpeed = computeSlow();
    targetSpeed = normalSpeed;
  });

});

/* ===================== TESTIMONIALS — PERFECT SMOOTH SINGLE TRACK ===================== */
window.addEventListener('load', () => {

  const section = document.getElementById('testimonials');
  const track   = document.getElementById('testimonialsTrack');
  const wrapper = document.querySelector('.testimonials-wrapper');

  if (!section || !track) return;

  /* fade-up */
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        section.classList.add('visible');
        o.unobserve(section);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(section);

  /* ———————————————
     1) ФИКСИРУЕМ ШИРИНУ ТРЕКА НАВСЕГДА
     ——————————————— */
  const initialWidth = track.scrollWidth;
  track.style.width = initialWidth + "px";

  /* ———————————————
     2) ДЕЛАЕМ БЕССШОВНОЕ ДУБЛИРОВАНИЕ КОНТЕНТА
     ——————————————— */
  const cards = Array.from(track.children);
  cards.forEach(c => track.appendChild(c.cloneNode(true)));

  /* движение */
  let pos = 0;
  let speed = 0.35;
  let paused = false;

  let targetPos = 0;
  let smoothPos = 0;

  const half = initialWidth;   // фиксированная половина!

  /* ———————————————
     3) LOOP — БЕССШОВНЫЙ, ТЕПЕРЬ НЕ ПРЫГАЕТ НИКОГДА
     ——————————————— */
  function loop() {

    /* плавное движение */
    smoothPos += (targetPos - smoothPos) * 0.08;
    pos = smoothPos;

    track.style.transform = `translateX(${pos}px)`;

    if (!paused) {
      targetPos -= speed;
    }

    /* ПЕРЕХОД В НАЧАЛО — БЕЗ РЫВКА */
    if (pos <= -half) {
      targetPos += half;
      smoothPos += half;
      pos += half;
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ———————————————
     4) АВТО-ВЫРАВНИВАНИЕ ПРИ HOVER
     ——————————————— */
  function ensureCardInView(card) {
    const wrap = wrapper.getBoundingClientRect();
    const r = card.getBoundingClientRect();

    const leftOverflow  = wrap.left - r.left;
    const rightOverflow = r.right - wrap.right;

    if (leftOverflow > 0)  targetPos = pos + leftOverflow;
    if (rightOverflow > 0) targetPos = pos - rightOverflow;
  }

  track.querySelectorAll('.testimonial-card').forEach(card => {

    card.addEventListener("mouseenter", () => {
      paused = true;

      let active = true;
      function stabilize() {
        if (!active) return;
        ensureCardInView(card);
        requestAnimationFrame(stabilize);
      }
      stabilize();

      card.addEventListener("mouseleave", () => {
        active = false;
        paused = false;
      }, { once: true });

    });

  });

});

/* =========================================================
   FAQ FADE-UP
========================================================= */
const faq = document.querySelector('.faq-list.fade-up');
if (faq) {
  const faqObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        faq.classList.add('visible');
        observer.unobserve(faq);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: "0px 0px -10%"
  });

  faqObserver.observe(faq);
}


/* ===================== APPLE GALLERY — FULL VERSION ===================== */

window.addEventListener("load", () => {
  const track = document.querySelector(".apple-gallery-track");
  if (!track) return;

  const slides = [...document.querySelectorAll(".apple-slide")];
  const dotsContainer = document.querySelector(".apple-dots");

  let index = 0;
  let autoTimer;

  /* ---------- CREATE DOTS ---------- */
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "apple-dot";
    dot.onclick = () => {
      clearInterval(autoTimer);
      slideTo(i);
      autoStart();
    };
    dotsContainer.appendChild(dot);
  });
  const dots = [...dotsContainer.children];


  /* ---------- APPLY ACTIVE STATES ---------- */
  function updateUI() {
    slides.forEach((sl, i) => {
      sl.classList.remove("center", "side");
      sl.classList.add(i === index ? "center" : "side");
    });

    dots.forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }


  /* ---------- SLIDE TO INDEX ---------- */
  function slideTo(i, animate = true) {
  index = (i + slides.length) % slides.length;

  const slideWidth = slides[0].offsetWidth + 24; // твой gap 24px
  const viewportWidth = track.parentElement.offsetWidth;

  const currentSlide = slides[index];
  const currentWidth = currentSlide.offsetWidth;

  // чистый базовый сдвиг как раньше
  const baseOffset = -(slideWidth * index);

  // центрируем слайд
  const centerOffset = (viewportWidth - currentWidth) / 2;

  // ДОБАВЛЯЕМ СИММЕТРИЮ ОГРЫЗКОВ
  const symmetricalOffset = centerOffset - (24 / 2);
  // 24 = gap, таким образом даём одинаковый остаток слева и справа

  const finalOffset = baseOffset + symmetricalOffset;

  track.style.transition = animate
    ? "transform 0.9s cubic-bezier(.16,1,.3,1)"
    : "none";

  track.style.transform = `translateX(${finalOffset}px)`;

  updateUI();
}



  /* ---------- AUTO SLIDE ---------- */
  function autoStart() {
    autoTimer = setInterval(() => {
      slideTo(index + 1);
    }, 3500);
  }

  updateUI();
  slideTo(0);
  autoStart();


  /* ---------- DRAG CONTROL ---------- */
  let startX = 0;
  let current = 0;
  let dragging = false;

  function dragStart(e) {
    clearInterval(autoTimer);
    dragging = true;
    track.classList.add("dragging");

    startX = e.touches ? e.touches[0].clientX : e.clientX;
    current = new DOMMatrix(getComputedStyle(track).transform).m41;
  }

  function dragMove(e) {
    if (!dragging) return;

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = x - startX;
    track.style.transition = "none";
    track.style.transform = `translateX(${current + delta}px)`;
  }

  function dragEnd(e) {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("dragging");

    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = x - startX;

    if (Math.abs(diff) > 80) {
      slideTo(index + (diff < 0 ? 1 : -1));
    } else {
      slideTo(index);
    }

    autoStart();
  }

  track.addEventListener("mousedown", dragStart);
  window.addEventListener("mousemove", dragMove);
  window.addEventListener("mouseup", dragEnd);

  track.addEventListener("touchstart", dragStart, { passive: true });
  window.addEventListener("touchmove", dragMove, { passive: true });
  window.addEventListener("touchend", dragEnd);
});

/* ===================== EXIT-INTENT POPUP — FULL VERSION ===================== */

let exitShown = false;

function openExitPopup() {
  if (exitShown) return;
  exitShown = true;

  const popup = document.getElementById("exitPopup");
  popup.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeExitPopup() {
  const popup = document.getElementById("exitPopup");
  popup.classList.remove("active");
  document.body.style.overflow = "";
}

/* --- триггер — уход мыши вверх --- */
document.addEventListener("mouseleave", (e) => {
  if (e.clientY <= 0 && !exitShown) {
    openExitPopup();
  }
});

/* ===================== GREEN VALIDATION ===================== */
document.querySelectorAll('#exitForm input[required]').forEach(input => {
  const check = () => {
    const val = input.value.trim();
    let valid = false;

    if (input.name === 'name') valid = val.length >= 2;

    if (input.name === 'email') {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = pattern.test(val);
    }

    if (input.name === 'phone') {
      valid = input.value.replace(/\D/g, '').length === 12;
    }

    input.style.borderColor = valid ? '#4caf50' : '#ddd';
    input.style.boxShadow = valid ? '0 0 12px rgba(76,175,80,0.3)' : 'none';
  };

  input.addEventListener('input', check);
  input.addEventListener('blur', check);
  check();
});

/* ===================== EXIT FORM SEND ===================== */

document.getElementById("exitForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = this.name.value.trim();
  let phone = this.phone.value.replace(/\D/g, "");
  const email = this.email.value.trim();
  const status = document.getElementById("exitStatus");

  if (phone.startsWith("38")) phone = phone.slice(2);
  if (phone.length !== 10) {
    status.innerHTML = "<span style='color:red;'>Невірний номер телефону</span>";
    return;
  }
  phone = "+38" + phone;

  /* ==== СГЕНЕРИРОВАТЬ EMAIL ИЗ ШАБЛОНА ==== */
  const emailHtml = getEmailHtml("exit", {
    name: name,
    product: "Exit Popup Checklist",
  });

  status.innerHTML = "Відправляємо...";
  status.style.color = "#f7c843";

  try {
    const r = await fetch("https://addonsaf.pythonanywhere.com/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "new_booking",
        product: "Чек-лист Exit Popup",
        name: name,
        phone: phone,
        email: email,
        comment: "",
        send_email: true,
        email_html: emailHtml
      })
    });

    if (r.ok) {
      status.innerHTML = "";
      closeExitPopup();
      showSuccessModal();
      this.reset();
    } else {
      throw new Error();
    }
  } catch (err) {
    status.innerHTML = "<span style='color:red;'>Помилка. Спробуйте ще раз</span>";
  }
});

/* ===================== EXIT POPUP — PHONE MASK ===================== */

const exitPhone = document.getElementById('exitPhone');
if (exitPhone) {
  function formatExitPhone(d) {
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

  exitPhone.addEventListener('keydown', function(e) {
    const pos = this.selectionStart;
    if (e.key === 'Backspace') {
      const current = this.value;
      if (current[pos - 1] === ')' || current[pos - 1] === ' ') {
        e.preventDefault();
        const digits = current.replace(/\D/g, '').slice(0, -1);
        this.value = formatExitPhone(digits);
        this.setSelectionRange(this.value.length, this.value.length);
      }
    }
  });

  exitPhone.addEventListener('input', function() {
    let d = this.value.replace(/\D/g, '');
    if (d.startsWith('8') && d.length > 1) d = '3' + d;
    d = d.slice(0, 12);
    this.value = formatExitPhone(d);
    this.setSelectionRange(this.value.length, this.value.length);
  });

  exitPhone.addEventListener('focus', () => {
    if (!exitPhone.value) {
      exitPhone.value = '+38 ';
      exitPhone.setSelectionRange(exitPhone.value.length, exitPhone.value.length);
    }
  });

  exitPhone.addEventListener('blur', () => {
    if (exitPhone.value.replace(/\D/g, '').length <= 2) {
      exitPhone.value = '';
    }
  });
}


/* ===================== фак ===================== */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const answer = item.querySelector('.faq-answer');

  item.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // ---- 1) ЗАКРЫВАЕМ ВСЕ ДРУГИЕ ВОПРОСЫ ----
    faqItems.forEach(other => {
      if (other !== item && other.classList.contains('open')) {
        const otherAnswer = other.querySelector('.faq-answer');
        otherAnswer.style.height = otherAnswer.scrollHeight + "px";
        requestAnimationFrame(() => {
          otherAnswer.style.height = "0px";
        });
        other.classList.remove('open');
      }
    });

    // ---- 2) ЕСЛИ КЛИКНУЛИ ПО ОТКРЫТОМУ → ЗАКРЫВАЕМ ----
    if (isOpen) {
      answer.style.height = answer.scrollHeight + "px";
      requestAnimationFrame(() => {
        answer.style.height = "0px";
      });
      item.classList.remove('open');
      return;
    }

    // ---- 3) ОТКРЫВАЕМ НОВЫЙ ----
    answer.style.height = answer.scrollHeight + "px";
    item.classList.add('open');

    answer.addEventListener(
      "transitionend",
      () => {
        if (item.classList.contains("open")) {
          answer.style.height = "auto";
        }
      },
      { once: true }
    );
  });
});



 // ---- Подбор шаблона письма----
function getEmailHtml(templateName, config) {

  const tpl = document.getElementById(`email-template-${templateName}`);
  if (!tpl) return "";

  let html = tpl.innerHTML;

  // подмена переменных
  html = html.replace(/{{name}}/g, config.name || "");
  html = html.replace(/{{product}}/g, config.product || "");
  html = html.replace(/{{price}}/g, config.price || "");
  html = html.replace(/{{paylink}}/g, config.payLink || "");

  return html;
}

// HERO — появление при загрузке
window.addEventListener("load", () => {
  document.querySelector('#hero')?.classList.add('visible');
});

// HERO scroll disappear (progressive)
window.addEventListener("scroll", () => {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const limit = 260; // насколько нужно прокрутить, чтобы полностью исчезнуть
  const y = window.scrollY;

  // Прогрессивная анимация по скроллу
  const progress = Math.min(y / limit, 1);

  hero.style.opacity = 1 - progress;
  hero.style.transform = `translateY(${-progress * 80}px)`;

  // Когда полностью исчез — добавляем класс (убираем залипание)
  if (progress >= 1) {
    hero.classList.add("shrink");
  } else {
    hero.classList.remove("shrink");
  }
});
// HERO — появление при загрузке
window.addEventListener("load", () => {
  const hero = document.querySelector('#hero');

  if (hero) {
    // картинка fade-up (уже работает)
    hero.classList.add('visible');

    // текст — позже
    setTimeout(() => {
      hero.classList.add('text-visible');
    }, 300);
  }
});
