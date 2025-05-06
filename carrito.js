let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
  const datosGuardados = JSON.parse(localStorage.getItem('carrito'));
  if (datosGuardados) {
    carrito = datosGuardados;
  }
  actualizarContadorCarrito();
});

const botones = document.querySelectorAll('.add-to-cart');

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    const productoDiv = boton.closest('.trend-item');
    const nombre = productoDiv.querySelector('p').textContent;
    const precioTexto = productoDiv.querySelector('.trend-price').textContent;
    const precio = parseFloat(precioTexto.replace('$', '').replace('MX', '').trim());

    const producto = {
      nombre,
      precio
    };

    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
  });
});

function actualizarContadorCarrito() {
  const btn = document.getElementById('btn-carrito');
  if (btn) {
    btn.textContent = `Finalizar compra (${carrito.length})`;
  }
}

const btnFinalizarCompra = document.getElementById('btn-carrito');

if (btnFinalizarCompra) {
  btnFinalizarCompra.addEventListener('click', (event) => {
    if (carrito.length === 0) {
      event.preventDefault(); 
      alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
    }
    else {
      window.location.href = 'formulario.html'; 
    }
  });
}


const enlacesMenu = document.querySelectorAll('a');

enlacesMenu.forEach(enlace => {
  enlace.addEventListener('click', () => {
    if (enlace.href.includes('menu.html')) {  
      localStorage.removeItem('carrito');
    }
  });
});
