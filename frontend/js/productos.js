const nombre = localStorage.getItem('nombreCliente');
document.getElementById('clienteNombre').textContent = nombre ?? 'Cliente';

let paginaActual = 1;
let tipoActual = 'albumes';
const LIMITE = 12;

function mostrar(tipo) {
  tipoActual = tipo;
  paginaActual = 1;

  document.getElementById('albumes').style.display = tipo === 'albumes' ? 'flex' : 'none';
  document.getElementById('entradas').style.display = tipo === 'entradas' ? 'flex' : 'none';
  document.getElementById('paginacionAlbumes').style.display = tipo === 'albumes' ? 'flex' : 'none';
  document.getElementById('paginacionEntradas').style.display = tipo === 'entradas' ? 'flex' : 'none';

  document.getElementById('btnAlbumes').classList.toggle('active', tipo === 'albumes');
  document.getElementById('btnEntradas').classList.toggle('active', tipo === 'entradas');

  cargarProductos(tipo, paginaActual);
}

async function cargarProductos(tipo, pagina) {
  const contenedor = document.getElementById(tipo);
  const paginacion = document.getElementById(`paginacion${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
  const loader = document.getElementById(`loader${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);

  contenedor.innerHTML = ''; 
  contenedor.appendChild(loader); 
  loader.style.display = 'block';
  paginacion.innerHTML = '';

  // Esperamos para simular carga
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    const res = await fetch(`http://localhost:3000/api/productos?tipo=${tipo === 'albumes' ? 'album' : 'entrada'}&limit=${LIMITE}&page=${pagina}`);
    const data = await res.json();

    if (!Array.isArray(data.productos)) return;

    loader.style.display = 'none'; 

    data.productos.forEach(prod => {
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

      card.querySelector('button').addEventListener('click', () => {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const existente = carrito.find(item => item.id === prod.id);

        if (existente) {
          existente.cantidad += 1;
        } else {
          carrito.push({
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            cantidad: 1,
            imagen: `../backend/uploads/${prod.imagen}`
          });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContador();
        Swal.fire({
          toast: true,
          position: 'bottom-end',
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

      contenedor.appendChild(card);
    });

    // Paginación
    if (data.totalPages > 1) {
      if (pagina > 1) {
        const prev = document.createElement('button');
        prev.textContent = '⬅ Anterior';
        prev.onclick = () => {
          paginaActual--;
          cargarProductos(tipoActual, paginaActual);
        };
        paginacion.appendChild(prev);
      }

      if (pagina < data.totalPages) {
        const sig = document.createElement('button');
        sig.textContent = 'Siguiente ⮕';
        sig.onclick = () => {
          paginaActual++;
          cargarProductos(tipoActual, paginaActual);
        };
        paginacion.appendChild(sig);
      }
    }

  } catch (err) {
    console.error('Error al cargar productos:', err);
    loader.style.display = 'none';
  }
}

function actualizarContador() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById('contadorCarrito').textContent = totalCantidad;
}

// Inicial
actualizarContador();
mostrar('albumes');
