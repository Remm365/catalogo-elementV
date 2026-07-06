// Esperamos a que todo el HTML esté cargado en el navegador
document.addEventListener("DOMContentLoaded", () => {
    
    // Elementos del DOM con los que interactuaremos
    const productsContainer = document.getElementById("products-container");
    const modal = document.getElementById("product-modal");
    const modalBody = document.getElementById("modal-dynamic-body");
    const closeModalBtn = document.querySelector(".close-modal");
    const modalOverlay = document.querySelector(".modal-overlay");

    // Tu base de datos local (puedes cambiar la ruta si lo metes en una carpeta)
    const jsonUrl = "./data/productos.json"; 
    
    // Variable global para almacenar temporalmente el producto una vez cargado
    let productoDestacado = null;

    // Número de teléfono (cámbialo por el tuyo con código de país, ej: 521234567890 para México)
    const TELEFONO_WHATSAPP = "521234567890";

    /**
     * 1. Carga el producto desde el archivo JSON
     */
    async function cargarProductoDestacado() {
        try {
            const respuesta = await fetch(jsonUrl);
            if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
            
            const datos = await respuesta.json();
            
            // Tomamos el primer producto del JSON (tu paquete de 3)
            productoDestacado = datos[0]; 

            if (productoDestacado) {
                renderizarTarjetaGrande(productoDestacado);
            }
        } catch (error) {
            console.error("Error al cargar el catálogo:", error);
            productsContainer.innerHTML = `
                <p class="error-msg">Por el momento no pudimos cargar nuestra edición destacada. Inténtalo más tarde.</p>
            `;
        }
    }

    /**
     * 2. Renderiza la tarjeta grande premium en el HTML
     */
    function renderizarTarjetaGrande(producto) {
        productsContainer.innerHTML = `
            <article class="product-card card-premium-layout">
                <div class="card-image">
                    <img src="${producto.imagen}" alt="${producto.titulo}">
                </div>
                <div class="card-body">
                    <span class="card-tag">Best Seller</span>
                    <h3 class="product-title">${producto.titulo}</h3>
                    <p class="product-category">${producto.categoria}</p>
                    <p class="product-brief-description">${producto.descripcion}</p>
                    <span class="product-price">$${producto.precio.toFixed(2)} MXN</span>
                    <button class="btn btn-secondary btn-block" id="btn-open-details">
                        Ver Detalles del Paquete
                    </button>
                </div>
            </article>
        `;

        // Añadimos el evento para abrir el modal al botón recién creado
        document.getElementById("btn-open-details").addEventListener("click", abrirModal);
    }

    /**
     * 3. Abre el modal e inyecta la información detallada con el enlace a WhatsApp
     */
    function abrirModal() {
        if (!productoDestacado) return;

        // Mensaje de prueba automatizado codificado para URL (reemplaza los espacios por %20 si lo editas)
        const mensajeWhatsApp = `Hola! Me interesa solicitar información sobre el paquete destacado: ${productoDestacado.titulo} (${productoDestacado.categoria}).`;
        const urlWhatsApp = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensajeWhatsApp)}`;

        // Inyectamos el contenido detallado dentro del cuerpo del modal
        modalBody.innerHTML = `
            <div class="modal-gallery">
                <img src="${productoDestacado.imagen}" alt="${productoDestacado.titulo}">
            </div>
            <div class="modal-info">
                <h2>${productoDestacado.titulo}</h2>
                <span class="modal-price">$${productoDestacado.precio.toFixed(2)} MXN</span>
                <hr class="modal-divider">
                
                <h3>Descripción</h3>
                <p>${productoDestacado.descripcion}</p>
                
                <h3>¿Qué incluye?</h3>
                <ul class="modal-features-list">
                    <li>3 Bóxers de corte clásico premium.</li>
                    <li>Textil transpirable de máxima comodidad.</li>
                    <li>Garantía de ajuste perfecto.</li>
                </ul>

                <!-- Botón de conversión directo a WhatsApp con color personalizado -->
                <a href="${urlWhatsApp}" target="_blank" class="btn btn-whatsapp btn-block">
                    <svg class="icon-ws" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.296 1.48 4.905 1.481 5.322 0 9.65-4.307 9.653-9.61.002-2.569-1.001-4.984-2.825-6.81C16.556 2.39 14.152 1.39 11.63 1.39c-5.332 0-9.662 4.308-9.664 9.614 0 1.674.466 3.312 1.344 4.743L2.31 21.65l6.337-1.656z"/>
                    </svg>
                    Ordenar por WhatsApp (Mensaje Automático)
                </a>
            </div>
        `;

        // Mostramos el modal añadiendo una clase activa para controlar la transición en CSS
        modal.classList.add("is-visible");
        document.body.style.overflow = "hidden"; // Evita que la página del fondo se mueva
    }

    /**
     * 4. Cierra el modal de forma limpia
     */
    function cerrarModal() {
        modal.classList.remove("is-visible");
        document.body.style.overflow = ""; // Devuelve el scroll a la normalidad
    }

    // Eventos para cerrar el modal de distintas formas (clic en la X, afuera en el fondo oscuro o tecla Escape)
    closeModalBtn.addEventListener("click", cerrarModal);
    modalOverlay.addEventListener("click", cerrarModal);
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-visible")) {
            cerrarModal();
        }
    });

    // Inicializamos la app cargando el producto único
    cargarProductoDestacado();
});