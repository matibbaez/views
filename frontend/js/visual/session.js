// Mostrar nombre del cliente (si lo guardás en localStorage)
const clienteNombre = localStorage.getItem('clienteNombre');
if (clienteNombre && document.getElementById('clienteNombre')) {
  document.getElementById('clienteNombre').textContent = clienteNombre;
}

// Evento de cierre de sesión con SweetAlert2
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener('click', () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear(); // o sessionStorage.clear();
        window.location.href = 'bienvenida.html'; // Página de inicio
      }
    });
  });
}
