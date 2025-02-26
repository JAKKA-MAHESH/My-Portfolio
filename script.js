// Initialize EmailJS with your Public Key
emailjs.init("-OSIS17oQdIqe2OVz"); // Replace with your EmailJS Public Key

// Particles.js
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#00e6e6" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3, random: true },
        move: { enable: true, speed: 2 }
    },
    interactivity: {
        events: { onhover: { enable: true, mode: "repulse" } }
    }
});

// Swiper Carousel
const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    autoplay: { delay: 3000 }
});

// Navbar Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.navbar ul');
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// ScrollReveal Animations
ScrollReveal().reveal('[data-reveal="fade-up"]', {
    distance: '50px',
    duration: 1000,
    origin: 'bottom',
    easing: 'ease-in-out'
});
ScrollReveal().reveal('[data-reveal-delay="200"]', { delay: 200 });
ScrollReveal().reveal('[data-reveal-delay="400"]', { delay: 400 });

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const formMessage = document.getElementById('formMessage');

    emailjs.sendForm('service_tp26jtm', 'template_fo61jii', form)
        .then(() => {
            formMessage.textContent = 'Message sent successfully!';
            formMessage.classList.add('success');
            formMessage.style.display = 'block';
            form.reset();
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 3000);
        }, (error) => {
            formMessage.textContent = 'Failed to send message. Please try again.';
            formMessage.classList.add('error');
            formMessage.style.display = 'block';
            console.error('EmailJS Error:', error);
        });
});