// 1. Deja aquí el endpoint de tu API o Base de Datos cuando esté lista
const API_URL = '';

// Datos de respaldo (Mock Data) locales
const backupProducts = [
    {
        id: 1,
        title: "Latte Macchiato",
        description: "Granos de origen único, tostados a la perfección con leche cremosa.",
        price: 10.00,
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    {
        id: 2,
        title: "Capuccino Supremo",
        description: "Equilibrio perfecto entre espresso, leche vaporizada y canela en polvo.",
        price: 12.50,
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    {
        id: 3,
        title: "Americano Intenso",
        description: "Cuerpo profundo con notas sutiles de chocolate amargo y nueces.",
        price: 8.00,
        image: "https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

// Esperar a que el HTML cargue por completo
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderProducts();
});

// Función principal asíncrona
async function fetchAndRenderProducts() {
    const container = document.getElementById('products-container');

    try {
        let products = [];

        // Si definiste una URL, disparamos el fetch hacia tu base de datos
        if (API_URL !== '') {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            products = await response.json();
        } else {
            // Si la URL está en blanco, usamos los datos locales de prueba
            console.warn("API_URL vacía. Cargando productos de prueba locales.");
            products = backupProducts;
        }

        // Mandamos los productos a pintar en el HTML
        renderGrid(products, container);

    } catch (error) {
        console.error('Error al obtener productos:', error);
        container.innerHTML = `<p style="color: white; grid-column: 1/-1; text-align: center;">No se pudieron cargar los productos en este momento.</p>`;
    }
}

// Función encargada de clonar el template e inyectar los datos
function renderGrid(productsList, targetContainer) {
    targetContainer.innerHTML = ''; // Limpiamos cargadores previos

    const template = document.getElementById('product-card-template');

    productsList.forEach(product => {
        // Clonamos la estructura interna del molde (<template>)
        const cardClone = template.content.cloneNode(true);

        // Buscamos los elementos internos del clon y los rellenamos con la data
        const img = cardClone.querySelector('.product-image img');
        img.src = product.image;
        img.alt = product.title;

        cardClone.querySelector('.product-title').textContent = product.title;
        cardClone.querySelector('.product-description').textContent = product.description;
        cardClone.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;

        // Opcional: Le asignamos el ID del producto al botón para cuando hagas la lógica del carrito
        const actionButton = cardClone.querySelector('.btn-primary');
        actionButton.setAttribute('data-id', product.id);

        // Añadimos la tarjeta lista al contenedor visible de tu página
        targetContainer.appendChild(cardClone);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // ... Tus inicializaciones anteriores (fetch, menú móvil, etc.) ...

    initPriceSlider();
});


function initPriceSlider() {
    // Seleccionamos los elementos usando las clases de tu HTML
    const thumbLeft = document.querySelector('.thumb-left');
    const thumbRight = document.querySelector('.thumb-right');
    const track = document.querySelector('.slider-track');
    const priceDisplay = document.querySelector('.price-range-header span:last-child'); // El que dice $0-100

    // Margen mínimo de diferencia entre ambos tiradores (para que no se encimen por completo)
    const minGap = 5;

    function updateSlider() {
        // 1. Obtener los valores actuales como números enteros
        let valLeft = parseInt(thumbLeft.value);
        let valRight = parseInt(thumbRight.value);

        // 2. Validar que no se crucen los tiradores
        if (valRight - valLeft < minGap) {
            // Si el de la izquierda empuja al de la derecha
            if (document.activeElement === thumbLeft) {
                thumbLeft.value = valRight - minGap;
                valLeft = valRight - minGap;
            } else {
                // Si el de la derecha empuja al de la izquierda
                thumbRight.value = valLeft + minGap;
                valRight = valLeft + minGap;
            }
        }

        // 3. Actualizar el texto en el HTML dinámicamente con los números
        priceDisplay.textContent = `$${valLeft}-${valRight}`;

        // 4. Mover la barra visual (.slider-track) usando porcentajes
        // Asumiendo que el mínimo es 0 y el máximo es 100
        const percentLeft = (valLeft / thumbLeft.max) * 100;
        const percentRight = (valRight / thumbRight.max) * 100;

        track.style.left = percentLeft + '%';
        track.style.right = (100 - percentRight) + '%';
    }

    // Escuchar el evento 'input' en ambos tiradores para que cambie en tiempo real mientras arrastras
    if (thumbLeft && thumbRight && track && priceDisplay) {
        thumbLeft.addEventListener('input', updateSlider);
        thumbRight.addEventListener('input', updateSlider);

        // Ejecutar una vez al cargar la página para posicionar la barra inicial
        updateSlider();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ... Tus otras inicializaciones (fetch, slider, etc.) ...

    initSortButtons();
});

function initSortButtons() {
    // Seleccionamos todos los botones de ordenamiento
    const sortButtons = document.querySelectorAll('.sort-options .sort-btn');

    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Si el botón ya está activo, no hacemos nada
            if (button.classList.contains('active')) return;

            // 2. Removemos la clase 'active' de TODOS los botones
            sortButtons.forEach(btn => {
                btn.classList.remove('active');

                // Limpiamos cualquier "✓ " previo para que no se duplique
                btn.textContent = btn.textContent.replace('✓ ', '');
            });

            // 3. Añadimos la clase 'active' al botón que recibió el clic
            button.classList.add('active');

            // 4. Le agregamos el símbolo del check al inicio de su texto actual
            button.textContent = `✓ ${button.textContent}`;

            // 5. Opcional: Aquí dispararás la lógica para reordenar tus productos más adelante
            const criterio = button.textContent.replace('✓ ', '').trim();
            console.log(`Ordenando productos por: ${criterio}`);
        });
    });
}

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
