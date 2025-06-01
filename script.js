// Script para Producciones Victoria

// Función para cambiar el estilo de la barra de navegación al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    function checkScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Verificar posición de scroll al cargar
    checkScroll();
    
    // Evento de scroll
    window.addEventListener('scroll', checkScroll);

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cerrar menú móvil al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });

    // Animación de entrada para títulos y subtítulos en hero
    setTimeout(() => {
        const mainTitle = document.querySelector('.main-title');
        const subtitle = document.querySelector('.subtitle');
        const ctaContainer = document.querySelector('.cta-container');
        
        if (mainTitle) mainTitle.classList.add('animated');
        if (subtitle) subtitle.classList.add('animated');
        if (ctaContainer) ctaContainer.classList.add('animated');
    }, 500);
    
    // Animación al hacer scroll para elementos
    const revealElements = document.querySelectorAll('.reveal-title, .servicio-card');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 150) {
                if (element.classList.contains('reveal-title')) {
                    element.classList.add('visible');
                } else if (element.classList.contains('servicio-card')) {
                    element.classList.add('visible');
                    
                    // Crear un pequeño retraso entre cada tarjeta
                    const index = Array.from(element.parentNode.children).indexOf(element);
                    element.style.transitionDelay = (index * 0.1) + 's';
                }
            }
        });
    }
    
    // Verificar posición inicial
    setTimeout(revealOnScroll, 300);
    
    // Evento de scroll para animar elementos
    window.addEventListener('scroll', revealOnScroll);

    // Inicializar carrusel con opciones avanzadas
    const serviciosCarousel = document.getElementById('serviciosCarousel');
    if (serviciosCarousel) {
        const carousel = new bootstrap.Carousel(serviciosCarousel, {
            interval: 6000,
            touch: true
        });

        // Añadir efectos de animación al cambiar slides
        serviciosCarousel.addEventListener('slide.bs.carousel', function(e) {
            const activeItem = this.querySelector('.active');
            const cards = activeItem.querySelectorAll('.servicio-card');
            
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(40px)';
            });
        });

        serviciosCarousel.addEventListener('slid.bs.carousel', function(e) {
            const activeItem = this.querySelector('.active');
            const cards = activeItem.querySelectorAll('.servicio-card');
            
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                }, index * 200);
            });
        });

        // Inicializar la animación para la primera slide
        setTimeout(() => {
            const activeItem = serviciosCarousel.querySelector('.active');
            if (activeItem) {
                const cards = activeItem.querySelectorAll('.servicio-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        }, 800);
    }

    // Inicializar Isotope para filtrado de galería
    let galeriaIsotope;
    const galeriaContenedor = document.querySelector('.galeria-contenedor');
    
    if (galeriaContenedor) {
        // Esperar a que las imágenes estén cargadas para inicializar Isotope
        window.addEventListener('load', () => {
            galeriaIsotope = new Isotope(galeriaContenedor, {
                itemSelector: '.galeria-item',
                layoutMode: 'fitRows',
                transitionDuration: '0.6s'
            });

            // Agregar efectos de animación a los elementos
            const galeriaItems = document.querySelectorAll('.galeria-item');
            galeriaItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                }, index * 100);
            });

            // Filtrado de elementos
            const filtros = document.querySelectorAll('.filtro-btn');
            filtros.forEach(filtro => {
                filtro.addEventListener('click', function() {
                    // Remover clase active de todos los botones
                    filtros.forEach(f => f.classList.remove('active'));
                    // Añadir clase active al botón clickeado
                    this.classList.add('active');
                    
                    const filterValue = this.getAttribute('data-filter');
                    
                    if (galeriaIsotope) {
                        galeriaIsotope.arrange({
                            filter: filterValue === '*' ? filterValue : filterValue
                        });
                        
                        // Re-animar los elementos después de filtrar
                        setTimeout(() => {
                            const visibleItems = document.querySelectorAll(filterValue === '*' ? '.galeria-item' : filterValue);
                            visibleItems.forEach((item, index) => {
                                item.style.transition = 'transform 0.4s ease';
                                item.style.transitionDelay = (index * 0.05) + 's';
                                item.style.transform = 'translateY(0) scale(1)';
                                item.style.opacity = '1';
                            });
                        }, 100);
                    }
                });
            });
        });
    }

    // Lightbox para galería
    const lightboxContainer = document.querySelector('.lightbox-container');
    const lightboxMediaContainer = document.querySelector('.lightbox-media-container');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galeriaLinks = document.querySelectorAll('.galeria-link');
    
    let currentIndex = 0;
    const galeriaItems = Array.from(galeriaLinks);
    
    if (lightboxContainer && galeriaLinks.length > 0) {
        // Abrir lightbox al hacer clic en un elemento de la galería
        galeriaLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                currentIndex = index;
                const mediaUrl = this.getAttribute('href');
                const mediaType = this.getAttribute('data-type');
                const title = this.closest('.galeria-overlay').querySelector('h4').textContent;
                const description = this.closest('.galeria-overlay').querySelector('p').textContent;
                
                // Mostrar el lightbox
                showLightboxContent(mediaUrl, mediaType, title, description);
                
                lightboxContainer.style.display = 'flex';
                setTimeout(() => {
                    lightboxContainer.classList.add('active');
                }, 10);
            });
        });
        
        // Cerrar lightbox
        lightboxClose.addEventListener('click', () => {
            lightboxContainer.classList.remove('active');
            setTimeout(() => {
                lightboxContainer.style.display = 'none';
                lightboxMediaContainer.innerHTML = '';
            }, 400);
        });
        
        // Navegación en el lightbox
        lightboxNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % galeriaItems.length;
            const nextLink = galeriaItems[currentIndex];
            const mediaUrl = nextLink.getAttribute('href');
            const mediaType = nextLink.getAttribute('data-type');
            const title = nextLink.closest('.galeria-overlay').querySelector('h4').textContent;
            const description = nextLink.closest('.galeria-overlay').querySelector('p').textContent;
            
            showLightboxContent(mediaUrl, mediaType, title, description);
        });
        
        lightboxPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + galeriaItems.length) % galeriaItems.length;
            const prevLink = galeriaItems[currentIndex];
            const mediaUrl = prevLink.getAttribute('href');
            const mediaType = prevLink.getAttribute('data-type');
            const title = prevLink.closest('.galeria-overlay').querySelector('h4').textContent;
            const description = prevLink.closest('.galeria-overlay').querySelector('p').textContent;
            
            showLightboxContent(mediaUrl, mediaType, title, description);
        });
        
        // Función para mostrar contenido en el lightbox
        function showLightboxContent(url, type, title, description) {
            lightboxMediaContainer.innerHTML = '';
            
            if (type === 'imagen') {
                const img = document.createElement('img');
                img.src = url;
                img.alt = title;
                lightboxMediaContainer.appendChild(img);
            } else if (type === 'video') {
                const iframe = document.createElement('iframe');
                iframe.src = url + '?autoplay=1';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                lightboxMediaContainer.appendChild(iframe);
            }
            
            lightboxCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        }
        
        // Cerrar lightbox con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxContainer.classList.contains('active')) {
                lightboxClose.click();
            }
            
            if (e.key === 'ArrowRight' && lightboxContainer.classList.contains('active')) {
                lightboxNext.click();
            }
            
            if (e.key === 'ArrowLeft' && lightboxContainer.classList.contains('active')) {
                lightboxPrev.click();
            }
        });
    }

    // Funcionalidad botón "Cargar Más"
    const cargarMasBtn = document.querySelector('.cargar-mas');
    if (cargarMasBtn) {
        cargarMasBtn.addEventListener('click', function(e) {
            e.preventDefault();
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Cargando...';
            
            // Simulación de carga (aquí se cargarían más elementos de la galería)
            setTimeout(() => {
                this.innerHTML = 'CARGAR MÁS';
                // Aquí iría la lógica para cargar más elementos
                
                // Ejemplo de mensaje para demostración:
                alert('En una implementación real, aquí se cargarían más elementos de la galería desde el servidor.');
            }, 1500);
        });
    }

    // Animaciones para el sitio
    // Animar elementos de hero section
    const mainTitle = document.querySelector('.main-title');
    const subtitle = document.querySelector('.subtitle');
    const ctaContainer = document.querySelector('.cta-container');
    
    if (mainTitle) mainTitle.classList.add('animated');
    if (subtitle) subtitle.classList.add('animated');
    if (ctaContainer) ctaContainer.classList.add('animated');
    
    // Animar títulos de sección al hacer scroll
    const revealTitles = document.querySelectorAll('.reveal-title');
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    function checkTitles() {
        revealTitles.forEach(title => {
            if (isInViewport(title)) {
                title.classList.add('visible');
            }
        });
    }
    
    checkTitles();
    window.addEventListener('scroll', checkTitles);
    
    // Funcionalidad para los hexágonos de servicios
    const hexItems = document.querySelectorAll('.hexagon-item');
    const serviceDetails = document.querySelectorAll('.service-detail');
    
    if (hexItems.length > 0 && serviceDetails.length > 0) {
        // Activar el primer servicio por defecto
        hexItems[0].classList.add('active');
        
        // Agregar eventos de clic a cada hexágono
        hexItems.forEach(item => {
            item.addEventListener('click', function() {
                const serviceId = this.getAttribute('data-service');
                
                // Desactivar todos los hexágonos y detalles
                hexItems.forEach(hex => hex.classList.remove('active'));
                serviceDetails.forEach(detail => detail.classList.remove('active'));
                
                // Activar el hexágono seleccionado y su detalle correspondiente
                this.classList.add('active');
                document.getElementById(serviceId).classList.add('active');
                
                // Scroll suave hasta el detalle (en móviles)
                if (window.innerWidth < 768) {
                    const detailContainer = document.querySelector('.service-details-container');
                    if (detailContainer) {
                        setTimeout(() => {
                            detailContainer.scrollIntoView({behavior: 'smooth'});
                        }, 100);
                    }
                }
            });
        });
        
        // Añadir efectos hover para los hexágonos en dispositivos táctiles
        hexItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                this.classList.add('hover-effect');
            });
            
            item.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('hover-effect');
                }, 300);
            });
        });
    }
}); 