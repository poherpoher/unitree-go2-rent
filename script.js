document.addEventListener("DOMContentLoaded", function () {
    // 1. Параллакс и кнопка "Наверх"
    const shape1 = document.querySelector('.shape-1');
    const shape2 = document.querySelector('.shape-2');
    const shape3 = document.querySelector('.shape-3');

    window.addEventListener('scroll', function () {
        const scrollValue = window.scrollY;
        const topButton = document.getElementById("scrollTopBtn");

        if (topButton) {
            if (scrollValue > 300) {
                topButton.classList.add("show");
            } else {
                topButton.classList.remove("show");
            }
        }

        if (shape1) {
            shape1.style.transform = "translateY(" + (scrollValue * 0.15) + "px) rotate(45deg)";
        }
        if (shape2) {
            shape2.style.transform = "translateY(" + (-scrollValue * 0.25) + "px) rotate(15deg)";
        }
        if (shape3) {
            shape3.style.transform = "translateY(" + (scrollValue * 0.1) + "px)";
        }
    });

    // 2. Анимация появления медиа-блоков при скролле
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

    // 3. Переключатель темной / светлой темы
    const themeToggleBtn = document.getElementById('themeToggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function (event) {
            event.stopPropagation(); // Предотвращаем конфликты и скачки событий
            
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });

        // Проверка сохраненной темы при загрузке
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
});
