const initScrollReveal = () => {
  const sections = document.querySelectorAll('.scroll-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));
};

const initThemeToggle = () => {
  const themeButtons = document.querySelectorAll('.theme-btn');
  if (!themeButtons.length) return;

  const applyTheme = (theme) => {
    document.body.classList.toggle('dark', theme === 'dark');
    themeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.theme === theme);
    });
    localStorage.setItem('theme', theme);
  };

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => applyTheme(button.dataset.theme));
  });
};

const initAudio = () => {
  const bgAudio = document.getElementById('bg-audio');
  if (!bgAudio) return;

  const audioToggle = document.querySelector('.audio-toggle');

  const tryPlay = () => {
    bgAudio.play().catch(() => {
      // Autoplay may be blocked; will retry on user interaction.
    });
  };

  const updateButton = (isPlaying) => {
    if (!audioToggle) return;
    const icon = audioToggle.querySelector('.audio-icon');
    if (icon) {
      icon.textContent = isPlaying ? '🔊' : '🔇';
    }
    audioToggle.setAttribute(
      'aria-label',
      isPlaying ? 'Pause music' : 'Play music'
    );
    audioToggle.setAttribute('aria-pressed', String(isPlaying));
  };

  bgAudio.load();
  tryPlay();
  updateButton(!bgAudio.paused);

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (bgAudio.paused) {
        bgAudio.play().then(() => updateButton(true)).catch(() => {});
      } else {
        bgAudio.pause();
        updateButton(false);
      }
    });

    bgAudio.addEventListener('play', () => updateButton(true));
    bgAudio.addEventListener('pause', () => updateButton(false));
    bgAudio.addEventListener('error', () => {
      const icon = audioToggle.querySelector('.audio-icon');
      if (icon) {
        icon.textContent = '⚠️';
      }
      audioToggle.setAttribute('aria-label', 'Audio unavailable');
      audioToggle.setAttribute('aria-pressed', 'false');
    });
  }

  const unlockEvents = ['click', 'touchstart', 'keydown'];
  const unlockAudio = () => {
    bgAudio.muted = false;
    tryPlay();
    unlockEvents.forEach((eventName) =>
      window.removeEventListener(eventName, unlockAudio)
    );
  };

  unlockEvents.forEach((eventName) =>
    window.addEventListener(eventName, unlockAudio)
  );
};

const initMinimalistToggle = () => {
  const minimalToggle = document.querySelector('.minimal-toggle');
  if (!minimalToggle) return;

  const applyMinimalist = (isMinimal) => {
    document.body.classList.toggle('minimalist', isMinimal);
    minimalToggle.setAttribute('aria-pressed', String(isMinimal));
    minimalToggle.textContent = isMinimal ? 'Full background' : 'Minimalist';
    localStorage.setItem('minimalist', String(isMinimal));
  };

  const saved = localStorage.getItem('minimalist') === 'true';
  applyMinimalist(saved);

  minimalToggle.addEventListener('click', () => {
    const isMinimal = !document.body.classList.contains('minimalist');
    applyMinimalist(isMinimal);
  });
};

const initValentineHover = () => {
  const cta = document.querySelector('.valentine-cta');
  const heart = document.querySelector('.valentine-heart');
  if (!cta || !heart || typeof window.gsap === 'undefined') return;

  const hoverIn = () => {
    window.gsap.to(cta, {
      color: '#b38600',
      backgroundColor: 'rgba(255, 209, 102, 0.25)',
      duration: 0.25,
      ease: 'power1.out'
    });
    window.gsap.to(heart, {
      color: '#2fa34a',
      backgroundColor: 'rgba(47, 163, 74, 0.18)',
      textShadow: '0 0 12px rgba(47, 163, 74, 0.45)',
      duration: 0.25,
      ease: 'power1.out'
    });
  };

  const hoverOut = () => {
    window.gsap.to(cta, {
      color: '',
      backgroundColor: 'rgba(214, 58, 107, 0.12)',
      duration: 0.25,
      ease: 'power1.out'
    });
    window.gsap.to(heart, {
      color: '',
      backgroundColor: 'transparent',
      textShadow: 'none',
      duration: 0.25,
      ease: 'power1.out'
    });
  };

  [cta, heart].forEach((el) => {
    el.addEventListener('mouseenter', hoverIn);
    el.addEventListener('focus', hoverIn);
    el.addEventListener('mouseleave', hoverOut);
    el.addEventListener('blur', hoverOut);
  });
};

initScrollReveal();
initThemeToggle();
initAudio();
initValentineHover();
initMinimalistToggle();
