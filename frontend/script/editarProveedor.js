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
        } else {
          // Manejar otro tipo de error 400
          window.alert("Algo salió mal");
        }
      });
    }
  })
  .then((data) => {
    datosProveedor = data;
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

function estanHabilitadosInputs() {
  var inputs = document.querySelectorAll(".inputHabilitar");
  var habilitados = true;
  inputs.forEach(function (input) {
    if (input.hasAttribute("disabled")) {
      habilitados = false;
    }
  });
  return habilitados;
}

botonEditar.addEventListener("click", () => {
  habilitarInputs();
  botonGuardar.removeAttribute("disabled");
});

botonGuardar.addEventListener("click", () => {
  const nombreProveedor = nombre.value;
  const nit_ccProveedor = nit_cc.value;
  const ciudadProveedor = ciudad.value;
  const telefonoProveedor = telefono.value;
  if (
    nombreProveedor !== "" &&
    nit_ccProveedor !== "" &&
    ciudadProveedor !== "" &&
    telefonoProveedor !== ""
  ) {
    //validar si nit_cc sea un número
    let regexNumerico = /^[0-9]+$/;
    if (!regexNumerico.test(nit_ccProveedor)) {
      window.alert("El nit o cc debe ser un número");
      return;
    }
    //validar que la ciudad no contenga numeros
    let regexAlfabetico = /^[A-Za-zÀ-ÖØ-öø-ÿÀ-ÖØ]+$/;
    if (!regexAlfabetico.test(ciudadProveedor)) {
      window.alert("La ciudad no puede contener números");
      return;
    }
    //validar que el telefono sea un número
    if (!regexNumerico.test(telefonoProveedor)) {
      window.alert("El telefono debe ser un número");
      return;
    }
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
            } else {
              // Manejar otro tipo de error 400
              window.alert("Algo salió mal");
            }
          });
        }
      })
      .catch((error) => {
        // Ocurrió algún error
        window.alert("Algo salió mal");
      });
  }
  deshabilitarInputs();
});

botonRegresar.addEventListener("click", () => {
  if (!estanHabilitadosInputs()) {
    localStorage.setItem('recargarPagina', 'true');
    window.history.back(); 
  }
  const nombreProveedor = nombre.value;
  const nit_ccProveedor = nit_cc.value;
  const ciudadProveedor = ciudad.value;
  const telefonoProveedor = telefono.value;
  if (
    nombreProveedor !== "" &&
    nit_ccProveedor !== "" &&
    ciudadProveedor !== "" &&
    telefonoProveedor !== ""
  ) {
    fetch("/sgcp/v1/set/proveedor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        id_proveedor: nit_ccProveedor,
      }),
    }).then((response) => {
      if (response.ok) {
        fetch("/sgcp/v1/obtener/Proveedor", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        })
          .then((response) => {
            if (response.ok) {
              // Respuesta exitosa (código 2xx)
              return response.json(); // Parsear la respuesta JSON
            } else {
              // Otro error
              return Promise.reject("Error desconocido");
            }
          })
          .then((data) => {
            // Manejar la respuesta exitosa
            // Puedes hacer lo que desees con los datos, por ejemplo, mostrarlos en tu página web.
            //Comprobar que los elementos de data sean iguales a los de los inputs
            let iguales = false;
            if (
              nombreProveedor === data.nombre &&
              nit_ccProveedor === data.id_proveedor &&
              ciudadProveedor === data.ciudad &&
              telefonoProveedor === data.telefono
            ) {
              iguales = true;
            }
            if (iguales) {
              localStorage.setItem('recargarPagina', 'true');
              window.history.back();
            } else {
              const confirm = window.confirm(
                "No has guardado los cambios\nQuieres regresar?"
              );
              if (confirm) {
                //regresar a la anterior vista cargada
                localStorage.setItem('recargarPagina', 'true');
                window.history.back();
              }
            }
          })
          .catch((error) => {
            if (error) {
              window.alert("Algo salió mal");
            }
          })
      } else {
        localStorage.setItem('recargarPagina', 'true');
        window.history.back();
      }
    });
  }
});
