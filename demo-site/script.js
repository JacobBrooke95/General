// Interactive functionality for the demo site

// Show welcome message on Get Started button click
function showMessage() {
    alert('Welcome to the Demo Test Site! Explore our pages to learn more.');
}

// Toggle demo content visibility
function toggleDemo() {
    const demoContent = document.getElementById('demo-content');
    const timeSpan = document.getElementById('current-time');

    if (demoContent) {
        demoContent.classList.toggle('hidden');

        // Update time when showing the demo
        if (!demoContent.classList.contains('hidden') && timeSpan) {
            updateTime();
        }
    }
}

// Update current time display
function updateTime() {
    const timeSpan = document.getElementById('current-time');
    if (timeSpan) {
        const now = new Date();
        timeSpan.textContent = now.toLocaleTimeString();
    }
}

// Handle contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Show success message
            const formMessage = document.getElementById('form-message');
            formMessage.textContent = `Thank you, ${name}! Your message has been received. We'll respond to ${email} soon.`;
            formMessage.className = 'form-message success';

            // Reset form
            contactForm.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.className = 'form-message hidden';
            }, 5000);
        });
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Log page load for demo purposes
console.log('Demo Test Site loaded successfully!');
console.log('Current page:', window.location.pathname);
