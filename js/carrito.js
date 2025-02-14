
async function cargarCarritoDataTable() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if ($.fn.dataTable.isDataTable("#tabla-carrito")) {
        $("#tabla-carrito").DataTable().clear().destroy();
    }
    $("#tabla-carrito").DataTable({
        data: carrito,
        columns: [
            { data: "id" },
            { data: "titulo" },
            {
                data: "imagen",
                render: function (data, type, row) {
                    return `<img src="${data}" style="width: 50px; height: 50px; object-fit: cover;" alt="Producto">`;
                },
                orderable: false
            },
            { data: "precio", render: function (data) { return `$${data}`; } },
            {
                data: "cantidad",
                render: function (data, type, row, meta) {
                    return `
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-primary me-1" onclick="modificarCantidad(${meta.row}, -1)">-</button>
                            <span id="cantidad-${meta.row}">${data}</span>
                            <button class="btn btn-sm btn-primary ms-1" onclick="modificarCantidad(${meta.row}, 1)">+</button>
                        </div>
                    `;
                },
                orderable: false
            },
            { 
                data: null,
                render: function (data, type, row) {
                    return `<span id="total-${row.id}">$${(row.precio * row.cantidad).toFixed(2)}</span>`;
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `<button class="btn btn-danger btn-sm" onclick="eliminarProducto(${meta.row})">Eliminar</button>`;
                },
                orderable: false
            }
        ],
        order: [[1, "asc"]],
        pageLength: 5,
        lengthChange: false,
        searching: true,
        paging: true,
        info: true,
        autoWidth: false,
        responsive: true,
        language: {
            sEmptyTable: "No hay productos en el carrito",
            sInfo: "Mostrando _START_ a _END_ de _TOTAL_ productos",
            sInfoEmpty: "Mostrando 0 a 0 de 0 productos",
            sInfoFiltered: "(filtrado de _MAX_ productos totales)",
            sSearch: "Buscar:",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior",
            },
        },
    });
    actualizarTotalCarrito();
}

function modificarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad < 1) carrito[index].cantidad = 1; 

        localStorage.setItem('carrito', JSON.stringify(carrito)); 
        cargarCarritoDataTable();
        
    }
}

function actualizarTotalCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    document.getElementById("carroTotal").innerText = `Total: $${total.toFixed(2)}`;
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarritoDataTable();
}

// Función para vaciar el carrito completamente
document.getElementById("vaciarCarro").addEventListener("click", function () {
    localStorage.removeItem("carrito");
    cargarCarritoDataTable(); 
});


document.addEventListener("DOMContentLoaded", cargarCarritoDataTable);


/////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    const tarjetaInput = document.getElementById("tarjeta");
    tarjetaInput.addEventListener("input", formatearTarjeta);
});

// Cargar el total en el formulario de compra
function cargarTotalEnFormulario() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    document.getElementById("totalCompra").value = `$${total.toFixed(2)}`;
}

// Procesar la compra con SweetAlert2
function procesarCompra(event) {
    event.preventDefault();

    // Obtener datos del formulario
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let direccion = document.getElementById("direccion").value;
    let tarjeta = document.getElementById("tarjeta").value;
    let total = document.getElementById("totalCompra").value;

    // Validar nombre (solo letras)
    if (!/^[a-zA-Z\s]+$/.test(nombre)) {
        Swal.fire({
            icon: "error",
            title: "Nombre inválido",
            text: "El nombre solo puede contener letras.",
        });
        return;
    }

    // Validar tarjeta de crédito (solo números y 16 dígitos)
    if (!/^\d{16}$/.test(tarjeta.replace(/\s+/g, ''))) {
        Swal.fire({
            icon: "error",
            title: "Tarjeta inválida",
            text: "La tarjeta debe tener 16 dígitos.",
        });
        return;
    }

    // Obtener carrito
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Carrito vacío",
            text: "Agrega productos antes de comprar.",
        });
        return;
    }

    // Crear objeto de compra
    let compra = {
        nombre,
        email,
        direccion,
        tarjeta,
        total,
        productos: carrito,
        fecha: new Date().toLocaleString(),
    };

    // Guardar en LocalStorage
    let compras = JSON.parse(localStorage.getItem("compras")) || [];
    compras.push(compra);
    localStorage.setItem("compras", JSON.stringify(compras));

    // Vaciar carrito
    localStorage.removeItem("carrito");
    cargarCarritoDataTable();
    actualizarTotalCarrito();

    // Cerrar el modal
    let modal = bootstrap.Modal.getInstance(document.getElementById("modalCompra"));
    modal.hide();

    // Mostrar mensaje de éxito
    Swal.fire({
        icon: "success",
        title: "¡Compra realizada con éxito!",
        text: "Revisa tu correo para más detalles.",
        confirmButtonColor: "#28a745",
    });

    // Resetear formulario
    document.getElementById("formCompra").reset();
}

// Formatear la tarjeta de crédito con espacios cada 4 dígitos
function formatearTarjeta(event) {
    let tarjeta = event.target.value.replace(/\D/g, ''); // Elimina todo lo que no sean números
    tarjeta = tarjeta.replace(/(\d{4})(?=\d)/g, '$1 '); // Añade un espacio cada 4 dígitos
    event.target.value = tarjeta;
}











