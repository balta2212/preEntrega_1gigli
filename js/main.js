// Estado
let productos = [];
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

// Carga de datos
fetch("./data/productos.json")
  .then((res) => res.json())
  .then((data) => {
    productos = data;
    mostrarProductos(productos);
  })
  .catch(() => {
    productos = [
      { id: 1, nombre: "Yerba Mate 1kg", precio: 5000 },
      { id: 2, nombre: "Azúcar 1kg", precio: 1200 },
      { id: 3, nombre: "Aceite 900ml", precio: 2500 },
    ];
    mostrarProductos(productos);
  })
  .finally(mostrarCarrito);

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

buscador.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtrados = productos.filter((p) => p.nombre.toLowerCase().includes(q));
  mostrarProductos(filtrados);
});

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  const item = carrito.find((p) => p.id === id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
}
