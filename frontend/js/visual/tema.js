const body = document.body;
const btnTema = document.getElementById('btnTema');
const logo = document.getElementById('logoViews');
const temaGuardado = localStorage.getItem('tema');

function aplicarTema(tema) {
  body.classList.remove('tema-claro', 'tema-oscuro');
  body.classList.add(tema);

  // Cambiar logo según tema
  if (logo) {
    logo.src = tema === 'tema-oscuro'
      ? 'img/ViewsWhite.png'
      : 'img/ViewsLogoFinal.png';
  }
}

// Al cargar la página
aplicarTema(temaGuardado || 'tema-claro');

// Al hacer clic en el botón
btnTema?.addEventListener('click', () => {
  const nuevoTema = body.classList.contains('tema-claro') ? 'tema-oscuro' : 'tema-claro';
  aplicarTema(nuevoTema);
  localStorage.setItem('tema', nuevoTema);
});
