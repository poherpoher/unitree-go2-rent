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

    // --- КАЛЬКУЛЯТОР АРЕНДЫ ---
    const rentalDaysInput = document.getElementById('rental-days');
    const daysVal = document.getElementById('days-val');
    const operatorServiceCheckbox = document.getElementById('operator-service');
    const totalPriceEl = document.getElementById('total-price');

    function calculateTotal() {
        if (!rentalDaysInput || !totalPriceEl) return;
        const days = parseInt(rentalDaysInput.value);
        daysVal.textContent = days;

        let basePricePerDay = 15000;
        let operatorCostPerDay = operatorServiceCheckbox.checked ? 5000 : 0;
        let total = days * (basePricePerDay + operatorCostPerDay);
        
        totalPriceEl.textContent = total.toLocaleString('ru-RU') + ' ₽';
    }

    if (rentalDaysInput) {
        rentalDaysInput.addEventListener('input', calculateTotal);
        operatorServiceCheckbox.addEventListener('change', calculateTotal);
        calculateTotal();
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

    // --- ФОРМА ЗАЯВКИ И TOAST УВЕДОМЛЕНИЕ ---
    const bookingForm = document.getElementById('booking-form');
    const toast = document.getElementById('toast-notification');

    if (bookingForm && toast) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            toast.classList.add('show');
            bookingForm.reset();
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
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

    // --- ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ---
    const themeToggleBtn = document.getElementById('themeToggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function (event) {
            event.stopPropagation();
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });

        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
});
