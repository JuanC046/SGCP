const nombre = document.getElementById("nombre");
const nit_cc = document.getElementById("nit-cc");
const ciudad = document.getElementById("ciudad");
const telefono = document.getElementById("telefono");

const botonGuardar = document.getElementById("buttonGuardar");
const botonRegresar = document.getElementById("buttonRegresar");
const botonEditar = document.getElementById("buttonEditar");

let datosProveedor = {};
fetch("/sgcp/v1/obtener/Proveedor", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  mode: "cors",
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 400) {
      response.json().then((data) => {
        if (data.message === "El usuario no existe") {
          // Manejar el error "Usuario no existe"
          window.alert("El usuario no existe");
          console.error("Usuario no existe:", data.error);
        } else {
          // Manejar otro tipo de error 400
          console.error("Otro tipo de error:", data.error);
        }
      });
    }
  })
  .then((data) => {
    datosProveedor = data;
    console.log("Proveedor:", datosProveedor);
    nombre.value = datosProveedor.nombre;
    nit_cc.value = datosProveedor.id_proveedor;
    ciudad.value = datosProveedor.ciudad;
    telefono.value = datosProveedor.telefono;
  });

function habilitarInputs() {
  var inputs = document.querySelectorAll(".inputHabilitar");
  inputs.forEach(function (input) {
    input.removeAttribute("disabled");
  });
}

function deshabilitarInputs() {
  var inputs = document.querySelectorAll(".inputHabilitar");
  inputs.forEach(function (input) {
    input.setAttribute("disabled", "");
  });
}

botonEditar.addEventListener("click", () => {
  habilitarInputs();
  botonGuardar.removeAttribute("disabled");
  botonEditar.setAttribute("disabled", "");
});

botonGuardar.addEventListener("click", () => {
  const nombreProveedor = nombre.value;
  const nit_ccProveedor = nit_cc.value;
  const ciudadProveedor = ciudad.value;
  const telefonoProveedor = telefono.value;
  console.log(
    nombreProveedor,
    nit_ccProveedor,
    ciudadProveedor,
    telefonoProveedor
  );
  if (
    nombreProveedor !== "" &&
    nit_ccProveedor !== "" &&
    ciudadProveedor !== "" &&
    telefonoProveedor !== ""
  ) {
    fetch("/sgcp/v1/actualizar/Proveedor", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_proveedor: nit_ccProveedor,
        nombre: nombreProveedor,
        ciudad: ciudadProveedor,
        telefono: telefonoProveedor,
      }),
      mode: "cors",
    })
      .then((response) => {
        if (response.ok) {
          window.alert("Proveedor editado con éxito");
        } else if (response.status === 400) {
          response.json().then((data) => {
            if (data.message === "El proveedor no existe") {
              // Manejar el error "Usuario no existe"
              window.alert("El proveedor no existe");
              console.error("Proveedor no existe:", data.error);
            } else {
              // Manejar otro tipo de error 400
              console.error("Otro tipo de error:", data.error);
            }
          });
        }
      })
      .catch((error) => {
        // Ocurrió algún error
        console.error("Error:", error);
      });
  }
});
