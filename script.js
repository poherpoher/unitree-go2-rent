document.addEventListener("DOMContentLoaded", function () {
    
    // --- СОХРАНЕНИЕ ПОЗИЦИИ СКРОЛЛА (БЕЗОПАСНОЕ ДЛЯ FILE://) ---
    try {
        const savedSection = sessionStorage.getItem('activeSection');
        if (savedSection) {
            setTimeout(() => {
                const targetElement = document.getElementById(savedSection);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'instant' });
                }
            }, 50);
            sessionStorage.removeItem('activeSection');
        }

        window.addEventListener('beforeunload', function () {
            const sections = document.querySelectorAll('section, footer');
            let currentSectionId = '';
            
            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= 200 && rect.bottom >= 0) {
                    currentSectionId = sec.id;
                }
            });

            if (currentSectionId) {
                sessionStorage.setItem('activeSection', currentSectionId);
            }
        });
    } catch (e) {
        // Игнорируем ограничения безопасности локального запуска
    }

    // --- 1. ПАРАЛЛАКС ФИГУР И КНОПКА "НАВЕРХ" ---
    const shape1 = document.querySelector('.shape-1');
    const shape2 = document.querySelector('.shape-2');
    const shape3 = document.querySelector('.shape-3');

    document.addEventListener('scroll', function (e) {
        let scrollValue = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        
        if (e.target && e.target !== document && e.target !== window) {
            scrollValue = e.target.scrollTop || scrollValue;
        }

        const topButton = document.getElementById("scrollTopBtn");

        if (topButton) {
            if (scrollValue > 300) {
                topButton.classList.add("show");
            } else {
                topButton.classList.remove("show");
            }
        }

        // Двигаем фигуры
        if (shape1) {
            shape1.style.transform = "translateY(" + (scrollValue * 0.15) + "px) rotate(45deg)";
        }
        if (shape2) {
            shape2.style.transform = "translateY(" + (-scrollValue * 0.25) + "px) rotate(15deg)";
        }
        if (shape3) {
            shape3.style.transform = "translateY(" + (scrollValue * 0.1) + "px)";
        }
    }, true);

    // --- БАННЕР COOKIES ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        acceptCookiesBtn.addEventListener('click', function () {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- ИНТЕРАКТИВНАЯ КНОПКА ТЕЛЕФОНА ---
    const phoneBtn = document.getElementById('phone-btn');

    if (phoneBtn) {
        phoneBtn.addEventListener('click', function () {
            const phoneLink = document.createElement('a');
            phoneLink.href = 'tel:+79141570384';
            phoneLink.className = 'phone-revealed';
            phoneLink.textContent = '+79141570384';
            phoneBtn.replaceWith(phoneLink);
        });
    }

    // --- FAQ АККОРДЕОН ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // --- ФОРМА ЗАЯВКИ И ОТПРАВКА В TELEGRAM ---
    const bookingForm = document.getElementById('booking-form');
    const toast = document.getElementById('toast-notification');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('client-name');
            const phoneInput = document.getElementById('client-phone');

            const formData = {
                name: nameInput ? nameInput.value : '',
                phone: phoneInput ? phoneInput.value : '',
                tariff: 'Почасовая аренда (10 000 ₽/час, мин. 2 часа)'
            };

            try {
                const response = await fetch('https://raspy-poetry-fe03.berserkerhv.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    if (toast) {
                        toast.classList.add('show');
                        setTimeout(() => {
                            toast.classList.remove('show');
                        }, 4000);
                    }
                    bookingForm.reset();
                } else {
                    alert('Ошибка при отправке. Попробуйте позже.');
                }
            } catch (err) {
                alert('Ошибка соединения с сервером.');
                console.error(err);
            }
        });
    }

    // --- АНИМАЦИЯ ПОЯВЛЕНИЯ МЕДИА-БЛОКОВ ---
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.media-item').forEach(function (block) {
        block.style.opacity = "0";
        block.style.transform = "translateY(50px)";
        block.style.transition = "all 0.8s ease-out";
        observer.observe(block);
    });

    // --- УМНЫЙ ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (ЧИСТЫЙ CSS + VIEW TRANSITIONS) ---
    const themeToggleBtn = document.getElementById('themeToggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            const isCurrentlyDark = document.body.classList.contains('dark-theme');
            const nextDarkState = !isCurrentlyDark;

            const rect = themeToggleBtn.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            document.documentElement.style.setProperty('--x', x + 'px');
            document.documentElement.style.setProperty('--y', y + 'px');

            if (!document.startViewTransition) {
                if (nextDarkState) {
                    document.body.classList.add('dark-theme');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark-theme');
                    localStorage.setItem('theme', 'light');
                }
                return;
            }

            if (!nextDarkState) {
                document.documentElement.classList.add('transitioning-to-light');
            } else {
                document.documentElement.classList.remove('transitioning-to-light');
            }

            const transition = document.startViewTransition(() => {
                if (nextDarkState) {
                    document.body.classList.add('dark-theme');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark-theme');
                    localStorage.setItem('theme', 'light');
                }
            });

            transition.finished.finally(() => {
                document.documentElement.classList.remove('transitioning-to-light');
            });
        });
    }
});