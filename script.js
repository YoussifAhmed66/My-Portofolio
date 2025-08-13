// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize all functionality
    initThemeToggle();
    initMobileNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    initTypingEffect();
    initScrollIndicator();
    initProjectCards();
    initSkillItems();
    initSocialLinks();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        themeToggle.checked = true;
    } else {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        themeToggle.checked = false;
    }

    // Theme toggle event listener
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        } else {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
        }

        // Update navbar background after theme change
        updateNavbarBackground();
    });
}

// Mobile Navigation
function initMobileNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Toggle mobile menu
    hamburger.addEventListener("click", () => {
        const isActive = hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        hamburger.setAttribute('aria-expanded', isActive.toString());
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        ".about-content, .skills-grid, .projects-grid, .contact-content, .stat, .skill-category, .project-card"
    );

    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
    });
}

// Contact Form Handling with Formspree Integration (AJAX Version)
function initContactForm() {
    const contactForm = document.querySelector(".contact-form");
    const submitButton = contactForm?.querySelector('button[type="submit"]');

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Prevent default form submission

            // Get form data for validation
            const formData = new FormData(contactForm);
            const name = formData.get("name");
            const email = formData.get("email");
            const subject = formData.get("_subject");
            const message = formData.get("message");

            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification("Please fill in all fields", "error");
                return;
            }

            if (!isValidEmail(email)) {
                showNotification("Please enter a valid email address", "error");
                return;
            }

            // Show loading state
            const originalText = submitButton.textContent;
            submitButton.textContent = "Sending...";
            submitButton.disabled = true;

            // Submit form via AJAX to Formspree
            fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            })
                .then(response => {
                    if (response.ok) {
                        showNotification("Message sent successfully! I'll get back to you soon.", "success");
                        contactForm.reset();
                    } else {
                        showNotification("Failed to send message. Please try again.", "error");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    showNotification("Network error. Please try again.", "error");
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = "translateX(100%)";
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing Effect for Hero Title
function initTypingEffect() {
    const highlightSpan = document.querySelector(".highlight");
    if (!highlightSpan) return;

    const text = highlightSpan.textContent;
    highlightSpan.textContent = "";

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            highlightSpan.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    // Add slight delay for better effect
    setTimeout(typeWriter, 500);
}

// Scroll Indicator Animation
function initScrollIndicator() {
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (!scrollIndicator) return;

    // Hide scroll indicator when scrolled down
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = "0";
        } else {
            scrollIndicator.style.opacity = "1";
        }
    });
}

// Navbar scroll effect
function updateNavbarBackground() {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.style.background = document.body.classList.contains("light-mode")
            ? "rgba(255, 255, 255, 0.98)"
            : "rgba(10, 10, 10, 0.98)";
    } else {
        navbar.style.background = document.body.classList.contains("light-mode")
            ? "rgba(255, 255, 255, 0.95)"
            : "rgba(10, 10, 10, 0.95)";
    }
}

window.addEventListener("scroll", () => {
    updateNavbarBackground();

    // Active navigation highlighting
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });

    // Scroll indicator
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
        scrollIndicator.style.opacity = window.scrollY > 100 ? "0" : "1";
    }
});

// Project card hover effects
function initProjectCards() {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-10px) scale(1.02)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0) scale(1)";
        });
    });
}

// Skill item hover effects
function initSkillItems() {
    const skillItems = document.querySelectorAll(".skill-item");

    skillItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            item.style.transform = "translateX(10px)";
        });

        item.addEventListener("mouseleave", () => {
            item.style.transform = "translateX(0)";
        });
    });
}

// Social links hover effects
function initSocialLinks() {
    const socialLinks = document.querySelectorAll(".social-link");

    socialLinks.forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.style.transform = "translateY(-3px) scale(1.1)";
        });

        link.addEventListener("mouseleave", () => {
            link.style.transform = "translateY(0) scale(1)";
        });
    });
}

// Add CSS for active navigation link and notifications
const style = document.createElement("style");
style.textContent = `
    .nav-link.active {
        color: #667eea !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);