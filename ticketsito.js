document.addEventListener('DOMContentLoaded', () => {
  const productos = JSON.parse(localStorage.getItem('carrito')) || [];
  const listaProductos = document.getElementById('productosCarrito');
  const totalPagar = document.getElementById('total-pagar');
  let total = 0;

  productos.forEach(producto => {
    const li = document.createElement('li');
    li.textContent = `${producto.nombre} - $${parseFloat(producto.precio).toFixed(2)}`;
    listaProductos.appendChild(li);
    total += parseFloat(producto.precio);
  });

  totalPagar.textContent = total.toFixed(2);

  const datos = JSON.parse(localStorage.getItem('formulario')) || {};
  document.getElementById('ticket-pais').textContent = datos.pais || 'N/A';
  document.getElementById('ticket-nombre').textContent = datos.nombre || 'N/A';
  document.getElementById('ticket-cp').textContent = datos.codigoPostal || 'N/A';
  document.getElementById('ticket-estado').textContent = datos.estado || 'N/A';
  document.getElementById('ticket-municipio').textContent = datos.municipio || 'N/A';
  document.getElementById('ticket-distrito').textContent = datos.distrito || 'N/A';
  document.getElementById('ticket-direccion').textContent = datos.direccion || 'N/A';
  document.getElementById('ticket-notas').textContent = datos.notas || 'N/A';
  document.getElementById('ticket-telefono').textContent = datos.telefono || 'N/A';
  document.getElementById('ticket-correo').textContent = datos.correo || 'N/A';
  document.getElementById('ticket-tarjeta').textContent = datos.numeroTarjeta
    ? '**** **** **** ' + datos.numeroTarjeta.slice(-4)
    : 'N/A';
  document.getElementById('ticket-fecha-exp').textContent = datos.fechaExpiracion || 'N/A';
  document.getElementById('ticket-cvv').textContent = datos.cvv ? '***' : 'N/A';

  let saldo = localStorage.getItem('saldoTarjeta');
  if (!saldo) {
    saldo = (Math.random() * (5000 - 1000) + 1000).toFixed(2);
    localStorage.setItem('saldoTarjeta', saldo); 
  }

  const restante = (parseFloat(saldo) - total).toFixed(2);

  document.getElementById('ticket-saldo').textContent = `$${saldo}`;
  document.getElementById('ticket-saldo-restante').textContent = `$${restante}`;
});

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Ticket de Compra', 10, 10);

  const datos = JSON.parse(localStorage.getItem('formulario')) || {};
  doc.setFontSize(12);
  doc.text(`País: ${datos.pais || 'N/A'}`, 10, 20);
  doc.text(`Nombre Completo: ${datos.nombre || 'N/A'}`, 10, 30);
  doc.text(`Código Postal: ${datos.codigoPostal || 'N/A'}`, 10, 40);
  doc.text(`Estado: ${datos.estado || 'N/A'}`, 10, 50);
  doc.text(`Municipio: ${datos.municipio || 'N/A'}`, 10, 60);
  doc.text(`Distrito: ${datos.distrito || 'N/A'}`, 10, 70);
  doc.text(`Dirección: ${datos.direccion || 'N/A'}`, 10, 80);
  doc.text(`Notas para el repartidor: ${datos.notas || 'N/A'}`, 10, 90);
  doc.text(`Número de Teléfono: ${datos.telefono || 'N/A'}`, 10, 100);
  doc.text(`Correo Electrónico: ${datos.correo || 'N/A'}`, 10, 110);
  doc.text(`Número de Tarjeta: ${datos.numeroTarjeta ? '**** **** **** ' + datos.numeroTarjeta.slice(-4) : 'N/A'}`, 10, 120);
  doc.text(`Fecha de Expiración: ${datos.fechaExpiracion || 'N/A'}`, 10, 130);
  doc.text(`CVV: ${datos.cvv ? '***' : 'N/A'}`, 10, 140);

  const productos = JSON.parse(localStorage.getItem('carrito')) || [];
  let yPosition = 150;
  doc.text('Productos Comprados:', 10, yPosition);
  yPosition += 10;

  let total = 0;
  productos.forEach((producto, index) => {
    const precio = parseFloat(producto.precio);
    doc.text(`${index + 1}. ${producto.nombre} - $${precio.toFixed(2)}`, 10, yPosition);
    yPosition += 10;
    total += precio;
  });

  doc.text(`Total pagado: $${total.toFixed(2)}`, 10, yPosition + 10);

  const saldo = parseFloat(localStorage.getItem('saldoTarjeta') || '0').toFixed(2);
  const restante = (parseFloat(saldo) - total).toFixed(2);

  doc.text(`Saldo de la Tarjeta: $${saldo}`, 10, yPosition + 20);
  doc.text(`Saldo Restante: $${restante}`, 10, yPosition + 30);

  doc.save('ticket_compra.pdf');

  localStorage.removeItem('carrito');
}
