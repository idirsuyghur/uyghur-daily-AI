/* slider.js — Falcha Gallery Slider (zero-dependency) */

(function () {
    'use strict';

    const IMAGES = [
        { src: 'assets/falcha-original-slider/c1.png', alt: 'Falcha restaurant — dish 1' },
        { src: 'assets/falcha-original-slider/c2.png', alt: 'Falcha restaurant — dish 2' },
        { src: 'assets/falcha-original-slider/c3.png', alt: 'Falcha restaurant — dish 3' },
        { src: 'assets/falcha-original-slider/c4.png', alt: 'Falcha restaurant — dish 4' },
        { src: 'assets/falcha-original-slider/c5.png', alt: 'Falcha restaurant — dish 5' },
        { src: 'assets/falcha-original-slider/c6.png', alt: 'Falcha restaurant — dish 6' },
        { src: 'assets/falcha-original-slider/c7.png', alt: 'Falcha restaurant — dish 7' },
        { src: 'assets/falcha-original-slider/c8.png', alt: 'Falcha restaurant — dish 8' },
    ];

    const AUTOPLAY_MS = 4000;

    // ── Build DOM ─────────────────────────────────────────────────────────────
    function buildSlider() {
        const root = document.getElementById('falchaSlider');
        if (!root) return;

        // Track
        const track = document.createElement('div');
        track.className = 'fsl-track';
        track.setAttribute('aria-live', 'polite');

        IMAGES.forEach(({ src, alt }, i) => {
            const slide = document.createElement('div');
            slide.className = 'fsl-slide';
            slide.setAttribute('role', 'img');
            slide.setAttribute('aria-label', alt);

            const img = document.createElement('img');
            img.alt = alt;
            img.width = 1200;
            img.height = 800;
            img.decoding = 'async';

            if (i === 0) {
                img.src = src;                 // first image: eager
                img.fetchPriority = 'high';
            } else {
                img.loading = 'lazy';          // rest: lazy
                img.dataset.src = src;
            }

            slide.appendChild(img);
            track.appendChild(slide);
        });

        // Arrows
        const btnPrev = document.createElement('button');
        btnPrev.className = 'fsl-arrow fsl-prev';
        btnPrev.innerHTML = '&#8249;';
        btnPrev.setAttribute('aria-label', 'Previous photo');

        const btnNext = document.createElement('button');
        btnNext.className = 'fsl-arrow fsl-next';
        btnNext.innerHTML = '&#8250;';
        btnNext.setAttribute('aria-label', 'Next photo');

        // Dots
        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'fsl-dots';
        dotsWrap.setAttribute('role', 'tablist');
        dotsWrap.setAttribute('aria-label', 'Photo selector');

        const dots = IMAGES.map((_, i) => {
            const d = document.createElement('button');
            d.className = 'fsl-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('role', 'tab');
            d.setAttribute('aria-label', `Photo ${i + 1}`);
            d.setAttribute('aria-selected', i === 0);
            d.addEventListener('click', () => go(i));
            dotsWrap.appendChild(d);
            return d;
        });

        // Counter
        const counter = document.createElement('div');
        counter.className = 'fsl-counter';
        counter.setAttribute('aria-live', 'polite');
        counter.setAttribute('aria-atomic', 'true');

        root.appendChild(track);
        root.appendChild(btnPrev);
        root.appendChild(btnNext);
        root.appendChild(dotsWrap);
        root.appendChild(counter);

        // ── State ──────────────────────────────────────────────────────────────
        let current = 0;
        let timer = null;
        let paused = false;
        const total = IMAGES.length;
        const slides = track.querySelectorAll('.fsl-slide');

        function lazyLoadImg(slide) {
            const img = slide.querySelector('img[data-src]');
            if (img) {
                img.src = img.dataset.src;
                delete img.dataset.src;
            }
        }

        // Pre-load adjacent (preload next + prev)
        function preloadAdjacent(idx) {
            const next = (idx + 1) % total;
            const prev = (idx - 1 + total) % total;
            lazyLoadImg(slides[next]);
            lazyLoadImg(slides[prev]);
        }

        function update(newIdx, direction) {
            const oldSlide = slides[current];
            const newSlide = slides[newIdx];

            // Direction class for animation
            const outClass = direction === 'next' ? 'fsl-out-left' : 'fsl-out-right';
            const inClass = direction === 'next' ? 'fsl-in-right' : 'fsl-in-left';

            // Lazy load the incoming slide
            lazyLoadImg(newSlide);

            oldSlide.classList.add(outClass);
            newSlide.classList.add(inClass, 'fsl-active');

            oldSlide.addEventListener('animationend', () => {
                oldSlide.classList.remove('fsl-active', outClass);
            }, { once: true });

            newSlide.addEventListener('animationend', () => {
                newSlide.classList.remove(inClass);
            }, { once: true });

            // Dots
            dots[current].classList.remove('active');
            dots[current].setAttribute('aria-selected', false);
            dots[newIdx].classList.add('active');
            dots[newIdx].setAttribute('aria-selected', true);

            // Counter
            counter.textContent = `${newIdx + 1} / ${total}`;

            current = newIdx;
            preloadAdjacent(current);
        }

        function go(idx) {
            if (idx === current) return;
            const dir = idx > current ? 'next' : 'prev';
            update(idx, dir);
            restartTimer();
        }

        function next() {
            const idx = (current + 1) % total;
            update(idx, 'next');
        }

        function prev() {
            const idx = (current - 1 + total) % total;
            update(idx, 'prev');
        }

        // ── Init first slide ───────────────────────────────────────────────────
        slides[0].classList.add('fsl-active');
        counter.textContent = `1 / ${total}`;
        preloadAdjacent(0);

        // ── Autoplay ───────────────────────────────────────────────────────────
        function startTimer() {
            if (timer) clearInterval(timer);
            timer = setInterval(() => { if (!paused) next(); }, AUTOPLAY_MS);
        }
        function restartTimer() { startTimer(); }

        startTimer();

        // Pause on hover / focus within
        root.addEventListener('mouseenter', () => { paused = true; });
        root.addEventListener('mouseleave', () => { paused = false; });
        root.addEventListener('focusin', () => { paused = true; });
        root.addEventListener('focusout', () => { paused = false; });

        // ── Arrow clicks ───────────────────────────────────────────────────────
        btnNext.addEventListener('click', () => { next(); restartTimer(); });
        btnPrev.addEventListener('click', () => { prev(); restartTimer(); });

        // ── Keyboard (when slider or arrows are focused) ────────────────────────
        root.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { next(); restartTimer(); e.preventDefault(); }
            if (e.key === 'ArrowLeft') { prev(); restartTimer(); e.preventDefault(); }
        });
        // Also catch global arrow keys for convenience
        document.addEventListener('keydown', (e) => {
            const sliderVisible = root.getBoundingClientRect().top < window.innerHeight
                && root.getBoundingClientRect().bottom > 0;
            if (!sliderVisible) return;
            if (document.activeElement && document.activeElement !== document.body) return;
            if (e.key === 'ArrowRight') { next(); restartTimer(); }
            if (e.key === 'ArrowLeft') { prev(); restartTimer(); }
        });

        // ── Touch / swipe ──────────────────────────────────────────────────────
        let touchStartX = null;
        let touchStartY = null;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;

            // Only respond to primarily horizontal swipes
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                if (dx < 0) { next(); restartTimer(); }
                else { prev(); restartTimer(); }
            }
            touchStartX = null;
            touchStartY = null;
        }, { passive: true });
    }

    // Run after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildSlider);
    } else {
        buildSlider();
    }
})();
