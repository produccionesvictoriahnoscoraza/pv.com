/* Scripts para la página de contacto */
document.addEventListener("DOMContentLoaded", function() {
    // Inicializar componentes del cotizador
    initializeCotizador();
    
    // Inicializar formulario de contacto
    initializeContactForm();
    
    // Animar títulos al hacer scroll
    animateTitlesOnScroll();
});

/* ----- ANIMACIÓN DE TÍTULOS ----- */
function animateTitlesOnScroll() {
    // Seleccionar todos los títulos con clase reveal-title
    const revealTitles = document.querySelectorAll('.reveal-title');
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9
        );
    }
    
    // Función para verificar elementos visibles
    function checkVisibleElements() {
        revealTitles.forEach(title => {
            if (isInViewport(title) && !title.classList.contains('visible')) {
                title.classList.add('visible');
            }
        });
    }
    
    // Ejecutar la primera vez
    checkVisibleElements();
    
    // Agregar listener para scroll
    window.addEventListener('scroll', checkVisibleElements);
}

/* ----- SIMULADOR DE COTIZACIÓN ----- */
function initializeCotizador() {
    // Objeto para almacenar la cotización actual
    const cotizacion = {
        servicios: {},
        tipoEvento: '',
        asistentes: '',
        fecha: '',
        duracion: 0,
        detalles: '',
        total: 0
    };
    
    // Precios base por servicio
    const precios = {
        escenario: 15000,
        audio: 12000,
        iluminacion: 10000,
        pantallas: 8000,
        generador: 5000,
        personal: 6000
    };
    
    // Multiplicadores por tipo de evento
    const multiplicadorEvento = {
        concierto: 1.2,
        corporativo: 1.0,
        social: 0.9,
        festival: 1.3,
        otro: 1.0
    };
    
    // Multiplicadores por cantidad de asistentes
    const multiplicadorAsistentes = {
        pequeno: 0.8,
        mediano: 1.0,
        grande: 1.3,
        enorme: 1.5
    };

    // ----- Navegación entre paneles del cotizador -----
    const cotizadorTabs = document.querySelectorAll('.cotizador-tab');
    const cotizadorPanels = document.querySelectorAll('.cotizador-panel');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('[data-prev]');
    
    // Switch entre tabs
    cotizadorTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Botones "Siguiente"
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nextPanel = button.dataset.next;
            if (nextPanel === 'resultado') {
                // Si vamos a mostrar el resultado, calcular la cotización
                calcularCotizacion();
            }
            switchTab(nextPanel);
        });
    });
    
    // Botones "Anterior"
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prevPanel = button.dataset.prev;
            switchTab(prevPanel);
        });
    });
    
    // Botón nueva cotización
    document.getElementById('btnNuevaCotizacion').addEventListener('click', resetCotizador);
    
    // Función para cambiar de tab
    function switchTab(tabId) {
        cotizadorTabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        cotizadorPanels.forEach(panel => {
            if (panel.id === `panel-${tabId}`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }
    
    // ----- Checkboxes de servicios -----
    const servicioCheckboxes = document.querySelectorAll('.form-check-input');
    
    servicioCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const servicio = checkbox.value;
            if (checkbox.checked) {
                cotizacion.servicios[servicio] = precios[servicio];
            } else {
                delete cotizacion.servicios[servicio];
            }
        });
    });
    
    // ----- Input fields del paso 2 -----
    document.getElementById('tipoEvento').addEventListener('change', function() {
        cotizacion.tipoEvento = this.value;
    });
    
    document.getElementById('asistentes').addEventListener('change', function() {
        cotizacion.asistentes = this.value;
    });
    
    document.getElementById('fechaEvento').addEventListener('change', function() {
        cotizacion.fecha = this.value;
    });
    
    document.getElementById('duracionEvento').addEventListener('change', function() {
        cotizacion.duracion = parseInt(this.value) || 0;
    });
    
    document.getElementById('detallesAdicionales').addEventListener('change', function() {
        cotizacion.detalles = this.value;
    });
    
    // ----- Cálculo de la cotización -----
    function calcularCotizacion() {
        // Inicializar total
        let total = 0;
        
        // Sumar precios de los servicios seleccionados
        for (const servicio in cotizacion.servicios) {
            total += cotizacion.servicios[servicio];
        }
        
        // Aplicar multiplicador por tipo de evento
        if (cotizacion.tipoEvento && multiplicadorEvento[cotizacion.tipoEvento]) {
            total *= multiplicadorEvento[cotizacion.tipoEvento];
        }
        
        // Aplicar multiplicador por cantidad de asistentes
        if (cotizacion.asistentes && multiplicadorAsistentes[cotizacion.asistentes]) {
            total *= multiplicadorAsistentes[cotizacion.asistentes];
        }
        
        // Ajustar por duración del evento (por cada hora adicional +10%)
        if (cotizacion.duracion > 1) {
            total *= (1 + (cotizacion.duracion - 1) * 0.1);
        }
        
        // Redondear a enteros para simplificar
        total = Math.round(total);
        
        // Guardar el total
        cotizacion.total = total;
        
        // Actualizar la UI
        actualizarResultadoCotizacion();
    }
    
    // ----- Actualizar la UI con el resultado -----
    function actualizarResultadoCotizacion() {
        // Lista de servicios seleccionados
        const listaServicios = document.querySelector('.servicios-seleccionados');
        listaServicios.innerHTML = '';
        
        // Mapeo de nombres de servicio para mostrar
        const nombreServicios = {
            escenario: 'Escenario',
            audio: 'Audio Profesional',
            iluminacion: 'Iluminación',
            pantallas: 'Pantallas LED',
            generador: 'Generadores',
            personal: 'Personal Técnico'
        };
        
        // Agregar cada servicio seleccionado
        for (const servicio in cotizacion.servicios) {
            const li = document.createElement('li');
            li.innerHTML = `<span>${nombreServicios[servicio]}</span> <span>$${cotizacion.servicios[servicio].toLocaleString()} MXN</span>`;
            listaServicios.appendChild(li);
        }
        
        // Mapeo de nombre de tipo de evento
        const nombresEvento = {
            concierto: 'Concierto',
            corporativo: 'Evento Corporativo',
            social: 'Evento Social',
            festival: 'Festival',
            otro: 'Otro'
        };
        
        // Mapeo de nombre de cantidad de asistentes
        const nombresAsistentes = {
            pequeno: 'Menos de 100 personas',
            mediano: '100 - 500 personas',
            grande: '501 - 1000 personas',
            enorme: 'Más de 1000 personas'
        };
        
        // Actualizar detalles del evento
        document.getElementById('resultTipoEvento').textContent = 
            cotizacion.tipoEvento ? nombresEvento[cotizacion.tipoEvento] : '-';
        
        document.getElementById('resultAsistentes').textContent = 
            cotizacion.asistentes ? nombresAsistentes[cotizacion.asistentes] : '-';
        
        document.getElementById('resultFecha').textContent = 
            cotizacion.fecha ? formatearFecha(cotizacion.fecha) : '-';
        
        document.getElementById('resultDuracion').textContent = 
            cotizacion.duracion > 0 ? `${cotizacion.duracion} hora(s)` : '-';
        
        // Actualizar precio total
        document.getElementById('precioTotal').textContent = 
            `$${cotizacion.total.toLocaleString()} MXN`;
    }
    
    // Formatear fecha para mostrar
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-MX', options);
    }
    
    // Resetear el cotizador
    function resetCotizador() {
        // Limpiar objeto de cotización
        for (const key in cotizacion.servicios) {
            delete cotizacion.servicios[key];
        }
        cotizacion.tipoEvento = '';
        cotizacion.asistentes = '';
        cotizacion.fecha = '';
        cotizacion.duracion = 0;
        cotizacion.detalles = '';
        cotizacion.total = 0;
        
        // Desmarcar checkboxes
        servicioCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Resetear formularios
        document.getElementById('tipoEvento').value = '';
        document.getElementById('asistentes').value = '';
        document.getElementById('fechaEvento').value = '';
        document.getElementById('duracionEvento').value = '';
        document.getElementById('detallesAdicionales').value = '';
        
        // Volver al primer paso
        switchTab('servicios');
    }
    
    // Botón para enviar cotización por email
    document.getElementById('btnEnviarCotizacion').addEventListener('click', function() {
        const email = document.getElementById('emailCotizacion').value;
        if (email.trim() === '') {
            alert('Por favor ingresa tu correo electrónico');
            return;
        }
        
        // Aquí se podría implementar el envío real del correo
        alert(`La cotización ha sido enviada a ${email}. Gracias por tu interés.`);
    });
}

/* ----- FORMULARIO DE CONTACTO ----- */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const nombre = document.getElementById('nombreCompleto').value;
            const email = document.getElementById('emailContacto').value;
            const telefono = document.getElementById('telefonoContacto').value;
            const asunto = document.getElementById('asuntoContacto').value;
            const mensaje = document.getElementById('mensajeContacto').value;
            
            // Aquí se podría implementar el envío real del formulario
            // Por ahora, mostrar un mensaje de éxito
            alert(`Gracias ${nombre}. Tu mensaje ha sido enviado. Te contactaremos pronto.`);
            contactForm.reset();
        });
    }
} 