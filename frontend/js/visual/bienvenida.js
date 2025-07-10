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
  const nombreInput = document.getElementById('nombre');
  const nombre = nombreInput.value.trim();

  // Validación: vacío
  if (nombre === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Nombre requerido',
      text: 'Por favor ingresá tu nombre antes de continuar.',
      confirmButtonColor: '#575472'
    });
    return;
  }

  // Validación: solo letras y espacios (sin números ni símbolos)
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!soloLetras.test(nombre)) {
    Swal.fire({
      icon: 'error',
      title: 'Nombre inválido',
      text: 'El nombre solo puede contener letras y espacios.',
      confirmButtonColor: '#575472'
    });
    nombreInput.focus();
    return;
  }

  // Si todo está bien, guardar y continuar
  localStorage.setItem('nombreCliente', nombre);
  window.location.href = 'productos.html';
}

