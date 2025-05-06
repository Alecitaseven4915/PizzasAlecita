document.addEventListener('DOMContentLoaded', () => {
  const { jsPDF } = window.jspdf;

  // Obtener datos de LocalStorage
  const datos = JSON.parse(localStorage.getItem('formulario')) || {};
  const productos = JSON.parse(localStorage.getItem('carrito')) || [];

  // Rellenar los datos del ticket en la página
  document.getElementById('ticket-pais').textContent = datos.pais || '';
  document.getElementById('ticket-nombre').textContent = datos.nombre || '';
  document.getElementById('ticket-cp').textContent = datos.codigoPostal || '';
  document.getElementById('ticket-estado').textContent = datos.estado || '';
  document.getElementById('ticket-municipio').textContent = datos.municipio || '';
  document.getElementById('ticket-distrito').textContent = datos.distrito || '';
  document.getElementById('ticket-direccion').textContent = datos.direccion || '';
  document.getElementById('ticket-notas').textContent = datos.notas || '';
  document.getElementById('ticket-telefono').textContent = datos.telefono || '';
  document.getElementById('ticket-correo').textContent = datos.correo || '';

  const numeroTarjeta = datos.numeroTarjeta || '';
  const tarjetaProtegida = numeroTarjeta.slice(-4).padStart(numeroTarjeta.length, '*');
  document.getElementById('ticket-tarjeta').textContent = tarjetaProtegida;

  document.getElementById('ticket-fecha-exp').textContent = datos.fechaExpiracion || '';
  document.getElementById('ticket-cvv').textContent = '***'; // Ocultar CVV

  const listaProductos = document.getElementById('productosCarrito');
  const totalSpan = document.getElementById('total-pagar');
  let total = 0;

  productos.forEach(producto => {
    const li = document.createElement('li');
    li.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;
    listaProductos.appendChild(li);
    total += producto.precio;
  });

  totalSpan.textContent = total.toFixed(2);

  // Supongamos que el saldo de la tarjeta es un valor aleatorio, por ejemplo, entre $1000 y $5000
  const saldoTarjeta = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
  const saldoRestante = saldoTarjeta - total;

  // Mostrar el saldo de la tarjeta y cuánto le sobra
  document.getElementById('ticket-saldo').textContent = `Saldo de la tarjeta: $${saldoTarjeta.toFixed(2)}`;
  document.getElementById('ticket-saldo-restante').textContent = `Saldo restante: $${saldoRestante.toFixed(2)}`;

  // Función para descargar el ticket en PDF
  document.getElementById('descargarTicketBtn').addEventListener('click', () => {
    const doc = new jsPDF();

    // Fondo degradado
    const grad = doc.createLinearGradient(0, 0, 0, 200);
    grad.addColorStop(0, '#00c6ff');
    grad.addColorStop(1, '#0072ff');
    doc.setFillColor(grad);
    doc.rect(0, 0, 210, 297, 'F'); // Full page background

    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('Ticket de Compra', 105, 25, { align: 'center' });

    // Datos del cliente
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`País: ${datos.pais}`, 20, 40);
    doc.text(`Nombre Completo: ${datos.nombre}`, 20, 45);
    doc.text(`Código Postal: ${datos.codigoPostal}`, 20, 50);
    doc.text(`Estado: ${datos.estado}`, 20, 55);
    doc.text(`Municipio: ${datos.municipio}`, 20, 60);
    doc.text(`Distrito: ${datos.distrito}`, 20, 65);
    doc.text(`Dirección: ${datos.direccion}`, 20, 70);
    doc.text(`Notas: ${datos.notas}`, 20, 75);
    doc.text(`Teléfono: ${datos.telefono}`, 20, 80);
    doc.text(`Correo: ${datos.correo}`, 20, 85);
    doc.text(`Tarjeta: ${tarjetaProtegida}`, 20, 90);
    doc.text(`Fecha de Expiración: ${datos.fechaExpiracion}`, 20, 95);
    doc.text(`CVV: ***`, 20, 100);

    // Sección de productos
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Productos Comprados:', 20, 110);
    let y = 115;
    productos.forEach(producto => {
      doc.setFontSize(12);
      doc.text(`${producto.nombre} - $${producto.precio.toFixed(2)}`, 20, y);
      y += 6;
    });

    // Total
    doc.setFontSize(14);
    doc.setTextColor(255, 215, 0); // Amarillo brillante
    doc.text(`Total Pagado: $${total.toFixed(2)}`, 20, y + 10);

    // Mostrar saldo de la tarjeta y saldo restante
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Saldo de la tarjeta: $${saldoTarjeta.toFixed(2)}`, 20, y + 20);
    doc.text(`Saldo restante: $${saldoRestante.toFixed(2)}`, 20, y + 25);

    // Líneas de separación
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(20, y + 30, 190, y + 30); // Línea de separación

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Gracias por tu compra!', 105, y + 40, { align: 'center' });

    // Descargar el PDF
    doc.save('ticket-compra.pdf');
  });
});
