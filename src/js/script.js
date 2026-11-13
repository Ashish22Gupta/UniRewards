const App = {
  state: {
    user: { name: 'John Doe', points: 500 },
    stickers: 2,
    stickersTotal: 5,
    challengesDone: 3,
    kycSubmitted: localStorage.getItem('kycSubmitted') === 'true'
  },

  init() {
    this.initToast();
    this.initNav();
    this.initSmoothScroll();
    this.initBackToTop();
    this.initMultiStepForm();
    this.initOTPInputs();
    this.initQuizOptions();
    this.initModals();
    this.initSidebar();
    this.initUploadZones();
    this.initScratchCards();
    this.initClaimButtons();
    this.initJoinChallenge();
    this.initStickerCollect();
    this.initForms();
    this.initTimers();
    this.initGSAP();
    this.initKeyboardShortcuts();
    this.initLazyImages();
    this.initLogout();
    this.restoreKYCState();
  },

  initToast() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    window.showToast = (message, type = 'info', duration = 3500, customIcon = null) => {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
      };
      const colors = {
        success: '#79B619',
        error: '#b31602',
        warning: '#EAA221',
        info: '#001E82'
      };

      const iconName  = customIcon || icons[type] || icons.info;
      const iconColor = colors[type] || colors.info;

      toast.innerHTML = `
        <span class="material-symbols-outlined icon-md" style="color:${iconColor}">${iconName}</span>
        <span style="flex:1">${message}</span>
      `;
      container.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    };
  },

  initNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('hidden');
        this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      });
    }
    const nav = document.getElementById('mainNav');
    if (nav) {
      const onScroll = () => {
        if (window.pageYOffset > 30) {
          nav.classList.add('scrolled', 'shadow-lg');
          nav.classList.remove('shadow-md');
        } else {
          nav.classList.remove('scrolled', 'shadow-lg');
          nav.classList.add('shadow-md');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  },

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      if (anchor.getAttribute('href') === '#') return;

      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const nav = document.getElementById('mainNav')
                  || document.querySelector('nav.sticky')
                  || document.querySelector('header');
        const navHeight = nav ? nav.offsetHeight : 0;
        const extraOffset = 20;
        const targetY = target.getBoundingClientRect().top + window.pageYOffset - navHeight - extraOffset;

        window.scrollTo({ top: targetY, behavior: 'smooth' });

        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          document.getElementById('hamburger')?.click();
        }

        target.classList.add('scroll-highlight');
        setTimeout(() => target.classList.remove('scroll-highlight'), 900);

        history.pushState(null, '', href);
      });
    });
  },

  initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.pageYOffset > 300);
    }, { passive: true });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  initMultiStepForm() {
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progressSteps = document.querySelectorAll('.progress-step');
    if (steps.length === 0) return;

    let currentStep = 0;

    const updateSteps = (stepIndex) => {
      steps.forEach((step, i) => {
        step.classList.toggle('hidden', i !== stepIndex);
        step.classList.toggle('active', i === stepIndex);
      });
      progressSteps.forEach((step, i) => {
        const fill = step.querySelector('.progress-fill') || step.querySelector('.h-full');
        if (fill) fill.style.width = i <= stepIndex ? '100%' : '0%';
        step.classList.toggle('active', i <= stepIndex);
      });
      const label = document.querySelector('.progress-header .text-xs');
      if (label) label.textContent = `Step ${stepIndex + 1} of ${steps.length}`;
      if (window.gsap) {
        gsap.fromTo(steps[stepIndex],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    };

    nextBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const parentStep = this.closest('.form-step');
        const stepIndex = parseInt(parentStep.dataset.step) - 1;
        const requiredFields = parentStep.querySelectorAll('input[required], select[required]');
        let valid = true;
        requiredFields.forEach(input => {
          if (!input.value || (input.type === 'checkbox' && !input.checked)) {
            input.classList.add('border-red-500', 'shake');
            setTimeout(() => input.classList.remove('shake'), 400);
            valid = false;
          } else {
            input.classList.remove('border-red-500');
          }
        });
        if (!valid) {
          showToast('Please fill all required fields.', 'error');
          return;
        }
        if (stepIndex < steps.length - 1) {
          currentStep = stepIndex + 1;
          updateSteps(currentStep);
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const parentStep = this.closest('.form-step');
        const stepIndex = parseInt(parentStep.dataset.step) - 1;
        if (stepIndex > 0) {
          currentStep = stepIndex - 1;
          updateSteps(currentStep);
        }
      });
    });
  },

  initOTPInputs() {
    document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
          inputs[index - 1].focus();
        }
      });
      input.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
      });
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, inputs.length);
        data.split('').forEach((char, i) => {
          if (inputs[i]) {
            inputs[i].value = char;
            inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
        inputs[Math.min(data.length, inputs.length - 1)].focus();
      });
    });
  },

  initQuizOptions() {
    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', function () {
        const checkbox = this.querySelector('.interest-checkbox');
        const radio = this.querySelector('input[type="radio"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          this.classList.toggle('border-[#001E82]', checkbox.checked);
          this.classList.toggle('bg-[#001E82]/5', checkbox.checked);
          this.classList.toggle('border-gray-200', !checkbox.checked);
        }
        if (radio) {
          radio.checked = true;
          const siblings = this.parentElement.querySelectorAll('.quiz-option');
          siblings.forEach(s => {
            s.classList.remove('bg-[#001E82]/5', 'border-[#001E82]');
            s.classList.add('border-gray-200');
          });
          this.classList.add('bg-[#001E82]/5', 'border-[#001E82]');
          this.classList.remove('border-gray-200');
        }
      });
    });
  },

  initModals() {
    window.openModal = (id) => {
      const modal = document.getElementById(id);
      if (!modal) return;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };
    window.closeModal = (id) => {
      const modal = document.getElementById(id);
      if (!modal) return;
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', function (e) {
        if (e.target === this) {
          this.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
    });
    document.addEventListener('click', (e) => {
      const closer = e.target.closest('[data-close]');
      if (closer) {
        const id = closer.getAttribute('data-close');
        if (id) window.closeModal(id);
      }
    });
  },

  initSidebar() {
    window.openSidebar = () => {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.remove('-translate-x-full');
      if (overlay) overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };
    window.closeSidebar = () => {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.add('-translate-x-full');
      if (overlay) overlay.classList.add('hidden');
      document.body.style.overflow = '';
    };
    document.getElementById('sidebarToggle')?.addEventListener('click', openSidebar);
    document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);
    document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);
  },

  initUploadZones() {
    document.querySelectorAll('.upload-zone').forEach(zone => {
      const input = zone.querySelector('input[type="file"]');
      const fileName = zone.querySelector('.file-name');
      if (!input) return;

      zone.addEventListener('click', (e) => {
        if (!e.target.closest('.remove-file')) input.click();
      });
      ['dragover', 'dragenter'].forEach(evt => {
        zone.addEventListener(evt, (e) => {
          e.preventDefault();
          zone.classList.add('drag-over');
        });
      });
      ['dragleave', 'drop'].forEach(evt => {
        zone.addEventListener(evt, (e) => {
          e.preventDefault();
          zone.classList.remove('drag-over');
        });
      });
      zone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length && input) {
          input.files = files;
          this.handleFileValidation(input, fileName, zone);
        }
      });
      input.addEventListener('change', () => this.handleFileValidation(input, fileName, zone));
    });
  },

  handleFileValidation(input, fileNameEl, zone) {
    if (!input.files || !input.files.length) return;
    const file = input.files[0];
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowed.includes(file.type)) {
      showToast('Only JPG, PNG, or PDF files allowed.', 'error');
      input.value = '';
      return;
    }
    if (file.size > maxSize) {
      showToast('File size must be under 5MB.', 'error');
      input.value = '';
      return;
    }
    if (fileNameEl) {
      fileNameEl.textContent = `✓ ${file.name}`;
      fileNameEl.classList.remove('hidden');
    }
    zone.classList.add('border-green-500', 'bg-green-500');
    zone.classList.remove('border-gray-300');
    showToast('File uploaded successfully', 'success', 2000);
  },

  initScratchCards() {
    document.querySelectorAll('.scratch-card').forEach(card => {
      if (card.dataset.bound === 'true') return;
      card.dataset.bound = 'true';

      const canvas = card.querySelector('.scratch-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const label = canvas.dataset.label || 'Scratch';
      let isDrawing = false;
      let revealed = false;
      let lastPt = null;

      const resize = () => {
        const rect = card.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawCover();
      };

      const drawCover = () => {
        const w = canvas.width;
        const h = canvas.height;

        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#9ca3af');
        grad.addColorStop(0.5, '#6b7280');
        grad.addColorStop(1, '#4b5563');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 12;
        for (let i = -h; i < w + h; i += 24) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + h, h);
          ctx.stroke();
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '22px "Material Symbols Outlined"';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText('front_hand', w / 2, h / 2 - 12);
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText(label, w / 2, h / 2 + 14);
        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fillText('Scratch here', w / 2, h / 2 + 30);
      };

      resize();

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (!revealed) drawCover();
        });
      }

      const getPoint = (e) => {
        const rect = canvas.getBoundingClientRect();
        const src = e.touches ? e.touches[0] : e;
        return {
          x: (src.clientX - rect.left) * (canvas.width / rect.width),
          y: (src.clientY - rect.top) * (canvas.height / rect.height)
        };
      };

      const scratch = (pt) => {
        ctx.globalCompositeOperation = 'destination-out';

        const radius = 22;
        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);
        grd.addColorStop(0, 'rgba(0,0,0,1)');
        grd.addColorStop(0.7, 'rgba(0,0,0,0.85)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (lastPt) {
          const dist = Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y);
          const steps = Math.max(1, Math.floor(dist / 8));
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = lastPt.x + (pt.x - lastPt.x) * t;
            const y = lastPt.y + (pt.y - lastPt.y) * t;
            const g2 = ctx.createRadialGradient(x, y, 0, x, y, radius);
            g2.addColorStop(0, 'rgba(0,0,0,1)');
            g2.addColorStop(0.7, 'rgba(0,0,0,0.85)');
            g2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g2;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        lastPt = pt;
      };

      const checkProgress = () => {
        if (revealed) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let cleared = 0;
        for (let i = 3; i < imageData.length; i += 4) {
          if (imageData[i] < 128) cleared++;
        }
        const pct = cleared / (imageData.length / 4);
        if (pct > 0.55) {
          revealed = true;
          canvas.classList.add('complete');
          const prize = card.dataset.prize || '₹100 Cashback';
          showToast(`You won ${prize}!`, 'success', 3000, 'celebration');
          const claimed = JSON.parse(localStorage.getItem('claimedRewards') || '[]');
          claimed.push({ name: prize, date: new Date().toISOString() });
          localStorage.setItem('claimedRewards', JSON.stringify(claimed));
        }
      };

      const start = (e) => {
        if (revealed) return;
        e.preventDefault();
        isDrawing = true;
        lastPt = null;
        scratch(getPoint(e));
      };
      const move = (e) => {
        if (!isDrawing || revealed) return;
        e.preventDefault();
        scratch(getPoint(e));
      };
      const end = () => {
        if (!isDrawing) return;
        isDrawing = false;
        lastPt = null;
        checkProgress();
      };

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', move);
      window.addEventListener('mouseup', end);

      canvas.addEventListener('touchstart', start, { passive: false });
      canvas.addEventListener('touchmove', move, { passive: false });
      canvas.addEventListener('touchend', end);

      window.addEventListener('resize', () => {
        if (!revealed) resize();
      });
    });

    document.querySelectorAll('.reset-scratch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scratch-card').forEach(card => {
          const canvas = card.querySelector('.scratch-canvas');
          if (canvas) {
            canvas.classList.remove('complete');
            card.dataset.bound = 'false';
          }
        });
        this.initScratchCards();
        showToast('Scratch cards reset!', 'info');
      });
    });
  },

  initClaimButtons() {
    document.querySelectorAll('.claim-reward-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const row = this.closest('div[class*="rounded-xl"]');
        const name = row?.querySelector('.font-bold')?.textContent || 'Reward';
        showToast(`Claiming "${name}"...`, 'info', 2000);
        const claimed = JSON.parse(localStorage.getItem('claimedRewards') || '[]');
        claimed.push({ name, date: new Date().toISOString() });
        localStorage.setItem('claimedRewards', JSON.stringify(claimed));
        setTimeout(() => {
          openModal('congratsModal');
        }, 400);
      });
    });
  },

  initJoinChallenge() {
    document.querySelectorAll('.join-challenge-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.challenge-card');
        const name = card?.querySelector('h3')?.textContent || 'Challenge';
        if (this.classList.contains('joined')) {
          showToast('Already joined!', 'info');
          return;
        }
        this.classList.add('joined');
        this.textContent = '✓ Joined';
        this.classList.remove('bg-[#001E82]', 'hover:bg-[#0c31AC]');
        this.classList.add('bg-[#79B619]');
        showToast(`Joined "${name}"!`, 'success');
      });
    });
  },

  initStickerCollect() {
    if (document.querySelector('.album-sheet')) return;
    const updateStickerCount = () => {
      const all = document.querySelectorAll('.sticker-card');
      const collected = document.querySelectorAll('.sticker-card.collected').length;
      const total = all.length;
      const countEl = document.getElementById('stickerCollectedCount');
      const progressEl = document.getElementById('stickerProgress');
      const bannerEl = document.getElementById('bannerStickerCount');
      if (countEl) countEl.textContent = collected;
      if (progressEl) progressEl.style.width = (collected / total * 100) + '%';
      if (bannerEl) bannerEl.textContent = `${collected} Stickers Collected`;
    };

    document.querySelectorAll('.sticker-card').forEach(card => {
      if (card.classList.contains('collected')) return;
      card.addEventListener('click', function () {
        window.__pendingStickerCard = this;
        const modal = document.getElementById('stickerModal');
        if (modal) openModal('stickerModal');
      });
    });

    const stickerForm = document.getElementById('stickerForm');
    if (stickerForm) {
      stickerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const card = window.__pendingStickerCard;
        if (!card) return;

        const img = card.querySelector('img');
        const uploaded = document.getElementById('stickerUpload').files[0];

        if (uploaded) {
          img.src = URL.createObjectURL(uploaded);
        } else {
          img.src = 'https://picsum.photos/100/100?random=' + Math.floor(Math.random() * 100);
        }
        img.classList.remove('opacity-50');

        const overlay = card.querySelector('.absolute.inset-0');
        if (overlay) overlay.remove();

        card.classList.add('collected', 'just-collected', 'border-[#79B619]');
        card.classList.remove('border-gray-300', 'hover:opacity-70');

        const footer = document.createElement('div');
        footer.className = 'absolute bottom-0 left-0 right-0 bg-[#79B619] text-white text-center text-xs py-0.5';
        footer.innerHTML = '<span class="material-symbols-outlined text-white" style="font-size:16px">check_circle</span>';
        card.appendChild(footer);

        document.getElementById('stickerUpload').value = '';
        const fileName = this.querySelector('.file-name');
        if (fileName) fileName.classList.add('hidden');

        window.closeModal('stickerModal');
        window.__pendingStickerCard = null;
        showToast('Sticker collected!', 'success');
        updateStickerCount();

        setTimeout(() => card.classList.remove('just-collected'), 700);
      });
    }
  },

  initForms() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const required = this.querySelectorAll('input[required]');
        let valid = true;
        required.forEach(input => {
          if ((input.type === 'checkbox' && !input.checked) || (!input.value && input.type !== 'checkbox')) {
            input.classList.add('border-red-500');
            valid = false;
          } else {
            input.classList.remove('border-red-500');
          }
        });
        if (!valid) {
          showToast('Please complete all required fields.', 'error');
          return;
        }
        const success = document.getElementById('successMessage');
        if (success) {
          this.classList.add('hidden');
          success.classList.remove('hidden');
          success.scrollIntoView({ behavior: 'smooth' });
          showToast('Welcome to UniRewards!', 'success');
          if (window.gsap) {
            gsap.fromTo(success, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
          }
        }
      });
    }

    const heroForm = document.getElementById('heroForm');
    if (heroForm) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Account created! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'rewards.html';
        }, 1200);
      });
    }

    const kycForm = document.getElementById('kycForm');
    if (kycForm) {
      kycForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const required = this.querySelectorAll('input[required]');
        let valid = true;
        required.forEach(input => {
          if ((input.type === 'checkbox' && !input.checked) || (!input.value && input.type !== 'checkbox')) {
            valid = false;
          }
        });
        if (!valid) {
          showToast('Please complete all required fields.', 'error');
          return;
        }
        this.classList.add('hidden');
        const success = document.getElementById('kycSuccess');
        if (success) {
          success.classList.remove('hidden');
          success.scrollIntoView({ behavior: 'smooth' });
          showToast('KYC submitted successfully!', 'success');
          if (window.gsap) {
            gsap.fromTo(success, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
          }
        }
        localStorage.setItem('kycSubmitted', 'true');
        this.updateKYCStatus(true);
      });
    }
  },

  updateKYCStatus(submitted) {
    const badge = document.getElementById('kycStatus');
    if (!badge) return;
    if (submitted) {
      badge.className = 'text-sm text-green-600 font-semibold inline-flex items-center gap-1';
      badge.innerHTML = '<i class="bi bi-check-circle"></i> Verified';
    } else {
      badge.className = 'text-sm text-yellow-600 font-semibold inline-flex items-center gap-1';
      badge.innerHTML = '<i class="bi bi-clock"></i> Pending';
    }
  },

  restoreKYCState() {
    if (this.state.kycSubmitted) {
      this.updateKYCStatus(true);
      const form = document.getElementById('kycForm');
      const success = document.getElementById('kycSuccess');
      if (form && success) {
        form.classList.add('hidden');
        success.classList.remove('hidden');
      }
    }
  },

  initTimers() {
    window.startOTPTimer = (elId, seconds) => {
      const el = document.getElementById(elId);
      if (!el) return;
      let timer = seconds;
      const update = () => {
        const m = String(Math.floor(timer / 60)).padStart(2, '0');
        const s = String(timer % 60).padStart(2, '0');
        el.textContent = `${m}:${s}`;
      };
      update();
      const interval = setInterval(() => {
        timer--;
        if (timer <= 0) {
          clearInterval(interval);
          el.textContent = 'Resend';
          el.classList.add('cursor-pointer');
        } else {
          update();
        }
      }, 1000);
    };

    document.getElementById('resendOtpReg')?.addEventListener('click', () => {
      startOTPTimer('otpTimerRegister', 60);
      showToast('OTP resent!', 'success');
    });
    document.getElementById('sendKycOtp')?.addEventListener('click', () => {
      startOTPTimer('otpTimerKYC', 45);
      showToast('OTP sent to your mobile', 'success');
    });
  },

  initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    if (document.querySelector('.hero-content') && !document.body.dataset.heroAnimated) {
      document.body.dataset.heroAnimated = 'true';

      gsap.set('.hero-content > *', { y: 30, opacity: 0 });
      gsap.set('.form-card', { x: 40, opacity: 0 });

      gsap.to('.hero-content > *', {
        y: 0, opacity: 1,
        duration: 0.7, stagger: 0.12, delay: 0.15, ease: 'power3.out',
        clearProps: 'transform'
      });
      gsap.to('.form-card', {
        x: 0, opacity: 1,
        duration: 0.85, delay: 0.35, ease: 'power3.out',
        clearProps: 'transform'
      });

      setTimeout(() => {
        document.querySelectorAll('.hero-content > *, .form-card').forEach(el => {
          el.style.opacity = '';
          el.style.visibility = '';
          el.style.transform = '';
        });
      }, 2200);
    }

    const revealSelectors = '.ranking-card, .reward-card, .usp-card, .sticker-card, .scratch-card, .bg-white.rounded-2xl';
    document.querySelectorAll('section').forEach(section => {
      if (section.id === 'hero' || section.closest('header')) return;
      const items = section.querySelectorAll(revealSelectors);
      if (!items.length) return;
      gsap.from(items, {
        scrollTrigger: { trigger: section, start: 'top 85%', once: true, invalidateOnRefresh: true },
        y: 30, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out',
        onComplete: () => gsap.set(items, { clearProps: 'all' }),
        clearProps: 'transform,opacity'
      });
    });

    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = Math.round(obj.val).toLocaleString('en-IN') + suffix; }
      });
    });

    if (window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.reward-card, .testimonial-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
        });
      });
    }

    if (window.jQuery && jQuery.fn.slick) {
      jQuery('.challenges-slider').on('init afterChange', () => ScrollTrigger.refresh());
    }
    window.addEventListener('load', () => ScrollTrigger.refresh());
    setTimeout(() => ScrollTrigger.refresh(), 500);
  },

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        });
        window.closeSidebar?.();
      }
    });
  },

  initLazyImages() {
    const mark = (img) => img.classList.add('loaded');
    const sweep = () => {
      document.querySelectorAll('img[loading="lazy"]:not(.loaded)').forEach(img => {
        if (img.complete) mark(img);
      });
    };
    document.addEventListener('load', (e) => {
      if (e.target.tagName === 'IMG') mark(e.target);
    }, true);
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') mark(e.target);
    }, true);
    sweep();
    window.addEventListener('load', sweep);
    if (window.jQuery) {
      jQuery('.slick-slider').on('init setPosition afterChange', sweep);
    }
  },

  initLogout() {
    document.querySelectorAll('.logout-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
          localStorage.removeItem('kycSubmitted');
          localStorage.removeItem('claimedRewards');
          showToast('Logged out successfully', 'info', 1500);
          setTimeout(() => window.location.href = 'index.html', 800);
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());

document.addEventListener('DOMContentLoaded', () => {
  if (window.jQuery && jQuery.fn.slick) {
    jQuery('.challenges-slider').on('init afterChange', () => {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        if (a.dataset.smoothBound === 'true') return;
        a.dataset.smoothBound = 'true';
      });
    });
  }
});