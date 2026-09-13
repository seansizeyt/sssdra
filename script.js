// Инициализация частиц на фоне
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация частиц
  if(typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#ffffff"
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          }
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.3,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        }
      },
      retina_detect: true
    });
  }

  // Эффект огоньков при наведении на кнопки
  const buttons = document.querySelectorAll('.promo-button');

  buttons.forEach(button => {
    let hoverTimer;
    let isHovering = false;

    button.addEventListener('mouseenter', function() {
      isHovering = true;
      // Запускаем периодическое создание огоньков
      hoverTimer = setInterval(() => {
        if (isHovering) {
          createFireflies(null, this);
        }
      }, 800); // Огоньки появляются каждые 800ms
    });

    button.addEventListener('mousemove', function(e) {
      // Создаем огоньки при движении мыши
      if (Math.random() > 0.7) { // 30% chance
        createFireflies(e, this);
      }
    });

    button.addEventListener('mouseleave', function() {
      isHovering = false;
      clearInterval(hoverTimer);
    });

    button.addEventListener('click', function(e) {
      createClickEffect(e, this);
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1.05) translateY(-2px)';
      }, 150);

      // Создаем больше огоньков при клике
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createFireflies(e, this), i * 100);
      }
    });
  });

  // Плавный параллакс эффект для карточки
  const card = document.querySelector('.main-card');
  if (card) {
    let isHovering = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Плавное обновление позиции
    function updateCardPosition() {
      // Плавная интерполяция
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      // Применяем трансформацию
      card.style.transform = `
                perspective(1000px) 
                rotateY(${currentX}deg) 
                rotateX(${-currentY}deg)
                translateZ(10px)
            `;

      // Продолжаем анимацию если нужно
      if (isHovering || Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        requestAnimationFrame(updateCardPosition);
      }
    }

    card.addEventListener('mousemove', function(e) {
      if (!isHovering) {
        isHovering = true;
        updateCardPosition();
      }

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Вычисляем смещение от центра
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Ограничиваем максимальный угол наклона
      targetX = (mouseX / (rect.width / 2)) * 5; // ±5 градусов
      targetY = (mouseY / (rect.height / 2)) * 5; // ±5 градусов
    });

    card.addEventListener('mouseleave', function() {
      isHovering = false;

      // Плавный возврат в исходное положение
      const returnToCenter = () => {
        targetX = 0;
        targetY = 0;

        // Продолжаем анимацию пока не вернемся в центр
        if (Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
          updateCardPosition();
          requestAnimationFrame(returnToCenter);
        } else {
          // Финализируем позицию
          currentX = 0;
          currentY = 0;
          card.style.transform = 'none';
        }
      };

      returnToCenter();
    });

    card.addEventListener('mouseenter', function() {
      card.style.transition = 'transform 0.3s ease-out';
      setTimeout(() => {
        card.style.transition = 'none';
      }, 300);
    });
  }

  // Функция создания огоньков
  function createFireflies(e, element) {
    // Случайное количество огоньков (1-3)
    const fireflyCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < fireflyCount; i++) {
      setTimeout(() => {
        if (!element.matches(':hover')) return;

        const firefly = document.createElement('div');
        firefly.className = 'firefly';

        // Размер огонька
        const size = Math.random() * 4 + 2;

        // Позиция относительно кнопки
        const rect = element.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = rect.height;

        // Случайное смещение по X
        const offsetX = (Math.random() - 0.5) * 20;

        // Случайная задержка и продолжительность
        const duration = Math.random() * 1 + 1.5;
        const delay = Math.random() * 0.5;

        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;
        firefly.style.left = `${x + offsetX}px`;
        firefly.style.top = `${y}px`;
        firefly.style.animationDuration = `${duration}s`;
        firefly.style.animationDelay = `${delay}s`;

        // Случайный цвет огонька (золотистые, белые, голубые оттенки)
        const colors = [
          '#fff', '#ffffcc', '#ffeb99', '#e6f7ff', '#ccf2ff',
          '#fff5cc', '#fffbcc', '#f0f8ff', '#f5f5dc'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        firefly.style.background = `radial-gradient(circle, ${randomColor} 40%, transparent 70%)`;

        element.appendChild(firefly);

        // Удаляем после анимации
        setTimeout(() => {
          if (firefly.parentNode) {
            firefly.remove();
          }
        }, (duration + delay) * 1000);

      }, i * 200); // Задержка между огоньками
    }
  }

  // Эффект при клике
  function createClickEffect(e, element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.background = 'rgba(255,255,255,0.4)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size/2;
    const y = e.clientY - rect.top - size/2;

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Добавляем случайные мерцающие звезды на фон
  createTwinklingStars();
});

// Создание мерцающих звезд
function createTwinklingStars() {
  const starsContainer = document.createElement('div');
  starsContainer.style.position = 'fixed';
  starsContainer.style.top = '0';
  starsContainer.style.left = '0';
  starsContainer.style.width = '100%';
  starsContainer.style.height = '100%';
  starsContainer.style.pointerEvents = 'none';
  starsContainer.style.zIndex = '1';

  for (let i = 0; i < 30; i++) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = Math.random() * 3 + 1 + 'px';
    star.style.height = star.style.width;
    star.style.background = '#fff';
    star.style.borderRadius = '50%';
    star.style.opacity = '0.3';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`;
    star.style.animationDelay = Math.random() * 2 + 's';

    starsContainer.appendChild(star);
  }

  document.body.appendChild(starsContainer);
}
