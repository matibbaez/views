const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const nombre = localStorage.getItem('nombreCliente') || 'Cliente';
document.getElementById('nombreCliente').textContent = nombre;

const contenedor = document.getElementById('carrito');
const totalElemento = document.getElementById('total');

function renderCarrito() {
  contenedor.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;

    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <h3>${item.nombre}</h3>
      <p>Precio: $${item.precio}</p>
      <p>Cantidad: 
        <button onclick="cambiarCantidad(${index}, -1)">-</button>
        ${item.cantidad}
        <button onclick="cambiarCantidad(${index}, 1)">+</button>
      </p>
      <button onclick="eliminarProducto(${index})">Eliminar</button>
      <hr>
    `;
    contenedor.appendChild(div);
  });

  totalElemento.textContent = total.toFixed(2);
}

function cambiarCantidad(index, cambio) {
  const nuevaCantidad = carrito[index].cantidad + cambio;

  if (nuevaCantidad <= 0) {
    carrito.splice(index, 1);
  } else if (nuevaCantidad > 99) {
    alert('Máximo 99 unidades por producto');
    return;
  } else {
    carrito[index].cantidad = nuevaCantidad;
  }

  guardarYRender();
}


function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarYRender();
}

function vaciarCarrito() {
  if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
    localStorage.removeItem('carrito');
    location.reload();
  }
}

function guardarYRender() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCarrito();
}

async function confirmarCompra() {
  if (carrito.length === 0) return alert('Tu carrito está vacío');

  const nombre = localStorage.getItem('nombreCliente');

  try {
    const response = await fetch('http://localhost:3000/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreCliente: nombre, productos: carrito })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('ticket', JSON.stringify({ nombreCliente: nombre, productos: carrito }));
      localStorage.removeItem('carrito');
      window.location.href = 'ticket.html';
    } else {
      alert('Hubo un error al finalizar la compra');
    }
  } catch (error) {
    alert('Error de conexión con el servidor');
    console.error(error);
  }
}

renderCarrito();
