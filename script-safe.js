/* =========================================================
   SCRIPT.SAFE.JS — FULL SAFE MIGRATION
   Part 1/3
========================================================= */

/* ================= SAFE HELPERS ================= */
const $  = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

function on(el, event, handler, options) {
  if (!el) return;
  el.addEventListener(event, handler, options);
}
function onAll(els, event, handler, options) {
  if (!els || !els.length) return;
  els.forEach(el => el.addEventListener(event, handler, options));
}

/* ================= MENU ================= */
function toggleMenu() {
  const menu = $('#menu');
  const burger = $('.burger');
  const topbar = $('.topbar');
  if (!menu || !burger || !topbar) return;

  menu.classList.toggle('open');
  burger.classList.toggle('active');
  topbar.classList.toggle('open-menu');
}

function closeMenu() {
  const menu = $('#menu');
  const burger = $('.burger');
  const topbar = $('.topbar');
  if (!menu || !burger || !topbar) return;

  menu.classList.remove('open');
  burger.classList.remove('active');
  topbar.classList.remove('open-menu');
  document.body.style.overflow = '';
}

/* =========================================================
   APPLE-LIKE INITIAL LOAD ANIMATION (SAFE)
========================================================= */
window.addEventListener('load', () => {
  /* 1) HERO BLOCK (старый селектор header.fade-up — оставляем как было) */
  const heroHeader = $('header.fade-up');
  if (heroHeader) {
    setTimeout(() => heroHeader.classList.add('visible'), 200);
  }

  /* 2) ABOUT BLOCK */
  const aboutBlock = $('#about .about-wrapper');
  if (aboutBlock) {
    setTimeout(() => aboutBlock.classList.add('visible'), 700);
  }

  /* 3) INTRO FEATURES — stagger */
  const introCards = $$('#intro-features .mini-feature');
  if (introCards.length) {
    introCards.forEach((card, index) => {
      setTimeout(() => card.classList.add('visible'), 1600 + index * 180);
    });
  }
});

/* =========================================================
   SCROLL ANIMATIONS (HEADERS + CARDS) — SAFE
========================================================= */
(() => {
  const headers = $$('section .products-header:not(.no-scroll-trigger)');
  if (headers.length && 'IntersectionObserver' in window) {
    headers.forEach(header => {
      const obsH = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            header.classList.add('visible');
            observer.unobserve(header);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -5%" });

      obsH.observe(header);
    });
  }

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.card.scroll-animate');
          cards.forEach((card, index) => {
            setTimeout(() => card.classList.add('visible'), 450 + index * 200);
          });
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: "0px 0px -5%" });

    $$('section').forEach(sec => {
      if (sec.querySelector('.card.scroll-animate')) scrollObserver.observe(sec);
    });
  }
})();

/* =========================================================
   FOOTER SHOW IMMEDIATELY
========================================================= */
(() => {
  const footer = $('footer');
  if (footer) footer.classList.add('visible');
})();

/* =========================================================
   SCROLL TO TOP
========================================================= */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
on(window, 'scroll', () => {
  $('.scroll-top')?.classList.toggle('visible', window.scrollY > 300);
});

/* =========================================================
   FIX SCROLL RESTORE ON RELOAD (SAFE)
========================================================= */
(function fixScrollRestore() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      const topbar = $('.topbar');
      if (!topbar) return;

      const headerHeight = topbar.offsetHeight;
      document.documentElement.style.scrollPaddingTop = (headerHeight + 20) + 'px';

      if (window.scrollY > 0) {
        const correctY = window.scrollY + headerHeight + 20;
        window.scrollTo({ top: correctY, behavior: 'instant' });
      }

      setTimeout(() => {
        const topbar2 = $('.topbar');
        if (!topbar2) return;
        const headerHeight2 = topbar2.offsetHeight;
        document.documentElement.style.scrollPaddingTop = (headerHeight2 + 20) + 'px';
      }, 150);
    }, 50);
  });

  window.addEventListener('resize', () => {
    const topbar = $('.topbar');
    if (!topbar) return;
    const headerHeight = topbar.offsetHeight;
    document.documentElement.style.scrollPaddingTop = (headerHeight + 20) + 'px';
  });
})();

/* =========================================================
   HERO — появление при загрузке (SAFE) + scroll shrink (SAFE)
========================================================= */
window.addEventListener("load", () => {
  const hero = $('#hero');
  if (!hero) return;

  hero.classList.add('visible');

  setTimeout(() => {
    hero.classList.add('text-visible');
  }, 300);
});

window.addEventListener("scroll", () => {
  const hero = $("#hero");
  const topbar = $(".topbar");
  if (!hero || !topbar) return;

  const limit = 260;
  const y = window.scrollY;
  const progress = Math.min(y / limit, 1);

  hero.style.opacity = 1 - progress;
  hero.style.transform = `translateY(${-progress * 80}px)`;

  if (progress >= 1) {
    hero.classList.add("shrink");
    topbar.classList.add("scrolled");
  } else {
    hero.classList.remove("shrink");
    topbar.classList.remove("scrolled");
  }
});

/* =========================================================
   CONTACT MODAL — SAFE
========================================================= */
function openContactsModal() {
  const modal = $('#contactsModal');
  const content = modal?.querySelector('.contacts-modal-content');
  if (!modal || !content) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  content.style.animation = 'contactsSoftPop .55s cubic-bezier(.16,1,.3,1) forwards';
}

function closeContactsModal() {
  const modal = $('#contactsModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* Клик по фону — закрыть */
on($('#contactsModal'), 'click', e => {
  const modal = $('#contactsModal');
  if (modal && e.target === modal) closeContactsModal();
});

/* Клик внутри, но если не кнопка/не ссылка → закрываем */
on($('.contacts-modal-content'), 'click', e => {
  if (!e.target.closest('a') && !e.target.closest('button')) closeContactsModal();
});

/* ESC */
on(document, 'keydown', e => {
  const modal = $('#contactsModal');
  if (e.key === 'Escape' && modal?.classList.contains('active')) closeContactsModal();
});

/* =========================================================
   CARD MODAL — SAFE
========================================================= */
function openModal(card) {
  if (!card) return;

  let content = card.querySelector(".card-content")?.innerHTML;
  if (!content) return;

  content = content.replace(/style="display:none;"/g, "");
  content = content.replace('<div class="readmore">Читати далі →</div>', "");

  const modalContent = $("#modalContent");
  const modal = $("#cardModal");
  const modalCard = modal?.querySelector(".modal-card");
  if (!modalContent || !modal || !modalCard) return;

  modalContent.innerHTML = content;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  modalCard.scrollTop = 0;

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

/* Клик внутри карточки → закрыть (кроме ссылок/кнопок) */
on($('#cardModal .modal-card'), 'click', e => {
  if (!e.target.closest('button') && !e.target.closest('a')) closeModal();
});

function closeModal() {
  const modal = $("#cardModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

on(document, "keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* =========================================================
   CALENDLY MODAL — SAFE
========================================================= */
function openCalendly(e, url) {
  e?.stopPropagation?.();

  const iframe = $('#calendlyIframe');
  const modal = $('#calendlyModal');
  if (!iframe || !modal || !url) return;

  const clean = url + (url.includes('?') ? '&' : '?') +
    'hide_event_type_details=1&hide_gdpr_banner=1&hide_landing_page_details=1';

  iframe.src = clean;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCalendlyModal() {
  const modal = $('#calendlyModal');
  const iframe = $('#calendlyIframe');
  if (!modal || !iframe) return;

  modal.classList.remove('active');
  iframe.src = '';
  document.body.style.overflow = '';
}

on($('#calendlyModal'), 'click', e => {
  const modal = $('#calendlyModal');
  if (modal && e.target === modal) closeCalendlyModal();
});

on(document, 'keydown', e => {
  const modal = $('#calendlyModal');
  if (e.key === 'Escape' && modal?.classList.contains('active')) closeCalendlyModal();
});

/* =========================================================
   WAYFORPAY — SAFE (не меняем контракт вызова)
========================================================= */
function openWayForPay(button) {
  // раньше ты использовал global event — оставляем, но безопасно
  const ev = window.event;
  ev?.stopPropagation?.();

  const baseUrl = button?.getAttribute?.('data-url');
  if (!baseUrl) return;

  const returnUrl = encodeURIComponent(window.location.href);
  const finalUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}returnUrl=${returnUrl}`;
  window.location.href = finalUrl;
}

/* =========================================================
   OFFER MODAL — SAFE
========================================================= */
function openOfferModal() {
  const modal = $('#offerModal');
  const content = $('#offerContent');
  const offerBtn = $('.offer-button');
  if (!modal || !content) return;

  if (offerBtn) offerBtn.classList.add('active');

  if (content.innerHTML.trim() !== '') {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    activateOfferClickToClose();
    return;
  }

  // важное: на внутренних страницах путь должен быть абсолютный
  fetch('/offer.txt?t=' + Date.now())
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
  const modal = $('#offerModal');
  if (!modal) return;

  modal.onclick = function(e) {
    if (!e.target.closest('a') && !e.target.closest('button')) closeOfferModal();
  };
}

function closeOfferModal() {
  const offerBtn = $('.offer-button');
  const modal = $('#offerModal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
  modal.onclick = null;

  if (offerBtn) offerBtn.classList.remove('active');
}

/* offerObserver — SAFE */
(() => {
  if (!('IntersectionObserver' in window)) return;

  const offerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        offerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  $$('.offer-scroll').forEach(el => offerObserver.observe(el));
})();

/* =========================================================
   PAYMENT MODAL — SAFE
========================================================= */
function openPaymentModal() {
  const modal = $('#paymentModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
  const modal = $('#paymentModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

on($('#paymentModal'), 'click', e => {
  const modal = $('#paymentModal');
  if (modal && e.target === modal) closePaymentModal();
});

on(document, 'keydown', e => {
  const modal = $('#paymentModal');
  if (e.key === 'Escape' && modal?.classList.contains('active')) closePaymentModal();
});

on($('.payment-modal-content'), 'click', e => {
  if (!e.target.closest('button') && !e.target.closest('a')) closePaymentModal();
});

/* =========================================================
   PHONE MASK — SAFE (EXCEPT BOOKING)
========================================================= */
(() => {
  const phoneInput = $('#phoneInput');
  if (!phoneInput) return;

  // ❌ если телефон внутри booking — выходим
  if (phoneInput.closest('#bookingModal')) return;

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

  on(phoneInput, 'keydown', function (e) {
    if (e.key === 'Backspace') {
      const pos = this.selectionStart;
      const current = this.value;

      if (current[pos - 1] === ')' || current[pos - 1] === ' ') {
        e.preventDefault();
        const digits = current.replace(/\D/g, '').slice(0, -1);
        this.value = formatPhone(digits);
        this.setSelectionRange(this.value.length, this.value.length);
      } else if (current === '+38 ' || current === '+38') {
        e.preventDefault();
        this.value = '';
      }
    }
  });

  on(phoneInput, 'input', function () {
    let d = this.value.replace(/\D/g, '');
    if (d.startsWith('8') && d.length > 1) d = '3' + d;
    d = d.slice(0, 12);
    this.value = formatPhone(d);
    this.setSelectionRange(this.value.length, this.value.length);
  });

  on(phoneInput, 'focus', () => {
    if (!phoneInput.value) {
      phoneInput.value = '+38 ';
      phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
    }
  });

  on(phoneInput, 'blur', () => {
    if (phoneInput.value.replace(/\D/g, '').length <= 2)
      phoneInput.value = '';
  });
})();


/* =========================================================
   SUCCESS MODAL + CONFETTI — SAFE
========================================================= */
function showSuccessModal() {
  const modal = $('#successModal');
  if (!modal) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // confetti может быть не подключен на некоторых страницах
  if (typeof confetti === 'function') {
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
      const canvas = $('canvas');
      if (canvas) {
        canvas.style.zIndex = '99999';
        canvas.style.position = 'fixed';
      }
    }, 100);
  }
}

function closeSuccessModal() {
  const modal = $('#successModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* SUCCESS — CLICK HANDLERS — SAFE */
on($('#successModal'), 'click', e => {
  const modal = $('#successModal');
  if (!modal) return;
  if (e.target === modal) closeSuccessModal();
});

on($('#successModal .popup-content'), 'click', e => {
  if (!e.target.closest('a') && !e.target.closest('button')) closeSuccessModal();
});

on(document, 'keydown', e => {
  const modal = $('#successModal');
  if (e.key === 'Escape' && modal?.classList.contains('active')) closeSuccessModal();
});

/* =========================================================
   PRICE POPUP — SAFE
========================================================= */
function resetFormHighlights() {
  $$('#pricePopup input, #pricePopup textarea').forEach(input => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  });
}

function openPricePopup(e, title, price) {
  e?.stopPropagation?.();

  const popup = $('#pricePopup');
  const form = $('#bookingForm');
  const phone = $('#phoneInput');
  const status = $('#popupStatus');
  const priceTitle = $('#priceTitle');
  const priceLabel = $('#priceLabel');

  if (!popup || !form || !status || !priceTitle || !priceLabel) return;

  // сохраняем карточку, из которой вызвали
  window.bookingCard =
  e?.target?.closest?.('.card') ||
  e?.target?.closest?.('[data-send-email]') ||
  null;


  priceTitle.textContent = title || '';
  priceLabel.textContent = 'Вартість: ' + (price || '');

  form.reset();
  if (phone) phone.value = '';
  status.innerHTML = '';

  resetFormHighlights();

  popup.classList.add('active');
  popup.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closePricePopup() {
  const popup = $('#pricePopup');
  const status = $('#popupStatus');
  if (!popup) return;

  popup.classList.remove('active');
  popup.scrollTop = 0;
  document.body.style.overflow = '';

  resetFormHighlights();
  if (status) status.innerHTML = '';
}

on($('#pricePopup'), 'click', e => {
  const popup = $('#pricePopup');
  if (popup && e.target === popup) closePricePopup();
});

on(document, 'keydown', e => {
  const popup = $('#pricePopup');
  if (e.key === 'Escape' && popup?.classList.contains('active')) closePricePopup();
});

/* =========================================================
   FORM SEND — SAFE
========================================================= */
on($('#bookingForm'), 'submit', async function(e) {
  e.preventDefault();

  const titleEl = $('#priceTitle');
  const phoneEl = $('#phoneInput');
  const emailEl = $('#emailInput');
  const status = $('#popupStatus');

  if (!titleEl || !phoneEl || !emailEl || !status) return;

  const title = titleEl.textContent;
  const name = this.querySelector('input[name="name"]')?.value?.trim?.() || '';
  let phone = phoneEl.value.trim();
  const email = emailEl.value.trim();
  const comment = this.querySelector('textarea[name="comment"]')?.value?.trim?.() || '';

  status.innerHTML = "";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    status.innerHTML = '<span style="color:red;">Введіть коректний email!</span>';
    return;
  }

  if (!phone.startsWith("+38")) {
    phone = "+38" + phone.replace(/\D/g, '');
  }

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

  let email_html = "";
  if (send_email && email_template) {
    const tpl = $(`#email-template-${email_template}`);
    if (tpl) {
      email_html = tpl.innerHTML
        .replace(/{{name}}/g, name)
        .replace(/{{product}}/g, title)
        .replace(/{{price}}/g, price)
        .replace(/{{paylink}}/g, pay_link);
    }
  }

  try {
    const response = await fetch("https://booking-backend-riod.onrender.com/webhook", {
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
    });

    const data = await response.json();

    if (data.status === "ok") {
      this.reset();
      closePricePopup();
      showSuccessModal();

      if (pay_link && card && card.dataset.redirect === "true") {
        setTimeout(() => { window.location.href = pay_link; }, 700);
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
   GREEN VALIDATION — SAFE (EXCEPT BOOKING)
========================================================= */
(() => {
  const form = $('#bookingForm');

  // ❌ если это booking — выходим
  if (form && form.closest('#bookingModal')) return;

  if (!form) return;

  const inputs = $$('input[required]', form);
  if (!inputs.length) return;

  inputs.forEach(input => {
    const check = () => {
      const val = input.value.trim();
      let valid = false;

      if (input.name === 'name') valid = val.length >= 2;
      if (input.id === 'phoneInput')
        valid = input.value.replace(/\D/g, '').length === 12;

      if (input.id === 'emailInput') {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = pattern.test(val);
      }

      input.style.borderColor = valid ? '#4caf50' : '#ddd';
      input.style.boxShadow = valid
        ? '0 0 12px rgba(76,175,80,0.3)'
        : 'none';
    };

    on(input, 'input', check);
    on(input, 'blur', check);
    check();
  });
})();


/* ================== DIPLOMA MODAL (SAFE) ================== */
(() => {
  const imgs = $$('.about-card img');
  if (!imgs.length) return;

  imgs.forEach(img => {
    on(img, 'click', () => openDiplomaModal(img.src));
  });
})();

function openDiplomaModal(src) {
  const modal = $('#diplomaModal');
  const modalImg = $('#diplomaModalImg');
  if (!modal || !modalImg) return;

  modalImg.src = src;
  modal.classList.add('active');

  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = scrollBarWidth + "px";
  document.body.style.overflow = "hidden";
}

function closeDiplomaModal() {
  const modal = $('#diplomaModal');
  if (!modal) return;

  modal.classList.remove('active');

  setTimeout(() => {
    if (!modal.classList.contains('active')) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, 550);
}

on($('#diplomaModal'), 'click', closeDiplomaModal);
on(document, 'keydown', e => { if (e.key === 'Escape') closeDiplomaModal(); });

/* =========================================================
   CLIENTS: scroll + auto-highlight + magnetic tilt + FPS BOOST — SAFE
========================================================= */
window.addEventListener('load', () => {
  const section = $('#clients');
  const track = $('#clientsTrack');
  if (!section || !track) return;

  /* Плавное появление */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          section.classList.add('visible');
          o.unobserve(section);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(section);
  }

  /* Дублирование */
  const logos = Array.from(track.children);
  logos.forEach(el => track.appendChild(el.cloneNode(true)));

  /* FPS DETECTOR */
  let fps = 60;
  (function detectFPS() {
    let last = performance.now();
    let frames = 0;
    function frame(now) {
      frames++;
      if (now - last >= 1000) {
        fps = frames;
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  function computeSpeed() {
    if (fps < 30) return 0.25 * 1.9;
    if (fps < 45) return 0.25 * 1.5;
    if (fps < 55) return 0.25 * 1.2;
    return 0.25;
  }

  function computeSlow() {
    if (fps < 30) return 0.07 * 1.9;
    if (fps < 45) return 0.07 * 1.5;
    if (fps < 55) return 0.07 * 1.2;
    return 0.07;
  }

  let normalSpeed = window.innerWidth < 900 ? computeSpeed() * 1.8 : computeSpeed();
  let slowSpeed   = window.innerWidth < 900 ? computeSlow() * 1.8  : computeSlow();

  let pos = 0;
  let speed = normalSpeed;
  let targetSpeed = normalSpeed;

  const boxes = track.querySelectorAll('.logo-box');
  const imgs = track.querySelectorAll('.logo-box img');

  /* Hover fix */
  boxes.forEach(box => {
    on(box, 'mouseenter', () => box.classList.add('hovered'));
    on(box, 'mouseleave', () => box.classList.remove('hovered'));
  });

  function applyAutoHighlight() {
    const center = window.innerWidth / 2;

    boxes.forEach((box, i) => {
      if (box.classList.contains('hovered')) return;

      const img = imgs[i];
      if (!img) return;

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

  function applyTilt(e) {
    const mouseX = e.clientX;

    boxes.forEach((box, i) => {
      const img = imgs[i];
      if (!img) return;
      if (box.classList.contains('hovered')) return;

      const rect = box.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      const diff = mouseX - centerX;
      const rotateY = Math.max(-12, Math.min(12, diff * -0.06));
      img.style.transform = `rotateY(${rotateY}deg)`;
    });
  }

  function resetTilt() {
    imgs.forEach(img => { if (img) img.style.transform = "rotateY(0deg)"; });
  }

  on(track, 'mousemove', e => {
    if (window.innerWidth > 900) applyTilt(e);
  });
  on(track, 'mouseleave', resetTilt);

  function loop() {
    pos -= speed;
    if (pos <= -track.scrollWidth / 2) pos = 0;

    track.style.transform = `translateX(${pos}px)`;
    speed += (targetSpeed - speed) * 0.05;

    applyAutoHighlight();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  on(track, 'mouseenter', () => { targetSpeed = slowSpeed; });
  on(track, 'mouseleave', () => { targetSpeed = normalSpeed; });

  on(window, 'resize', () => {
    normalSpeed = computeSpeed();
    slowSpeed = computeSlow();
    targetSpeed = normalSpeed;
  });
});

/* =========================================================
   TESTIMONIALS — PERFECT SMOOTH SINGLE TRACK (SAFE)
========================================================= */
window.addEventListener('load', () => {
  const section = $('#testimonials');
  const track   = $('#testimonialsTrack');
  const wrapper = $('.testimonials-wrapper');

  if (!section || !track) return;

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          section.classList.add('visible');
          o.unobserve(section);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(section);
  }

  const initialWidth = track.scrollWidth;
  track.style.width = initialWidth + "px";

  const cards = Array.from(track.children);
  cards.forEach(c => track.appendChild(c.cloneNode(true)));

  let pos = 0;
  let speed = 0.35;
  let paused = false;

  let targetPos = 0;
  let smoothPos = 0;

  const half = initialWidth;

  function loop() {
    smoothPos += (targetPos - smoothPos) * 0.08;
    pos = smoothPos;

    track.style.transform = `translateX(${pos}px)`;

    if (!paused) targetPos -= speed;

    if (pos <= -half) {
      targetPos += half;
      smoothPos += half;
      pos += half;
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  if (!wrapper) return;

  function ensureCardInView(card) {
    const wrap = wrapper.getBoundingClientRect();
    const r = card.getBoundingClientRect();

    const leftOverflow  = wrap.left - r.left;
    const rightOverflow = r.right - wrap.right;

    if (leftOverflow > 0)  targetPos = pos + leftOverflow;
    if (rightOverflow > 0) targetPos = pos - rightOverflow;
  }

  track.querySelectorAll('.testimonial-card').forEach(card => {
    on(card, "mouseenter", () => {
      paused = true;

      let active = true;
      function stabilize() {
        if (!active) return;
        ensureCardInView(card);
        requestAnimationFrame(stabilize);
      }
      stabilize();

      on(card, "mouseleave", () => {
        active = false;
        paused = false;
      }, { once: true });
    });
  });
});

/* =========================================================
   FAQ FADE-UP — SAFE
========================================================= */
(() => {
  const faq = $('.faq-list.fade-up');
  if (!faq || !('IntersectionObserver' in window)) return;

  const faqObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        faq.classList.add('visible');
        observer.unobserve(faq);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -10%" });

  faqObserver.observe(faq);
})();

/* =========================================================
   APPLE GALLERY — FULL VERSION (drag) — SAFE
========================================================= */
window.addEventListener("load", () => {
  const track = $(".apple-gallery-track");
  const dotsContainer = $(".apple-dots");
  if (!track || !dotsContainer) return;

  const slides = [...$$(".apple-slide")];
  if (!slides.length) return;

  let index = 0;
  let autoTimer;

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

  function updateUI() {
    slides.forEach((sl, i) => {
      sl.classList.remove("center", "side");
      sl.classList.add(i === index ? "center" : "side");
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function slideTo(i, animate = true) {
    index = (i + slides.length) % slides.length;

    const slideWidth = slides[0].offsetWidth + 24;
    const viewportWidth = track.parentElement.offsetWidth;
    const currentWidth = slides[index].offsetWidth;

    const baseOffset = -(slideWidth * index);
    const centerOffset = (viewportWidth - currentWidth) / 2;
    const symmetricalOffset = centerOffset - (24 / 2);
    const finalOffset = baseOffset + symmetricalOffset;

    track.style.transition = animate
      ? "transform 0.9s cubic-bezier(.16,1,.3,1)"
      : "none";

    track.style.transform = `translateX(${finalOffset}px)`;
    updateUI();
  }

  function autoStart() {
    autoTimer = setInterval(() => slideTo(index + 1), 3500);
  }

  updateUI();
  slideTo(0);
  autoStart();

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

  on(track, "mousedown", dragStart);
  on(window, "mousemove", dragMove);
  on(window, "mouseup", dragEnd);

  on(track, "touchstart", dragStart, { passive: true });
  on(window, "touchmove", dragMove, { passive: true });
  on(window, "touchend", dragEnd);
});

/* =========================================================
   EXIT-INTENT POPUP — SAFE
========================================================= */
let exitShown = false;

function openExitPopup() {
  if (exitShown) return;
  const popup = $("#exitPopup");
  if (!popup) return;

  exitShown = true;
  popup.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeExitPopup() {
  const popup = $("#exitPopup");
  if (!popup) return;

  popup.classList.remove("active");
  document.body.style.overflow = "";
}

/* trigger leave (если popup реально есть) */
on(document, "mouseleave", (e) => {
  if (e.clientY <= 0 && !exitShown && $("#exitPopup")) openExitPopup();
});

/* EXIT FORM GREEN VALIDATION — SAFE */
(() => {
  const form = $('#exitForm');
  if (!form) return;

  const inputs = $$('input[required]', form);
  inputs.forEach(input => {
    const check = () => {
      const val = input.value.trim();
      let valid = false;

      if (input.name === 'name') valid = val.length >= 2;
      if (input.name === 'email') {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = pattern.test(val);
      }
      if (input.name === 'phone') valid = input.value.replace(/\D/g, '').length === 12;

      input.style.borderColor = valid ? '#4caf50' : '#ddd';
      input.style.boxShadow = valid ? '0 0 12px rgba(76,175,80,0.3)' : 'none';
    };

    on(input, 'input', check);
    on(input, 'blur', check);
    check();
  });
})();

/* helper for email templates — SAFE */
function getEmailHtml(templateName, config) {
  const tpl = $(`#email-template-${templateName}`);
  if (!tpl) return "";

  let html = tpl.innerHTML;
  html = html.replace(/{{name}}/g, config.name || "");
  html = html.replace(/{{product}}/g, config.product || "");
  html = html.replace(/{{price}}/g, config.price || "");
  html = html.replace(/{{paylink}}/g, config.payLink || "");
  return html;
}

/* EXIT FORM SEND — SAFE */
on($("#exitForm"), "submit", async function(e) {
  e.preventDefault();

  const status = $("#exitStatus");
  if (!status) return;

  const name = this.name?.value?.trim?.() || "";
  let phone = (this.phone?.value || "").replace(/\D/g, "");
  const email = this.email?.value?.trim?.() || "";

  if (phone.startsWith("38")) phone = phone.slice(2);
  if (phone.length !== 10) {
    status.innerHTML = "<span style='color:red;'>Невірний номер телефону</span>";
    return;
  }
  phone = "+38" + phone;

  const emailHtml = getEmailHtml("exit", { name, product: "Exit Popup Checklist" });

  status.innerHTML = "Відправляємо...";
  status.style.color = "#f7c843";

  try {
    const r = await fetch("https://booking-backend-riod.onrender.com/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "new_booking",
        product: "Чек-лист Exit Popup",
        name,
        phone,
        email,
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

/* EXIT POPUP — PHONE MASK — SAFE */
(() => {
  const exitPhone = $('#exitPhone');
  if (!exitPhone) return;

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

  on(exitPhone, 'keydown', function(e) {
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

  on(exitPhone, 'input', function() {
    let d = this.value.replace(/\D/g, '');
    if (d.startsWith('8') && d.length > 1) d = '3' + d;
    d = d.slice(0, 12);
    this.value = formatExitPhone(d);
    this.setSelectionRange(this.value.length, this.value.length);
  });

  on(exitPhone, 'focus', () => {
    if (!exitPhone.value) {
      exitPhone.value = '+38 ';
      exitPhone.setSelectionRange(exitPhone.value.length, exitPhone.value.length);
    }
  });

  on(exitPhone, 'blur', () => {
    if (exitPhone.value.replace(/\D/g, '').length <= 2) exitPhone.value = '';
  });
})();

/* EXIT POPUP CLOSE — SAFE */
on(document, 'click', e => {
  if (e.target.closest('#exitPopup .modal-x')) closeExitPopup();
});
on($('#exitPopup'), 'click', e => {
  if (e.target?.id === 'exitPopup') closeExitPopup();
});
on(document, 'keydown', e => {
  if (e.key === 'Escape') closeExitPopup();
});

/* ===================== фак (accordion) — SAFE ===================== */
(() => {
  const faqItems = $$('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;

    on(item, 'click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          const otherAnswer = other.querySelector('.faq-answer');
          if (!otherAnswer) return;
          otherAnswer.style.height = otherAnswer.scrollHeight + "px";
          requestAnimationFrame(() => { otherAnswer.style.height = "0px"; });
          other.classList.remove('open');
        }
      });

      if (isOpen) {
        answer.style.height = answer.scrollHeight + "px";
        requestAnimationFrame(() => { answer.style.height = "0px"; });
        item.classList.remove('open');
        return;
      }

      answer.style.height = answer.scrollHeight + "px";
      item.classList.add('open');

      answer.addEventListener("transitionend", () => {
        if (item.classList.contains("open")) answer.style.height = "auto";
      }, { once: true });
    });
  });
})();

// ================================
// BOOKING MODAL (GLOBAL)
// ================================

function openBookingModal(product, price) {
  const modal = document.getElementById("bookingModal");
  const container = document.getElementById("bookingContainer");

  if (!modal || !container) {
    console.error("bookingModal or bookingContainer not found");
    return;
  }

  // 🔑 НАХОДИМ КАРТОЧКУ, С КОТОРОЙ КЛИКНУЛИ
  const card = event?.target?.closest(".card");

  // 🔑 БЕРЁМ PAY LINK ИЗ data-АТРИБУТА
  const payLink = card?.dataset?.payLink || "";

  // закрываем pricePopup, если есть
  if (typeof closePricePopup === "function") {
    closePricePopup();
  }

  // сохраняем данные продукта (ГЛОБАЛЬНО)
  window.bookingProduct = product;
  window.bookingPrice = price;
  window.bookingPayLink = payLink; // 🔥 ВОТ ЧЕГО НЕ ХВАТАЛО

  console.log("[BOOKING]", {
    product,
    price,
    payLink
  });

  // показываем модалку сразу (UX)
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // если уже загружено — просто инициализируем
  if (container.dataset.loaded === "true") {
    requestAnimationFrame(() => {
      window.initBookingApp?.();
    });
    return;
  }

  // первый запуск — грузим HTML
  fetch("/booking/booking.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load booking.html");
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;
      container.dataset.loaded = "true";

      // 🔥 КРИТИЧНО: ждём следующий кадр
      requestAnimationFrame(() => {
        window.initBookingApp?.();
      });
    })
    .catch(err => {
      console.error("Booking HTML load error:", err);
      container.innerHTML =
        "<p style='padding:20px;text-align:center'>Помилка завантаження календаря</p>";
    });
}


function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = "";
}


