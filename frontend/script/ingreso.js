

//const generarPdfButton = document.getElementById("generar-pdf");

const ingresarButton = document.getElementById("buttonIngresar");
const usuario = document.getElementById("usuario");
const passwordUser = document.getElementById("contrasena");


ingresarButton.addEventListener("click", () => {
    const id_usuario = usuario.value;
    const password = passwordUser.value;
    console.log(id_usuario, password);
    if (id_usuario !== "" && password !== "") {
      fetch("/sgcp/v1/ingreso/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ id_usuario: id_usuario, password: password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("La solicitud no fue exitosa");
          }
          return response.json(); // Parsea la respuesta JSON
        })
        .then((data) => {
          // Aquí puedes acceder a los datos del usuario
          const userData = data.usuario;
          console.log("Mensaje del servidor:", data.message);
          console.log("Datos del usuario:", userData);
          // Puedes realizar acciones basadas en los datos del usuario aquí
          window.location.href = "/sgcp/v1/menu";
        })
        .catch((error) => {
          // Manejo de errores, por ejemplo, si la solicitud no pudo completarse
          console.error(error);
          window.alert("El usuario y la constraseña no coinciden");
        });
      
    }
  });
  