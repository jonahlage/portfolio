// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}

animateFollower();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');

hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('[data-aos]');
animatedElements.forEach(element => {
    observer.observe(element);
});

// Parallax effect for gradient orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.2);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add security headers via meta tags (media-src 'self' added for video playback)
const securityHeaders = [
    { httpEquiv: 'Content-Security-Policy', content: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; media-src 'self';" },
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
];

securityHeaders.forEach(header => {
    const meta = document.createElement('meta');
    meta.httpEquiv = header.httpEquiv;
    meta.content = header.content;
    document.head.appendChild(meta);
});

// Prevent right-click on images (optional security measure)
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Simple form validation and XSS prevention (for future contact form)
function sanitizeInput(input) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'\/]/ig;
    return input.replace(reg, (match) => (map[match]));
}

// Performance monitoring
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
});

// Keyboard navigation accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Disable cursor on touch devices
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
}

// ──────────────────────────────────────────────────────────────────
// TwiLight Card: Video hover autoplay + Mini Audio Player
// ──────────────────────────────────────────────────────────────────
(function initTwilightCard() {
    const card         = document.querySelector('.twilight-card');
    if (!card) return;

    const video        = card.querySelector('.twilight-video');
    const audioBtn     = card.querySelector('.audio-toggle-btn');
    const miniPlayer   = card.querySelector('.mini-player');
    const miniPlayBtn  = card.querySelector('.mini-play-btn');
    const progressFill = card.querySelector('.mini-progress-fill');
    const progressTrack= card.querySelector('.mini-progress-track');
    const timeDisplay  = card.querySelector('.mini-time');
    const closeBtn     = card.querySelector('.mini-close-btn');

    if (!video || !audioBtn || !miniPlayer) return;

    // State
    let miniPlayerOpen   = false;
    let audioPlaying     = false;
    let progressInterval = null;

    // Helpers
    function formatTime(seconds) {
        const s = Math.floor(seconds % 60);
        const m = Math.floor(seconds / 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function updateProgress() {
        if (!video.duration) return;
        const pct = (video.currentTime / video.duration) * 100;
        progressFill.style.width = pct + '%';
        timeDisplay.textContent  = formatTime(video.currentTime);
    }

    function startProgressPolling() {
        if (progressInterval) return;
        progressInterval = setInterval(updateProgress, 250);
    }

    function stopProgressPolling() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    function openMiniPlayer() {
        miniPlayerOpen = true;
        miniPlayer.classList.add('mini-player-open');
    }

    function closeMiniPlayer() {
        miniPlayerOpen = false;
        miniPlayer.classList.remove('mini-player-open');
        if (audioPlaying) {
            audioPlaying = false;
            video.muted = true;
            miniPlayer.classList.remove('audio-playing');
            audioBtn.classList.remove('audio-active');
            stopProgressPolling();
        }
    }

    function playAudio() {
        audioPlaying = true;
        video.muted  = false;
        miniPlayer.classList.add('audio-playing');
        audioBtn.classList.add('audio-active');
        startProgressPolling();
        video.play().catch(() => {});
    }

    function pauseAudio() {
        audioPlaying = false;
        video.muted  = true;
        miniPlayer.classList.remove('audio-playing');
        stopProgressPolling();
    }

    // Video hover autoplay
    card.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
        if (!audioPlaying) {
            video.pause();
        }
    });

    // Audio toggle button
    audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!miniPlayerOpen) {
            openMiniPlayer();
            playAudio();
        } else {
            if (audioPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        }
    });

    // Mini player: play/pause button
    miniPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audioPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    // Mini player: close button
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMiniPlayer();
    });

    // Progress bar: click to seek
    progressTrack.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!video.duration) return;
        const rect = progressTrack.getBoundingClientRect();
        const fraction = (e.clientX - rect.left) / rect.width;
        video.currentTime = fraction * video.duration;
        updateProgress();
    });

    // Video timeupdate
    video.addEventListener('timeupdate', () => {
        if (miniPlayerOpen) updateProgress();
    });

    // Prevent project-info link from firing on audio controls
    miniPlayer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close mini player if user clicks outside the card
    document.addEventListener('click', (e) => {
        if (!card.contains(e.target) && miniPlayerOpen) {
            closeMiniPlayer();
        }
    });
})();
