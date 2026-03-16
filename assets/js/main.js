// 1. REVEAL ON SCROLL
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));

        // 2. COUNTER ANIMATION
        const counters = document.querySelectorAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute('data-target');
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            entry.target.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.innerText = target;
                        }
                    };
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => counterObserver.observe(counter));

        // 3. FAQ ACCORDION
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                });
                // Open clicked if was not active
                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });

        // 4. REVIEWS SLIDER
        const track = document.getElementById('reviewsTrack');
        const dots = document.querySelectorAll('.slider-dot');
        let currentSlide = 0;
        
        function updateSlider(index) {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            currentSlide = index;
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => updateSlider(index));
        });

        // Auto slide
        setInterval(() => {
            let next = (currentSlide + 1) % dots.length;
            updateSlider(next);
        }, 5000);

        // 5. PHONE INPUT FORMATTING (Basic Vanilla)
        const phoneInputs = document.querySelectorAll('.phone-input');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
                if (!x[1]) {
                    e.target.value = '+7 ';
                    return;
                }
                e.target.value = !x[2] ? '+7 (' + x[1] : '+7 (' + (x[2] ? x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
            });
            input.addEventListener('focus', function(e) {
                if(e.target.value === '') e.target.value = '+7 (';
            });
        });

        // 6. FORM HANDLING & VALIDATION
        const modal = document.getElementById('successModal');
        const clientNameSpan = document.getElementById('clientName');

        function handleFormSubmit(e) {
            e.preventDefault();
            const form = e.target;
            const nameInput = form.querySelector('input[name="name"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            
            const name = nameInput.value.trim();
            const phone = phoneInput.value.replace(/\D/g, '');

            let isValid = true;

            if (name.length < 2) {
                nameInput.classList.add('error');
                isValid = false;
            } else {
                nameInput.classList.remove('error');
            }

            if (phone.length < 11) { // RU phone length with country code
                phoneInput.classList.add('error');
                isValid = false;
            } else {
                phoneInput.classList.remove('error');
            }

            if (isValid) {
                // Front-end success simulation
                clientNameSpan.innerText = name;
                modal.classList.add('show');
                form.reset();
                
                // Track conversion event here if needed (e.g., fbq('track', 'Lead'))
            } else {
                // Add a subtle shake animation for error
                form.style.transform = 'translateX(10px)';
                setTimeout(() => form.style.transform = 'translateX(-10px)', 100);
                setTimeout(() => form.style.transform = 'translateX(0)', 200);
            }
        }

        function closeModal() {
            modal.classList.remove('show');
        }

        // Close modal on outside click
        window.onclick = function(event) {
            if (event.target == modal) closeModal();
        }

        // 7. STICKY MOBILE CTA
        const stickyCta = document.getElementById('stickyCta');
        const heroForm = document.getElementById('form-hero');
        
        window.addEventListener('scroll', () => {
            // Show sticky CTA only when scrolling past the first form
            const heroFormBottom = heroForm.getBoundingClientRect().bottom;
            if (window.scrollY > 500 && heroFormBottom < 0 && window.innerWidth < 768) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
