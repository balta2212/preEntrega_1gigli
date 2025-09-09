// Estado
let productos = [
  { id: 1, nombre: "Yerba Mate 1kg", precio: 5000 },
  { id: 2, nombre: "Azúcar 1kg", precio: 1200 },
  { id: 3, nombre: "Aceite 900ml", precio: 2500 },
  { id: 4, nombre: "Fideos Spaghetti 500g", precio: 1100 },
  { id: 5, nombre: "Arroz 1kg", precio: 1800 },
  { id: 6, nombre: "Sal Fina 500g", precio: 600 },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Helpers
const $ = (sel) => document.querySelector(sel);
const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    valor
  );

// DOM Elements
const listaProductos = $("#lista-productos");
const listaCarrito = $("#lista-carrito");
const totalHTML = $("#total");
const vaciarBtn = $("#vaciar");
const finalizarBtn = $("#finalizar");
const buscador = $("#buscador");

// Mostrar productos
function mostrarProductos(listado) {
  listaProductos.innerHTML = listado
    .map(
      (p) => `
      <article class="card">
        <h3>${p.nombre}</h3>
        <p>${formatearPrecio(p.precio)}</p>
        <button class="agregar" data-id="${p.id}">Agregar</button>
      </article>
    `
    )
    .join("");
}

// Filtrar productos
buscador.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtrados = productos.filter((p) => p.nombre.toLowerCase().includes(q));
  mostrarProductos(filtrados);
});

// Funciones de carrito
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  const item = carrito.find((p) => p.id === id);
  if (item) item.cantidad++;
  else carrito.push({ ...producto, cantidad: 1 });
  guardarCarrito();
  mostrarCarrito();
  Toastify({ text: `${producto.nombre} agregado`, duration: 1500 }).showToast();
}

function decrementarCantidad(id) {
  const item = carrito.find((p) => p.id === id);
  if (!item) return;
  item.cantidad--;
  if (item.cantidad <= 0) carrito = carrito.filter((p) => p.id !== id);
  guardarCarrito();
  mostrarCarrito();
}

function incrementarCantidad(id) {
  const item = carrito.find((p) => p.id === id);
  if (!item) return;
  item.cantidad++;
  guardarCarrito();
  mostrarCarrito();
}

function eliminarDelCarrito(id) {
  const item = carrito.find((p) => p.id === id);
  if (!item) return;
  carrito = carrito.filter((p) => p.id !== id);
  guardarCarrito();
  mostrarCarrito();
  Toastify({ text: `${item.nombre} eliminado`, duration: 1500 }).showToast();
}

// Mostrar carrito
function mostrarCarrito() {
  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    totalHTML.textContent = `Total: ${formatearPrecio(0)}`;
    return;
  }

  listaCarrito.innerHTML = carrito
    .map(
      (p) => `
    <div class="item">
      <div class="nombre">${p.nombre}</div>
      <div class="precio">${formatearPrecio(p.precio)}</div>
      <div class="cantidad">
        <button class="btn-restar" data-id="${p.id}">−</button>
        <span>${p.cantidad}</span>
        <button class="btn-sumar" data-id="${p.id}">+</button>
      </div>
      <div class="subtotal">${formatearPrecio(p.precio * p.cantidad)}</div>
      <button class="eliminar" data-id="${p.id}">✕</button>
    </div>
  `
    )
    .join("");

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  totalHTML.textContent = `Total: ${formatearPrecio(total)}`;
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Eventos
listaProductos.addEventListener("click", (e) => {
  if (e.target.classList.contains("agregar")) {
    const id = parseInt(e.target.dataset.id);
    agregarAlCarrito(id);
  }
});

listaCarrito.addEventListener("click", (e) => {
  const id = parseInt(e.target.dataset.id);
  if (e.target.classList.contains("btn-restar")) decrementarCantidad(id);
  if (e.target.classList.contains("btn-sumar")) incrementarCantidad(id);
  if (e.target.classList.contains("eliminar")) eliminarDelCarrito(id);
});

vaciarBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    Toastify({ text: "El carrito ya está vacío", duration: 1500 }).showToast();
    return;
  }
  Swal.fire({
    title: "¿Vaciar carrito?",
    text: "Se eliminarán todos los productos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
  }).then((r) => {
    if (r.isConfirmed) {
      carrito = [];
      guardarCarrito();
      mostrarCarrito();
      Toastify({ text: "Carrito vaciado", duration: 1500 }).showToast();
    }
  });
});

finalizarBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire("Carrito vacío", "Agregá productos antes de finalizar", "info");
    return;
  }

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const detalle = `
    <ul style="text-align:left;">
      ${carrito
        .map(
          (p) =>
            `<li>${p.nombre} × ${p.cantidad} — <strong>${formatearPrecio(
              p.precio * p.cantidad
            )}</strong></li>`
        )
        .join("")}
    </ul>
    <p style="text-align:right;font-weight:700;">Total: ${formatearPrecio(
      total
    )}</p>
  `;

  Swal.fire({
    title: "Confirmar compra",
    html: detalle,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Pagar",
    cancelButtonText: "Seguir comprando",
  }).then((r) => {
    if (r.isConfirmed) {
      Swal.fire("¡Compra realizada!", "Gracias por tu compra.", "success");
      carrito = [];
      guardarCarrito();
      mostrarCarrito();
    }
  });
});

// Inicializar
mostrarProductos(productos);
mostrarCarrito();
