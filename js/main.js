// Datos iniciales
const productos = [
  { id: 1, nombre: "Yerba", precio: 5000 },
  { id: 2, nombre: "Azúcar", precio: 1200 },
  { id: 3, nombre: "Aceite", precio: 2500 },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// DOM Elements
const listaProductos = document.getElementById("lista-productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalHTML = document.getElementById("total");
const vaciarBtn = document.getElementById("vaciar");

// Mostrar productos disponibles
function mostrarProductos() {
  listaProductos.innerHTML = "";
  productos.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button data-id="${p.id}">Agregar</button>
    `;
    listaProductos.appendChild(div);
  });
}

// Agregar al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const item = carrito.find((p) => p.id === id);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  mostrarCarrito();
}

// Mostrar carrito
function mostrarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((p) => {
    total += p.precio * p.cantidad;
    const div = document.createElement("div");
    div.innerHTML = `
      ${p.nombre} x${p.cantidad} = $${p.precio * p.cantidad}
    `;
    listaCarrito.appendChild(div);
  });

  totalHTML.textContent = `Total: $${total}`;
}

// Guardar en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Vaciar carrito
vaciarBtn.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
});

// Delegación de eventos para botones de productos
listaProductos.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = parseInt(e.target.dataset.id);
    agregarAlCarrito(id);
  }
});

// Inicializar
mostrarProductos();
mostrarCarrito();
