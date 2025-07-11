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
      div.className = 'item-carrito';
      div.innerHTML = `
    <img src="${item.imagen}" alt="${item.nombre}" class="img-carrito">
    <div class="info-carrito">
      <h3>${item.nombre}</h3>
      <p>Precio unitario: $${item.precio}</p>
      <p>Subtotal: $${(item.precio * item.cantidad).toFixed(2)}</p>
    </div>
    <div class="controles-carrito">
      <div class="cantidad">
        <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">−</button>
        <span class="cantidad-num">${item.cantidad}</span>
        <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
      </div>
      <button class="btn-eliminar">
        Eliminar
      </button>
    </div>
  `;

    contenedor.appendChild(div);
  });

  totalElemento.textContent = total.toFixed(2);
}

function cambiarCantidad(index, cambio) {
  const nuevaCantidad = carrito[index].cantidad + cambio;

  if (nuevaCantidad <= 0) {
    eliminarProducto(index);
  } else if (nuevaCantidad > 10) {
    Swal.fire({
      icon: 'warning',
      title: 'Límite alcanzado',
      text: 'Máximo 10 unidades por producto.',
      confirmButtonColor: '#575472'
    });
    return;
  } else {
    carrito[index].cantidad = nuevaCantidad;
    guardarYRender();
  }
}

function eliminarProducto(index) {
  const eliminado = carrito[index];
  carrito.splice(index, 1);
  guardarYRender();

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'info',
    title: `${eliminado.nombre} eliminado del carrito`,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
    background: '#d9534f',
    color: '#fff'
  });
}

function vaciarCarrito() {
  Swal.fire({
    title: '¿Vaciar carrito?',
    text: 'Se eliminarán todos los productos.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('carrito');
      location.reload();
    }
  });
}

function guardarYRender() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCarrito();
}

async function confirmarCompra() {
  if (carrito.length === 0) {
    return Swal.fire({
      icon: 'info',
      title: 'Tu carrito está vacío',
      text: 'Agregá productos antes de finalizar la compra.',
      confirmButtonColor: '#575472'
    });
  }

  const confirmacion = await Swal.fire({
    title: '¿Finalizar compra?',
    text: '¿Estás seguro de que querés realizar la compra?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#575472',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sí, comprar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmacion.isConfirmed) return;

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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al finalizar la compra.',
        confirmButtonColor: '#575472'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#575472'
    });
    console.error(error);
  }
}

renderCarrito();


