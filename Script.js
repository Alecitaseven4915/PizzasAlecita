document.addEventListener("DOMContentLoaded", function () {
    let ahora = new Date();
    let horaActual = ahora.getHours();

    if (horaActual < 6 || horaActual >= 23) {
        document.body.innerHTML = "<h1>La pizzería está cerrada. Horario: 9:00 a 20:00</h1>";
        return;
    }

    // Página de selección de productos
    if (document.getElementById("pizzas-form")) {
        document.getElementById("nombre").value = localStorage.getItem("nombre") || "";
        document.getElementById("fecha").value = localStorage.getItem("fecha") || "";

        document.getElementById("calcular-total").addEventListener("click", function (event) {
            event.preventDefault();

            let total = 0;
            let pizzasSeleccionadas = [];
            let complementosSeleccionados = [];

            let pizza1 = document.getElementById("pizza1").value;
            let pizza2 = document.getElementById("pizza2").value;
            let pizza3 = document.getElementById("pizza3").value;

            if (pizza1 !== "0") {
                total += parseFloat(pizza1);
                pizzasSeleccionadas.push(document.getElementById("pizza1").selectedOptions[0].text);
            }
            if (pizza2 !== "0") {
                total += parseFloat(pizza2);
                pizzasSeleccionadas.push(document.getElementById("pizza2").selectedOptions[0].text);
            }
            if (pizza3 !== "0") {
                total += parseFloat(pizza3);
                pizzasSeleccionadas.push(document.getElementById("pizza3").selectedOptions[0].text);
            }

            document.querySelectorAll(".complemento:checked").forEach(item => {
                total += parseFloat(item.value);
                complementosSeleccionados.push(item.dataset.nombre);
            });

            let entrega = document.querySelector('input[name="entrega"]:checked');
            if (entrega) {
                total += parseFloat(entrega.value);
                localStorage.setItem("entrega", entrega.dataset.nombre);
            }

            document.getElementById("total").textContent = "Total: $" + total;
            document.getElementById("siguiente-pago").classList.remove("hidden");

            localStorage.setItem("total", total);
            localStorage.setItem("nombre", document.getElementById("nombre").value);
            localStorage.setItem("fecha", document.getElementById("fecha").value);
            localStorage.setItem("pizzas", JSON.stringify(pizzasSeleccionadas));
            localStorage.setItem("complementos", JSON.stringify(complementosSeleccionados));
        });

        document.getElementById("siguiente-pago").addEventListener("click", function () {
            window.location.href = "pagoss.html";
        });
    }

    if (document.getElementById("pagoss-form")) {
        let total = parseFloat(localStorage.getItem("total")) || 0;
        let saldoTarjeta = Math.floor(Math.random() * 1000) + 100;

        document.getElementById("total-pago").textContent = total;
        document.getElementById("debe-efectivo").textContent = total;
        document.getElementById("debe-tarjeta").textContent = total;
        document.getElementById("saldo-tarjeta").textContent = saldoTarjeta;

        document.querySelectorAll('input[name="pago"]').forEach(input => {
            input.addEventListener("change", function () {
                document.getElementById("pago-efectivo").classList.toggle("hidden", this.value !== "efectivo");
                document.getElementById("pago-tarjeta").classList.toggle("hidden", this.value !== "tarjeta");
                document.getElementById("siguiente-ticket").classList.add("hidden");
            });
        });

        document.getElementById("calcular-cambio").addEventListener("click", function () {
            let paga = parseFloat(document.getElementById("paga").value);
            if (paga >= total) {
                document.getElementById("cambio").textContent = "Cambio: $" + (paga - total);
                document.getElementById("siguiente-ticket").classList.remove("hidden");
                localStorage.setItem("metodoPago", "Efectivo");
                localStorage.setItem("datosPago", "No aplica");
            } else {
                document.getElementById("cambio").textContent = "Falta dinero.";
            }
        });

        document.getElementById("confirmar-pago").addEventListener("click", function () {
            let tarjeta = document.getElementById("tarjeta").value;
            let clave = document.getElementById("clave").value;
let mensajeSaldo = document.getElementById("mensaje-saldo");

            if (/^\d{16}$/.test(tarjeta) && /^\d{4}$/.test(clave)) {
                if (saldoTarjeta >= total) {
                    mensajeSaldo.textContent = "Pago exitoso.";
                    mensajeSaldo.classList.remove("hidden");
                    document.getElementById("siguiente-ticket").classList.remove("hidden");

                    let tarjetaOculta = "************" + tarjeta.slice(-4);
                    let claveOculta = "****";

                    localStorage.setItem("metodoPago", "Tarjeta");
                    localStorage.setItem("datosPago", `Tarjeta: ${tarjetaOculta}, Clave: ${claveOculta}`);
                } else {
                    mensajeSaldo.textContent = "Saldo insuficiente.";
                    mensajeSaldo.classList.remove("hidden");
                }
            } else {
                alert("Datos incorrectos. Ingresa solo números.");
            }
        });

        document.getElementById("siguiente-ticket").addEventListener("click", function () {
            window.location.href = "ticket.html";
        });
    }

    // Página del ticket
    if (document.getElementById("ticket")) {
        document.getElementById("ticket-nombre").textContent = localStorage.getItem("nombre");
        document.getElementById("ticket-fecha").textContent = localStorage.getItem("fecha");
        document.getElementById("ticket-total").textContent = localStorage.getItem("total");
        document.getElementById("ticket-metodo").textContent = localStorage.getItem("metodoPago");
        document.getElementById("ticket-datos-pago").textContent = localStorage.getItem("datosPago");
        document.getElementById("ticket-entrega").textContent = localStorage.getItem("entrega");

        let pizzas = JSON.parse(localStorage.getItem("pizzas")) || [];
        let complementos = JSON.parse(localStorage.getItem("complementos")) || [];

        document.getElementById("ticket-pizzas").innerHTML = pizzas.length
            ? pizzas.map(pizza => `<li>${pizza}</li>`).join("")
            : "<li>No seleccionó pizzas</li>";

        document.getElementById("ticket-complementos").innerHTML = complementos.length
            ? complementos.map(c => `<li>${c}</li>`).join("")
            : "<li>Sin complementos</li>";

        document.getElementById("imprimir-ticket").addEventListener("click", function () {
            window.print();
            localStorage.clear();
        });
