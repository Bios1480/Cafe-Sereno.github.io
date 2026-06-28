const canvas = document.getElementById('hero-background');
const ctx = canvas.getContext('2d');
const video = document.getElementById('hero-video-source');

let animationFrameId = null;

// Configurar el tamaño del canvas al tamaño de la pantalla
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Si el video ya está listo, dibujar el frame actual inmediatamente para evitar parpadeos
    if (video.readyState >= 2) {
        drawVideoFrame();
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Función que replica el comportamiento "object-fit: cover" para el video dentro del canvas
function drawVideoFrame() {
    // Evitar errores si el video aún no tiene dimensiones válidas
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const videoRatio = video.videoWidth / video.videoHeight;
    const canvasRatio = canvas.width / canvas.height;

    let renderWidth, renderHeight, xOffset, yOffset;

    if (canvasRatio > videoRatio) {
        renderWidth = canvas.width;
        renderHeight = canvas.width / videoRatio;
        xOffset = 0;
        yOffset = (canvas.height - renderHeight) / 2;
    } else {
        renderWidth = canvas.height * videoRatio;
        renderHeight = canvas.height;
        xOffset = (canvas.width - renderWidth) / 2;
        yOffset = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calidad alta de renderizado
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // PINTAR EL VIDEO: En lugar de una imagen fija, le pasamos el elemento HTMLVideoElement
    ctx.drawImage(video, xOffset, yOffset, renderWidth, renderHeight);
}

// Bucle de animación sincronizado con la tasa de refresco de la pantalla (60Hz, 90Hz, 120Hz, etc.)
function renderLoop() {
    drawVideoFrame();
    animationFrameId = requestAnimationFrame(renderLoop);
}

// Controladores de eventos para iniciar/pausar el render según el estado del video
video.addEventListener('play', () => {
    if (!animationFrameId) {
        renderLoop();
    }
});

video.addEventListener('pause', () => {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
});

// Por si el video ya se estaba reproduciendo antes de que el script termine de cargar
if (!video.paused) {
    renderLoop();
}

// Forzar el redibujado cuando la página cargue por completo
window.addEventListener('load', () => {
    resizeCanvas();
});

// header responsive
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

navToggle.addEventListener("click", () => navMobile.classList.toggle("open"));
navMobile.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navMobile.classList.remove("open")));


// animação hero

window.addEventListener('DOMContentLoaded', () => {
    const heroTexts = document.querySelectorAll('.reveal-text');

    // Un pequeño timeout para asegurar que la transición se vea fluida
    setTimeout(() => {
        heroTexts.forEach(text => {
            text.classList.add('loaded');
        });
    }, 100);
});

const heroContent = document.querySelector('.hero-content');

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            heroContent.style.opacity = "1";
            heroContent.style.transform = "translateY(0)";
        } else {
            heroContent.style.opacity = "0";
            heroContent.style.transform = "translateY(-20px)"; // Se eleva un poco al irse
        }
    });
}, { threshold: 0.1 });

heroObserver.observe(heroContent);

// Función para el menú móvil
const initMobileMenu = () => {
    const btnOpen = document.querySelector('#menu-open');
    const btnClose = document.querySelector('#menu-close');
    const menu = document.querySelector('#nav-menu');

    if (btnOpen && menu) {
        btnOpen.onclick = (e) => {
            e.preventDefault();
            menu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Bloquea el scroll de fondo
            console.log("Menú abierto correctamente");
        };
    }

    if (btnClose && menu) {
        btnClose.onclick = (e) => {
            e.preventDefault();
            menu.classList.remove('active');
            document.body.style.overflow = 'auto'; // Devuelve el scroll
        };
    }
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

const track = document.getElementById('track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let index = 0;

nextBtn.addEventListener('click', () => {
    const cardWidth = document.querySelector('.product').offsetWidth + 32; // 32 es el gap de 2rem
    const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;

    if (Math.abs(index) < maxScroll) {
        index -= cardWidth;
        track.style.transform = `translateX(${index}px)`;
    } else {
        index = 0;
        track.style.transform = `translateX(0px)`;
    }
});

prevBtn.addEventListener('click', () => {
    const cardWidth = document.querySelector('.product').offsetWidth + 32;

    if (index < 0) {
        index += cardWidth;
        track.style.transform = `translateX(${index}px)`;
    }
});

const observeSection = () => {
    const section = document.querySelector('.anatomy-section');

    const options = {
        root: null,
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, options);

    observer.observe(section);
};


observeSection();