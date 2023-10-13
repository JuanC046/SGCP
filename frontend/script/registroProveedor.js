const nombre = document.getElementById("nombre");
const nit_cc = document.getElementById("nit-cc");
const ciudad = document.getElementById("ciudad");
const telefono = document.getElementById("telefono");

const botonGuardar = document.getElementById("buttonGuardar");
const botonRegresar = document.getElementById("buttonRegresar");


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
    fetch("/sgcp/v1/registro/proveedor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        nombre: nombreProveedor,
        id_proveedor: nit_ccProveedor,
        ciudad: ciudadProveedor,
        telefono: telefonoProveedor,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.alert("Proveedor registrado con éxito");
          window.location.href = "/sgcp/v1/menu";
        } else if (response.status === 400) {
          response.json().then((data) => {
            if (data.message === "El proveedor ya existe") {
              // Manejar el error "Proveedor ya existe"
              window.alert("El proveedor ya existe");
              console.error("Proveedor ya existe:", data.error);
            } else {
              // Manejar otro tipo de error 400
              console.error("Otro tipo de error:", data.error);
            }
          });
        }
      })
      .catch((error) => {
        // Manejar errores
        window.alert("Algo salió mal");
        console.error("Error en la solicitud:", error);
      });
  } else {
    window.alert("Por favor ingrese todos los datos");
  }
});

botonRegresar.addEventListener("click", () => {
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
    console.log("Estoy en el if ");
    fetch("/sgcp/v1/obtener/Proveedor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        id_proveedor: nit_ccProveedor,
      }),
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
        console.log("Datos del proveedor:", data);
        // Puedes hacer lo que desees con los datos, por ejemplo, mostrarlos en tu página web.
        if (data.id_proveedor == nit_ccProveedor) {
          const confirm = window.confirm(
            "Ya has hecho el registro\nQuieres regresar?"
          );
          if (confirm) {
            window.history.back();
          }
        } else {
        }
      })
      .catch((error) => {
        if (error) {
          const confirm = window.confirm(
            "No has hecho el registro\nQuieres regresar?"
          );
          if (confirm) {
            //regresar a la anterior vista cargada
            window.history.back();
          }
        } else window.alert("Algo salió mal");
      });
  } else {
    window.history.back();
    //window.location.href = "/sgcp/v1/menu";
  }
});
