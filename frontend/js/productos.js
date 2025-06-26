const nombre = localStorage.getItem('nombreCliente');
document.getElementById('clienteNombre').textContent = nombre ?? 'Cliente';

function mostrar(tipo) {
  document.getElementById('albumes').style.display = tipo === 'albumes' ? 'flex' : 'none';
  document.getElementById('entradas').style.display = tipo === 'entradas' ? 'flex' : 'none';

  document.getElementById('btnAlbumes').classList.toggle('active', tipo === 'albumes');
  document.getElementById('btnEntradas').classList.toggle('active', tipo === 'entradas');
}

fetch('http://localhost:3000/api/productos')
  .then(res => res.json())
  .then(data => {
    const contAlbumes = document.getElementById('albumes');
    const contEntradas = document.getElementById('entradas');

    data.forEach(prod => {
      if (!prod.activo) return;

      const card = document.createElement('div');
      card.className = 'producto';
      card.innerHTML = `
        <img src="../backend/uploads/${prod.imagen}" alt="${prod.nombre}" width="100">
        <h3>${prod.nombre}</h3>
        <p>${prod.artista ?? ''}</p>
        ${prod.fechaShow ? `<p>Fecha: ${new Date(prod.fechaShow).toLocaleDateString()}</p>` : ''}
        <p><strong>$${prod.precio}</strong></p>
        <button>Agregar al carrito</button>
      `;

      const boton = card.querySelector('button');
      boton.addEventListener('click', () => {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        const existente = carrito.find(item => item.id === prod.id);
        if (existente) {
          existente.cantidad += 1;
        } else {
          carrito.push({
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            cantidad: 1
          });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContador();
        Swal.fire({
          toast: true,
          position: 'bottom-end', // Cambiado desde 'top-end'
          icon: 'success',
          title: `${prod.nombre} agregado al carrito`,
          showConfirmButton: false,
          timer: 1800,
          timerProgressBar: true,
          background: '#575472',
          color: '#fff',
          customClass: {
            popup: 'swal-toast-bottom'
          }
        });
      });

      // Insertamos según tipo
      if (prod.tipo === 'album') {
        contAlbumes.appendChild(card);
      } else if (prod.tipo === 'entrada') {
        contEntradas.appendChild(card);
      }
    });
  });

  function actualizarContador() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById('contadorCarrito').textContent = totalCantidad;
}

// Mostrar el número al cargar la página
actualizarContador();

