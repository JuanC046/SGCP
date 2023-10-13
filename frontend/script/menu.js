// En tu archivo JavaScript del menú
const nombreUsuario = document.getElementById("h3-nombreUsuario");
const botonCerrarSesion = document.getElementById("cerrarSesion");

let datosUsuario = null;

await fetch("/sgcp/v1/obtener/usuario")
.then((response) => {
    if (!response.ok) {
      throw new Error("La solicitud no fue exitosa");
    }
    return response.json(); // Parsea la respuesta JSON
  })
  .then((data) => {
    // Aquí puedes acceder a los datos del usuario
    datosUsuario = data;
    console.log("Datos del usuario:", datosUsuario);
  })
  nombreUsuario.textContent = datosUsuario


botonCerrarSesion.addEventListener("click", () => {
  fetch("/sgcp/v1/cerrar/sesion", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La solicitud no fue exitosa");
      }
      return response.json(); // Parsea la respuesta JSON
    })
    .then(() => {
      window.location.href = "/sgcp/v1/";
    })
    .catch((error) => {
      // Manejo de errores, por ejemplo, si la solicitud no pudo completarse
      console.error(error);
    });
});