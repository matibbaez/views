const nombre = localStorage.getItem('nombreCliente');
document.getElementById('clienteNombre').textContent = nombre ?? 'Cliente';

fetch('http://localhost:3000/api/productos')
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById('productos');
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

      // 👇 Agregar comportamiento del botón
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
        alert(`${prod.nombre} agregado al carrito`);
      });

      contenedor.appendChild(card);
    });
  });

