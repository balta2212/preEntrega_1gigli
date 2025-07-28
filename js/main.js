// Declaración de variables, constantes y arrays
const productos = ["Yerba", "Azúcar", "Aceite"];
const precios = [5000, 1200, 2500];
let carrito = [];
let total = 0;

// Función para mostrar productos disponibles
function mostrarProductos() {
  let mensaje = "Productos disponibles:\n";
  for (let i = 0; i < productos.length; i++) {
    mensaje += `${i + 1}. ${productos[i]} - $${precios[i]}\n`;
  }
  return mensaje;
}

// Función para simular compra
function comprar() {
  alert("¡Bienvenido al simulador de compras!");

  let continuar = true;

  while (continuar) {
    let opcion = prompt(
      mostrarProductos() + "\nElige un número de producto (o 0 para salir):"
    );

    if (opcion === null || opcion === "0") {
      continuar = false;
    } else {
      const index = parseInt(opcion) - 1;

      if (index >= 0 && index < productos.length) {
        carrito.push(productos[index]);
        total += precios[index];
        alert(`${productos[index]} agregado al carrito.`);
      } else {
        alert("Opción inválida, intentá de nuevo.");
      }
    }
  }

  if (carrito.length > 0) {
    let resumen = `Compraste:\n${carrito.join(", ")}\nTotal: $${total}`;
    alert(resumen);
    console.log(resumen);
  } else {
    alert("No realizaste ninguna compra.");
    console.log("Carrito vacío.");
  }
}

// Iniciar simulador
comprar();
