// Seleccionamos los elementos del DOM
const form = document.getElementById("reservaForm");
const tablaReservas = document.getElementById("tablaReservas");
const espacioSelect = document.getElementById("espacio");
const preview = document.getElementById("preview");

// --- Cargar espacios desde el archivo JSON ---
fetch("data/espacios.json")
    .then(res => res.json())
    .then(espacios => {
        espacios.forEach(esp => {
            const option = document.createElement("option");
            option.value = esp.nombre;
            option.textContent = `${esp.nombre} (${esp.tipo})`;
            option.dataset.imagen = esp.imagen;
            espacioSelect.appendChild(option);
        });

        // Cambiar imagen al seleccionar un espacio
        espacioSelect.addEventListener("change", () => {
            const imagen = espacioSelect.selectedOptions[0].dataset.imagen;
            preview.src = imagen || "";
        });
    })
    .catch(err => console.error("Error al cargar espacios:", err));

// --- Función para obtener reservas guardadas ---
function obtenerReservas() {
    return JSON.parse(localStorage.getItem("reservas")) || [];
}

// --- Función para guardar reservas ---
function guardarReservas(reservas) {
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

// --- Mostrar reservas en la tabla ---
function mostrarReservas() {
    const reservas = obtenerReservas();
    tablaReservas.innerHTML = "";
    reservas.forEach((r, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${r.nombre}</td>
            <td>${r.espacio}</td>
            <td>${r.fecha}</td>
            <td>${r.hora}</td>
            <td><button class="eliminar" data-index="${i}">Cancelar</button></td>
        `;
        tablaReservas.appendChild(fila);
    });

    // Agregar eventos a los botones de eliminar
    document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            eliminarReserva(index);
        });
    });
}

// --- Eliminar reserva ---
function eliminarReserva(index) {
    const reservas = obtenerReservas();
    reservas.splice(index, 1);
    guardarReservas(reservas);
    mostrarReservas();
}

// --- Manejar el envío del formulario ---
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const espacio = document.getElementById("espacio").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

        // Validar que la fecha no sea pasada
    const hoy = new Date();
    const fechaSeleccionada = new Date(fecha + "T" + hora);

    if (fechaSeleccionada < hoy) {
        alert("⚠️ No puedes hacer reservas en fechas u horas pasadas.");
        return;
    }

    if (!nombre || !espacio || !fecha || !hora) {
        alert("Por favor completa todos los campos.");
        return;
    }


    const reservas = obtenerReservas();

    // Verificar duplicados o reservas demasiado cercanas
const conflicto = reservas.some(r => {
    if (r.espacio === espacio && r.fecha === fecha) {
        // Convertimos las horas a minutos para compararlas
        const [h1, m1] = r.hora.split(":").map(Number);
        const [h2, m2] = hora.split(":").map(Number);
        const minutos1 = h1 * 60 + m1;
        const minutos2 = h2 * 60 + m2;

        // Diferencia en minutos entre las dos reservas
        const diferencia = Math.abs(minutos1 - minutos2);

        // Si la diferencia es menor a 60, hay conflicto
        return diferencia < 60;
    }
    return false;
});

if (conflicto) {
    alert("⚠️ No puedes reservar ese espacio con menos de 1 hora de diferencia respecto a otra reserva existente.");
    return;
}


    // Crear nueva reserva
    const nueva = { nombre, espacio, fecha, hora };
    reservas.push(nueva);
    guardarReservas(reservas);

    // Actualizar interfaz
    form.reset();
    mostrarReservas();
    alert("✅ Reserva registrada con éxito.");
});

// --- Inicializar ---
mostrarReservas();
