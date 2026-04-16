document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a, .logo');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1) || 'home';
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Handle Contact Form Submission with Captcha
    const contactForm = document.getElementById('contact-form');
    const captchaQuestionElement = document.getElementById('captcha-question');
    const captchaInput = document.getElementById('captcha');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerText;

    let captchaAnswer = 0;

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        captchaAnswer = num1 + num2;
        if (captchaQuestionElement) {
            captchaQuestionElement.innerText = `${num1} + ${num2} = ?`;
        }
    };

    if (contactForm) {
        generateCaptcha();

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate Captcha
            if (parseInt(captchaInput.value) !== captchaAnswer) {
                alert('Robot check failed! Please try again.');
                generateCaptcha();
                captchaInput.value = '';
                return;
            }

            // Get form data
            const formData = new FormData(contactForm);
            
            // UI Feedback
            submitBtn.disabled = true;
            submitBtn.innerText = 'SENDING...';

            try {
                const response = await fetch(contactForm.getAttribute('action'), {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success UI
                    submitBtn.innerText = 'SENT! 🎉';
                    submitBtn.style.backgroundColor = '#00d4ff';
                    contactForm.reset();
                    generateCaptcha();
                    
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 5000);
                } else {
                    throw new Error('Form submission failed.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Oops! There was a problem sending your message. Please try again later.');
                submitBtn.innerText = 'ERROR';
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                }, 3000);
            }
        });
    }

    // Scroll reveal effect for sections
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });
});
