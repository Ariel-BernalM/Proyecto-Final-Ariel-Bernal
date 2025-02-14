
/////////////////Listado de Tabla con Carrito
function cargarCarritoDataTable() {
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
    cargarTotalEnFormulario();  // Agrega esta línea
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


document.getElementById("vaciarCarro").addEventListener("click", function () {
    localStorage.removeItem("carrito");
    cargarCarritoDataTable(); 
});


document.addEventListener("DOMContentLoaded", cargarCarritoDataTable);


/////////////////////////////////////////////////Finalización de Compra////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    const tarjetaInput = document.getElementById("tarjeta");
    tarjetaInput.addEventListener("input", formatearTarjeta);
});

/////////////////Trae los datos del Total en un texto
function cargarTotalEnFormulario() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    document.getElementById("totalCompra").value = `$${total.toFixed(2)}`;
}

/////////////////Guarda la información en local Storage y deja vacio el carro
function procesarCompra(event) {
    event.preventDefault();

    
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let direccion = document.getElementById("direccion").value;
    let tarjeta = document.getElementById("tarjeta").value;
    let total = document.getElementById("totalCompra").value;

    
    if (!/^[a-zA-Z\s]+$/.test(nombre)) {
        Swal.fire({
            icon: "error",
            title: "Nombre inválido",
            text: "El nombre solo puede contener letras.",
        });
        return;
    }

    
    if (!/^\d{16}$/.test(tarjeta.replace(/\s+/g, ''))) {
        Swal.fire({
            icon: "error",
            title: "Tarjeta inválida",
            text: "La tarjeta debe tener 16 dígitos.",
        });
        return;
    }

    
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Carrito vacío",
            text: "Agrega productos antes de comprar.",
        });
        return;
    }

    
    let compra = {
        nombre,
        email,
        direccion,
        tarjeta,
        total,
        productos: carrito,
        fecha: new Date().toLocaleString(),
    };

    
    let compras = JSON.parse(localStorage.getItem("compras")) || [];
    compras.push(compra);
    localStorage.setItem("compras", JSON.stringify(compras));

    
    localStorage.removeItem("carrito");
    cargarCarritoDataTable();
    actualizarTotalCarrito();

    
    let modal = bootstrap.Modal.getInstance(document.getElementById("modalCompra"));
    modal.hide();

    
    Swal.fire({
        icon: "success",
        title: "¡Compra realizada con éxito!",
        text: "Revisa tu correo para más detalles.",
        confirmButtonColor: "#28a745",
    });

    
    document.getElementById("formCompra").reset();
}


function formatearTarjeta(event) {
    let tarjeta = event.target.value.replace(/\D/g, ''); 
    tarjeta = tarjeta.replace(/(\d{4})(?=\d)/g, '$1 '); 
    event.target.value = tarjeta;
}











