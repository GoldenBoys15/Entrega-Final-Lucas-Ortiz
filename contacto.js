document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    // Lógica para validar el formulario si es necesario

    displaySuccessMessage();
});

function displaySuccessMessage() {
    Swal.fire({
        title: '¡Formulario enviado correctamente!',
        icon: 'success',
        confirmButtonText: '¡Entendido!'
    });
}