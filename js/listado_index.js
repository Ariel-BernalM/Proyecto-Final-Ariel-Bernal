
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

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
            juegos = []; 
        }
    }

    return juegos; 
}


async function listadoJuegosSwitch() {
    const juegos = await obtenerJuegos();
    const juegosSwitch = juegos.filter(juego => juego.plataforma === "Nintendo Switch");

    const contenedor = document.getElementById("listadoJuegosSwitch");
    contenedor.innerHTML = "";

    if (juegosSwitch.length === 0) {
        Swal.fire({
            title: "No hay juegos de Nintendo Switch",
            icon: "info",
        });
        return;
    }

    juegosSwitch.forEach(juego => {
        const div = document.createElement("div");
        div.classList.add("swiper-slide");

        let imagenSrc = "./img/default.jpg"; 
        if (juego.imagen) {
            if (juego.imagen.startsWith("blob:")) {
                imagenSrc = juego.imagen; 
            } else if (juego.imagen.startsWith("data:image")) {
                imagenSrc = juego.imagen; 
            } else if (juego.imagen.startsWith("http")) {
                imagenSrc = juego.imagen; 
            } else {
                imagenSrc = `./${juego.imagen}`; 
            }
        }

        div.innerHTML = `
        <div class="product-card position-relative">
            <div class="image-holder">
                <img src="${imagenSrc}" alt="${juego.titulo}" class="img-fluid" id="imagen_formato">
            </div>
          <div class="cart-concern position-absolute">
            <div class="cart-button d-flex">
              <button class="btn btn-medium btn-black agregar-carrito" data-id="${juego.id}">
                Agregar al Carro
              </button>
            </div>
          </div>
          <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
            <h3 class="card-title text-uppercase">
              <a href="#">${juego.titulo}</a>
            </h3>
          </div>
          <div class="card-detail d-flex justify-content-center align-items-center pt-3">
            <span class="item-price text-primary">$${juego.precio}</span>
        </div>

        </div>
      `;
        contenedor.appendChild(div);
    });

    // Agregar eventos solo a los botones dentro de este contenedor específico
    contenedor.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const idJuego = e.target.getAttribute("data-id");
            añadirAlCarrito(idJuego, juegosSwitch); // Ahora pasamos solo los juegos filtrados
        });
    });
}




async function listadoJuegosMulti() {
    const juegos = await obtenerJuegos();
   
    const contenedor = document.getElementById("listadoJuegosMulti");
    contenedor.innerHTML = "";

    if (juegos.length === 0) {
        Swal.fire({
            title: "No hay juegos de Nintendo Switch",
            icon: "info",
        });
        return;
    }

    juegos.forEach(juego => {
        const div = document.createElement("div");
        div.classList.add("swiper-slide");
        let imagenSrc = "./img/default.jpg"; 
        if (juego.imagen) {
            if (juego.imagen.startsWith("blob:")) {
                imagenSrc = juego.imagen;
            } else if (juego.imagen.startsWith("data:image")) {
                imagenSrc = juego.imagen; 
            } else if (juego.imagen.startsWith("http")) {
                imagenSrc = juego.imagen; 
            } else {
                imagenSrc = `./${juego.imagen}`; 
            }
        }

        div.innerHTML = `
        <div class="product-card position-relative">
            <div class="image-holder">
                <img src="${imagenSrc}" alt="${juego.titulo}" class="img-fluid" id="imagen_formato">
            </div>
          <div class="cart-concern position-absolute">
            <div class="cart-button d-flex">
              <button class="btn btn-medium btn-black agregar-carrito" data-id="${juego.id}">
                Agregar al Carro
              </button>
            </div>
          </div>
          <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
            <h3 class="card-title text-uppercase">
              <a href="#">${juego.titulo}</a>
            </h3>
          </div>
          <div class="card-detail d-flex justify-content-center align-items-center pt-3">
            <span class="item-price text-primary">$${juego.precio}</span>
        </div>

        </div>
      `;
        contenedor.appendChild(div);
    });

    
    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const idJuego = e.target.getAttribute("data-id");
            añadirAlCarrito(idJuego, juegos);
        });
    });
}

function añadirAlCarrito(idJuego, juegos) {
    const juego = juegos.find(j => j.id == idJuego);
    if (!juego) return;

    const existe = carrito.find(item => item.id == idJuego);
    
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...juego, cantidad: 1 });
    }

    Swal.fire({
        title: "Añadido al carrito!",
        text: `${juego.titulo} ha sido agregado a tu carrito!`,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
    });
    guardarCarritoEnLocalStorage();
    
}



async function obtenerYMostrarJuegos() {
    juegos = await obtenerJuegos();
    aplicarFiltros();
}

async function mostrarJuegosFormato2(juegosFiltrados) {
    const contenedorJuegos = document.getElementById("listadoJuegosMultiFormato2");

    if (!contenedorJuegos) {
        Swal.fire({
            title: "No hay juegos",
            icon: "info",
        });
        return;
    }

    const plataformaFiltro = contenedorJuegos.getAttribute("data-plataforma");

   
    if (plataformaFiltro) {
        juegosFiltrados = juegosFiltrados.filter(juego => 
            juego.plataforma.split(", ").map(p => p.toLowerCase()).includes(plataformaFiltro.toLowerCase())

        );
    }
    

    contenedorJuegos.innerHTML = "";

    juegosFiltrados.forEach((juego) => {
        let imagenSrc = "./img/default.jpg";
        if (juego.imagen) {
            if (juego.imagen.startsWith("blob:")) {
                imagenSrc = juego.imagen; 
            } else if (juego.imagen.startsWith("data:image")) {
                imagenSrc = juego.imagen; 
            } else if (juego.imagen.startsWith("http")) {
                imagenSrc = juego.imagen;
            } else {
                imagenSrc = `./${juego.imagen}`; 
            }
        }
        
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("col", "d-flex", "justify-content-center", "mb-4");
        tarjeta.innerHTML = `
        <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
          <h5 class="card-title pt-2 text-center text-white">${juego.titulo}</h5>
          <img src="${imagenSrc}" width="200px" height="350px" class="card-img-top" alt="${juego.titulo}">
          <div class="card-body">
            <p class="card-text text-white-50 description">${juego.descripcion}</p>
            <h5 class="text-primary">Precio: <span class="precio">$${juego.precio}</span></h5>
            <p class="card-text text-white-50"><strong>Plataforma:</strong> ${juego.plataforma}</p>
            <div class="d-grid gap-2">
              <button class="btn btn-primary button agregar-carrito" data-id="${juego.id}">Añadir a Carrito</button>
            </div>
          </div>
        </div>
      `;
        contenedorJuegos.appendChild(tarjeta);
    });

    
    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const idJuego = e.target.getAttribute("data-id");
            añadirAlCarrito(idJuego, juegos);
        });
    });
}



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
    const buscador = document.getElementById("buscador");
    const selectPrecio = document.getElementById("ordenar-precio");
    const selectNombre = document.getElementById("ordenar-nombre");
    const selectPlataforma = document.getElementById("filtrar-plataforma");

    if (!buscador || !selectPrecio || !selectNombre || !selectPlataforma) {
        console.warn("Algunos elementos de filtrado no existen en el DOM.");
        return;  
    }

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
        }
    });

    mostrarJuegosFormato2(juegosFiltrados);
}



if (buscador) buscador.addEventListener("input", aplicarFiltros);
if (selectPrecio) selectPrecio.addEventListener("change", aplicarFiltros);
if (selectNombre) selectNombre.addEventListener("change", aplicarFiltros);
if (selectPlataforma) selectPlataforma.addEventListener("change", aplicarFiltros);



function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

document.addEventListener("DOMContentLoaded", async () => {
    if (document.getElementById("listadoJuegosSwitch")) {
        await listadoJuegosSwitch();
    }

    if (document.getElementById("listadoJuegosMulti")) {
        await listadoJuegosMulti();
    }

    if (document.getElementById("listadoJuegosMultiFormato2")) {
        await obtenerYMostrarJuegos(); 
        mostrarJuegosFormato2(juegos); 
    }
});
