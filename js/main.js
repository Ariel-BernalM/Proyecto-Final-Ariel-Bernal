const juegos = [
  {
    id: 1,
    titulo: "The Legend of Zelda Breath Of the Wild",
    descripcion: "Un juego de aventura épico.",
    precio: 40,
    imagen: "./img/imagen1.jpg",
    plataforma: "Nintendo Switch",
  },
  {
    id: 2,
    titulo: "Super Mario Odyssey",
    descripcion: "Un juego de plataformas.",
    precio: 40,
    imagen: "./img/imagen2.jpg",
    plataforma: "Nintendo Switch",
  },
  {
    id: 3,
    titulo: "Minecraft",
    descripcion: "Explora y construye en un mundo infinito.",
    precio: 20,
    imagen: "./img/imagen3.jpg",
    plataforma: "Multiplataforma",
  },
  {
    id: 4,
    titulo: "Call of Duty",
    descripcion: "Acción y disparos en primera persona.",
    precio: 40,
    imagen: "./img/imagen4.jpg",
    plataforma: "PlayStation, Xbox, PC",
  },
  {
    id: 5,
    titulo: "EA Sports FC 25",
    descripcion: "El mejor simulador de fútbol.",
    precio: 50,
    imagen: "./img/imagen5.jpg",
    plataforma: "Multiplataforma",
  },
  {
    id: 6,
    titulo: "Animal Crossing new horizons",
    descripcion: "Crea tu propia isla en este relajante juego.",
    precio: 25,
    imagen: "./img/imagen6.jpg",
    plataforma: "Nintendo Switch",
  },
  {
    id: 7,
    titulo: "Fortnite Transformers Pack",
    descripcion: "Batalla campal con emocionantes partidas.",
    precio: 20,
    imagen: "./img/imagen7.jpg",
    plataforma: "Multiplataforma",
  },
  {
    id: 8,
    titulo: "Among Us",
    descripcion: "Descubre al impostor en este juego social.",
    precio: 5,
    imagen: "./img/imagen8.jpg",
    plataforma: "Multiplataforma",
  },
  {
    id: 9,
    titulo: "Hollow Knight",
    descripcion: "Explora un mundo oscuro y lleno de secretos.",
    precio: 15,
    imagen: "./img/imagen9.jpg",
    plataforma: "Multiplataforma",
  },
  {
    id: 10,
    titulo: "Red Dead Redemption 2",
    descripcion: "Un épico juego de mundo abierto en el viejo oeste.",
    precio: 60,
    imagen: "./img/imagen10.jpg",
    plataforma: "PlayStation, Xbox, PC",
  },
];

// Seleccionar el contenedor
const contenedorJuegos = document.getElementById("contenedorJuegos");

function mostrarJuegos(juegos) {
  contenedorJuegos.innerHTML = "";
  juegos.forEach((juego) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("col", "d-flex", "justify-content-center", "mb-4");
    tarjeta.innerHTML = `
      <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
        <h5 class="card-title pt-2 text-center text-white">${juego.titulo}</h5>
        <img src="${juego.imagen}" width="200px" height="350px" class="card-img-top" alt="${juego.titulo}">
        <div class="card-body">
          <p class="card-text text-white-50 description">${juego.descripcion}</p>
          <h5 class="text-primary">Precio: <span class="precio">$${juego.precio}</span></h5>
          <p class="card-text text-white-50"><strong>Plataforma:</strong> ${juego.plataforma}</p>
          <div class="d-grid gap-2">
            <button class="btn btn-primary button" data-id="${juego.id}">Añadir a Carrito</button>
          </div>
        </div>
      </div>
    `;
    contenedorJuegos.appendChild(tarjeta);
  });
}

//******************************************************FIltros************************************************

function filtrarPorNombre(nombre) {
  return juegos.filter((juego) =>
    juego.titulo.toLowerCase().includes(nombre.toLowerCase())
  );
}

function ordenarPorPrecio(juegos, orden) {
  return juegos
    .slice()
    .sort((a, b) =>
      orden === "asc" ? a.precio - b.precio : b.precio - a.precio
    );
}

function ordenarPorNombre(juegos, orden) {
  return juegos
    .slice()
    .sort((a, b) =>
      orden === "asc"
        ? a.titulo.localeCompare(b.titulo)
        : b.titulo.localeCompare(a.titulo)
    );
}

function filtrarPorPlataforma(plataforma) {
  if (plataforma === "default") {
    return juegos;
  }
  return juegos.filter((juego) => juego.plataforma === plataforma);
}

const buscador = document.getElementById("buscador");
const selectPrecio = document.getElementById("ordenar-precio");
const selectNombre = document.getElementById("ordenar-nombre");
const selectPlataforma = document.getElementById("filtrar-plataforma");

function aplicarFiltros() {
  const filtroNombre = buscador.value.toLowerCase();
  const filtroPrecio = selectPrecio.value;
  const filtroNombreOrden = selectNombre.value;
  const filtroPlataforma = selectPlataforma.value;

  let juegosFiltrados = [...juegos];

  const filtros = [
    { tipo: "plataforma", valor: filtroPlataforma },
    { tipo: "nombre", valor: filtroNombre },
    { tipo: "precio", valor: filtroPrecio },
    { tipo: "nombreOrden", valor: filtroNombreOrden },
  ];

  filtros.forEach((filtro) => {
    switch (filtro.tipo) {
      case "plataforma":
        if (filtro.valor !== "default") {
          juegosFiltrados = filtrarPorPlataforma(filtro.valor);
        }
        break;

      case "nombre":
        if (filtro.valor) {
          juegosFiltrados = juegosFiltrados.filter((juego) =>
            juego.titulo.toLowerCase().includes(filtro.valor)
          );
        }
        break;

      case "precio":
        if (filtro.valor !== "default") {
          juegosFiltrados = ordenarPorPrecio(juegosFiltrados, filtro.valor);
        }
        break;

      case "nombreOrden":
        if (filtro.valor !== "default") {
          juegosFiltrados = ordenarPorNombre(juegosFiltrados, filtro.valor);
        }
        break;

      default:
        break;
    }
  });

  
  mostrarJuegos(juegosFiltrados);
}


buscador.addEventListener("input", aplicarFiltros);
selectPrecio.addEventListener("change", aplicarFiltros);
selectNombre.addEventListener("change", aplicarFiltros);
selectPlataforma.addEventListener("change", aplicarFiltros);


mostrarJuegos(juegos);


//******************************************************Añadir Carro************************************************

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const tbody = document.querySelector(".tbody");
const itemCartTotal = document.querySelector(".itemCartTotal");

function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function añadirAlCarrito(idJuego) {
  const juegoSeleccionado = juegos.find((juego) => juego.id == idJuego);

  const itemEnCarrito = carrito.find((item) => item.id == idJuego);

  if (itemEnCarrito) {
    itemEnCarrito.cantidad++;
  } else {
    carrito.push({ ...juegoSeleccionado, cantidad: 1 });
  }

  // Mostrar alerta de producto añadido
  const alertaAñadido = document.getElementById("productoAgregado");
  alertaAñadido.classList.remove("hide");
  setTimeout(() => alertaAñadido.classList.add("hide"), 3000);

  actualizarCarrito();
}

//******************************************************Actualizar Carro************************************************
function actualizarCarrito() {
  tbody.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${item.titulo}</td>
      <td>$${item.precio}</td>
      <td>${item.cantidad}</td>
      <td>
        <button class="btn btn-danger btn-sm eliminar" data-id="${
          item.id
        }">X</button>
      </td>
    `;

    total += item.precio * item.cantidad;
    tbody.appendChild(fila);
  });

  itemCartTotal.textContent = `Total: $${total}`;

  // Guardar el carrito en Local Storage
  guardarCarritoEnLocalStorage();

  const botonesEliminar = document.querySelectorAll(".eliminar");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const idEliminar = e.target.getAttribute("data-id");
      eliminarDelCarrito(idEliminar);
    });
  });
}

//******************************************************Eliminar Elemento de Carro************************************************
function eliminarDelCarrito(idJuego) {
  const index = carrito.findIndex((item) => item.id == idJuego);

  if (index > -1) {
    carrito.splice(index, 1);
  }

  const alertaRemovido = document.getElementById("productoRemovido");
  if (alertaRemovido) {
    alertaRemovido.style.display = "block"; // Mostrar alerta
    setTimeout(() => {
      alertaRemovido.style.display = "none"; // Ocultar alerta después de 3 segundos
    }, 3000);
  }

  actualizarCarrito();
}

// Cargar carrito desde Local Storage al inicio
function cargarCarritoDesdeLocalStorage() {
  if (carrito.length > 0) {
    actualizarCarrito();
  }
}

// Escuchar clic en "Añadir a Carrito"
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("button")) {
    const idJuego = e.target.getAttribute("data-id");
    añadirAlCarrito(idJuego);
  }
});

// Inicializar productos en la página
mostrarJuegos(juegos);

cargarCarritoDesdeLocalStorage();

//******************************************************Añadir Juegos************************************************

function añadirJuego() {
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const imagenInput = document.getElementById("imagen");
  const imagenFile = imagenInput.files[0];

  // Validación del precio
  if (precio <= 1) {
    const alertaAñadido = document.getElementById("alertaPrecio");
    alertaAñadido.classList.remove("hide");
    setTimeout(() => alertaAñadido.classList.add("hide"), 3000);
    return;
  }

  if (!imagenFile) {
    const alertaAñadido = document.getElementById("alertaImagen");
    alertaAñadido.classList.remove("hide");
    setTimeout(() => alertaAñadido.classList.add("hide"), 3000);
    return;
  }

  const fileExtension = imagenFile.name.split(".").pop().toLowerCase();
  if (
    fileExtension !== "jpg" &&
    fileExtension !== "jpeg" &&
    fileExtension !== "png"
  ) {
    document.getElementById("error-imagen").style.display = "block";
    return;
  } else {
    document.getElementById("error-imagen").style.display = "none";
  }

  const imagenURL = URL.createObjectURL(imagenFile);

  const nuevoJuego = {
    id: juegos.length + 1,
    titulo,
    descripcion,
    precio,
    imagen: imagenURL,
  };

  juegos.push(nuevoJuego);

  mostrarJuegos(juegos);

  const modal = new bootstrap.Modal(
    document.getElementById("modalAgregarJuego")
  );
  modal.hide();

  document.getElementById("formAgregarJuego").reset();
}

// Selecciona el botón "Vaciar Carro"
const vaciarCarroBtn = document.getElementById("vaciarCarro");

vaciarCarroBtn.addEventListener("click", () => {
  carrito.length = 0;

  itemCartTotal.textContent = "Total: 0";

  tbody.innerHTML =
    "<tr><td colspan='5' class='text-center text-white'>Carrito vacío</td></tr>";

  guardarCarritoEnLocalStorage();
});

document.getElementById("formAgregarJuego").addEventListener("submit", (e) => {
  e.preventDefault();
  añadirJuego();
});
