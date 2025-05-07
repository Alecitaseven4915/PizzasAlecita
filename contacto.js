emailjs.init("UJ7yeBrxlmAuvQdER");

    document.getElementById("contact-form").addEventListener("submit", function(event) {
      event.preventDefault();

      emailjs.sendForm("service_ov261yq", "template_je0zj6b", this)
        .then(function() {
          document.getElementById("success-message").style.display = "block";
          document.getElementById("contact-form").reset();
        }, function(error) {
          alert("Error al enviar el formulario: " + JSON.stringify(error));
        });
    });
    