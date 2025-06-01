document.addEventListener('DOMContentLoaded', () => {

  const productos = JSON.parse(localStorage.getItem('carrito')) || [];
  const listaProductos = document.getElementById('lista-productos');
  const totalPagar = document.getElementById('total-pagar');
  let total = 0;

  productos.forEach(producto => {
    const li = document.createElement('li');
    li.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;
    listaProductos.appendChild(li);
    total += producto.precio;
  });

  totalPagar.textContent = total.toFixed(2);

  const saldoTarjeta = (Math.random() * (5000 - 1000) + 1000).toFixed(2);
  localStorage.setItem('saldoTarjeta', saldoTarjeta);

  const saldoInput = document.getElementById('saldo');
  if (saldoInput) {
    saldoInput.value = `$${saldoTarjeta}`;
  }

  // Validación de fecha
  const fechaExp = document.getElementById('fechaExp');
  const mensajeFecha = document.createElement('span');
  mensajeFecha.style.color = 'red';
  fechaExp?.parentNode?.insertBefore(mensajeFecha, fechaExp.nextSibling);

  fechaExp?.addEventListener('change', () => {
    if (esFechaExpirada(fechaExp.value)) {
      mensajeFecha.textContent = 'Fecha expirada';
    } else {
      mensajeFecha.textContent = '';
    }
  });

  const formularioCompra = document.getElementById('formularioCompra');
  if (formularioCompra) {
    formularioCompra.addEventListener('submit', (e) => {
      e.preventDefault();

      const terminos = document.getElementById('terminos');
      if (!terminos || !terminos.checked) {
        alert('Debes aceptar los términos y condiciones para continuar.');
        return;
      }

      if (esFechaExpirada(fechaExp?.value)) {
        alert('La fecha de expiración de la tarjeta está vencida.');
        return;
      }

      const numeroTarjeta = generarNumeroTarjeta();

      try {
        const formulario = {
          pais: document.getElementById('pais')?.value || '',
          nombre: document.getElementById('nombre')?.value || '',
          codigoPostal: document.getElementById('cp')?.value || '',
          estado: document.getElementById('estado')?.value || '',
          municipio: document.getElementById('municipio')?.value || '',
          distrito: document.getElementById('distrito')?.value || '',
          direccion: document.getElementById('direccion')?.value || '',
          notas: document.getElementById('notas')?.value || '',
          telefono: document.getElementById('num')?.value || '',
          correo: document.getElementById('correo')?.value || '',
          numeroTarjeta: numeroTarjeta,
          fechaExpiracion: fechaExp?.value || '',
          cvv: document.getElementById('cvv')?.value || ''
        };

        localStorage.setItem('formulario', JSON.stringify(formulario));
        console.log("Formulario guardado correctamente.");

        setTimeout(() => {
          console.log("Redirigiendo a ticketsito.html...");
          window.location.href = 'ticketsito.html';
        }, 500);

      } catch (error) {
        console.error("Error al guardar el formulario o redirigir:", error);
        alert("Ocurrió un error. Revisa los datos e inténtalo nuevamente.");
      }
    });
  }

  function esFechaExpirada(valor) {
    if (!valor) return true;
    const [anio, mes] = valor.split('-').map(Number);
    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    const mesActual = hoy.getMonth() + 1;
    return (anio < añoActual) || (anio === añoActual && mes < mesActual);
  }

  function generarNumeroTarjeta() {
    let numero = '';
    for (let i = 0; i < 16; i++) {
      numero += Math.floor(Math.random() * 10);
    }
    return numero;
  }

});
