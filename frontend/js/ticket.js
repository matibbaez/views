const datos = JSON.parse(localStorage.getItem('ticket'));

if (!datos || !datos.productos || datos.productos.length === 0) {
  document.body.innerHTML = '<h1>🎫 Ticket no disponible</h1><p>No hay información de compra.</p>';
} else {
  const { nombreCliente, productos } = datos;
  const contenedor = document.createElement('div');
  contenedor.id = 'ticketContenido';
  contenedor.style.maxWidth = '600px';
  contenedor.style.margin = '0 auto';
  contenedor.style.backgroundColor = '#fff';
  contenedor.style.padding = '20px';
  contenedor.style.borderRadius = '12px';
  contenedor.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
  contenedor.style.textAlign = 'left';

  let total = 0;
  let html = `<h2>🎫 Ticket de Compra</h2>`;
  html += `<p><strong>Cliente:</strong> ${nombreCliente}</p>`;
  const fecha = new Date().toLocaleString('es-AR');
  html += `<p><strong>Fecha:</strong> ${fecha}</p>`;
  html += `<hr><ul style="padding-left: 0;">`;

  productos.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    html += `
      <li style="margin-bottom: 10px; list-style: none;">
        <strong>${p.nombre}</strong> — $${p.precio} x ${p.cantidad} = $${subtotal.toFixed(2)}
      </li>
    `;
  });

  html += `</ul><hr>`;
  html += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;

  // Frase + QR (al final)
  html += `
    <div style="text-align: center; margin-top: 30px;">
      <p style="margin-bottom: 16px;">🎶 ¡Gracias por comprar en <strong>Views</strong>! 🎶<br>Disfrutá de tu música 🖤</p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=Gracias+por+comprar+en+Views" alt="QR de agradecimiento" style="margin-top: 10px;">
    </div>
  `;

  contenedor.innerHTML = html;
  document.body.prepend(contenedor);

  // Botón de descarga PDF
  const btn = document.createElement('button');
  btn.textContent = '📄 Descargar en PDF';
  btn.style.marginTop = '20px';
  btn.style.padding = '10px 20px';
  btn.style.border = 'none';
  btn.style.borderRadius = '8px';
  btn.style.backgroundColor = '#575472';
  btn.style.color = '#fff';
  btn.style.cursor = 'pointer';

  btn.onclick = () => {
    const element = document.getElementById('ticketContenido');
    const qrImg = element.querySelector('img');

    if (qrImg.complete) {
      generarPDF(element);
    } else {
      qrImg.onload = () => generarPDF(element);
    }
  };

  function generarPDF(element) {
    html2pdf().set({
      margin: 10,
      filename: 'ticket.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  }

  document.body.appendChild(btn);
}

