
let juegos = [];

/////////////////Obteniene el Listado de los juegos
async function obtenerJuegos() {
    const juegosGuardados = localStorage.getItem("juegos");

    if (juegosGuardados) {
        juegos = JSON.parse(juegosGuardados);
    } else {
        try {
            const response = await fetch("./db/juegos.json");
            if (!response.ok) {
                throw new Error("Error al cargar los juegos");
            }
            juegos = await response.json();
            localStorage.setItem("juegos", JSON.stringify(juegos)); 
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudieron cargar los juegos",
                icon: "error",
            });
            console.error("Hubo un problema al obtener los juegos:", error);
        }
    }
}


function actualizarStorageYTabla() {
    localStorage.setItem("juegos", JSON.stringify(juegos));
    cargarDataTable();
}

/////////////////Listado de Juegos en DataTable
async function cargarDataTable() {
    if (juegos.length === 0) {
        await obtenerJuegos();
    }
    if ($.fn.dataTable.isDataTable("#tabla-juegos")) {
        $("#tabla-juegos").DataTable().clear().destroy();
    }

    $("#tabla-juegos").DataTable({
        data: juegos,
        columns: [
            { data: "id" },
            { data: "titulo" },
            { data: "descripcion" },
            { data: "plataforma" },
            { data: "precio" },
            { data: "stock" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-success" onclick="verDetalles(${row.id})">Editar</button>
                        <button class="btn btn-danger" onclick="eliminarJuego(${row.id})">Eliminar</button>
                    `;
                },
                orderable: false,
            },
        ],
        order: [[0, "asc"]],
        pageLength: 8,
        lengthChange: false,
        searching: true,
        paging: true,
        info: true,
        autoWidth: false,
        responsive: true,
        language: {
            sEmptyTable: "No hay datos disponibles en la tabla",
            sInfo: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            sInfoEmpty: "Mostrando 0 a 0 de 0 entradas",
            sInfoFiltered: "(filtrado de _MAX_ entradas totales)",
            sSearch: "Buscar:",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior",
            },
        },
    });
}


async function eliminarJuego(id) {
    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Este cambio no se puede revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
    });

    if (result.isConfirmed) {
        juegos = juegos.filter((juego) => juego.id !== id);
        actualizarStorageYTabla();
        Swal.fire("Eliminado", "Juego eliminado con éxito.", "success");
    }
}


function verDetalles(id) {
    const juego = juegos.find(j => j.id === id);

    if (!juego) {
        Swal.fire("Error", "No se encontró el juego", "error");
        return;
    }

    document.getElementById("editId").value = juego.id;
    document.getElementById("editTitulo").value = juego.titulo;
    document.getElementById("editDescripcion").value = juego.descripcion;
    document.getElementById("editPlataforma").value = juego.plataforma;
    document.getElementById("editPrecio").value = juego.precio;
    document.getElementById("editStock").value = juego.stock;

    
    const imgPreview = document.getElementById("editImagenPreview");
    imgPreview.src = juego.imagen ? juego.imagen : "./img/default.jpg";

    let modal = new bootstrap.Modal(document.getElementById("modalEditarJuego"));
    modal.show();
}


/////////////////Evento al usar form EditarJuego
document.getElementById("formEditarJuego").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = parseInt(document.getElementById("editId").value);
    const titulo = document.getElementById("editTitulo").value;
    const descripcion = document.getElementById("editDescripcion").value;
    const plataforma = document.getElementById("editPlataforma").value;
    const precio = parseFloat(document.getElementById("editPrecio").value);
    const stock = parseInt(document.getElementById("editStock").value);

    const index = juegos.findIndex(j => j.id === id);
    if (index !== -1) {
        
        const nuevaImagen = document.getElementById("editImagen").files[0];
        if (nuevaImagen) {
            const reader = new FileReader();
            reader.readAsDataURL(nuevaImagen);
            reader.onload = function () {
                juegos[index] = {
                    id,
                    titulo,
                    descripcion,
                    plataforma,
                    precio,
                    stock,
                    imagen: reader.result 
                };

                actualizarStorageYTabla();
                cerrarModalEdicion();
            };
        } else {
            juegos[index] = { id, titulo, descripcion, plataforma, precio, stock, imagen: juegos[index].imagen };
            actualizarStorageYTabla();
            cerrarModalEdicion();
        }
    }
});


function cerrarModalEdicion() {
    let modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarJuego"));
    modal.hide();
    Swal.fire("Éxito", "Juego actualizado correctamente", "success");
}


function añadirJuego() {
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const plataforma = document.getElementById("plataforma").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const imagenInput = document.getElementById("imagen");
    const imagenFile = imagenInput.files[0];

    if (precio < 1 || stock < 0 || !imagenFile) {
        Swal.fire("Atención!!", "Verifica los datos ingresados", "warning");
        return;
    }

    const fileExtension = imagenFile.name.split(".").pop().toLowerCase();
    if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
        Swal.fire("Atención!!", "Formato de imagen no válido.", "warning");
        return;
    }

    
    const reader = new FileReader();
    reader.readAsDataURL(imagenFile);
    reader.onload = function () {
        const imagenBase64 = reader.result; 

        let nuevoId = juegos.length > 0 ? Math.max(...juegos.map(j => j.id)) + 1 : 1;

        const nuevoJuego = { id: nuevoId, titulo, descripcion, plataforma, precio, stock, imagen: imagenBase64 };

        juegos.push(nuevoJuego);
        actualizarStorageYTabla();

        let modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregarJuego"));
        modal.hide();

        document.getElementById("formAgregarJuego").reset();
        Swal.fire("Éxito", "Juego añadido correctamente", "success");
    };

    reader.onerror = function (error) {
        console.error("Error al leer la imagen:", error);
        Swal.fire("Error", "No se pudo procesar la imagen", "error");
    };
}


/////////////////Evento que lista los datos
document.addEventListener("DOMContentLoaded", cargarDataTable);
