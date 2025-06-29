// Slider automático
let current = 0;
const slides = document.querySelectorAll('.slide');
setInterval(() => {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, 4000);

// Validación con SweetAlert
function continuar() {
  const nombre = document.getElementById('nombre').value.trim();
  if (nombre === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Nombre requerido',
      text: 'Por favor ingresá tu nombre antes de continuar.',
      confirmButtonColor: '#575472'
    });
    return;
  }
  localStorage.setItem('nombreCliente', nombre);
  window.location.href = 'productos.html';
}
