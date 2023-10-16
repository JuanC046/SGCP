const nombreUsuario = document.getElementById("h3-CP");
const fecha = document.getElementById("fecha");
const nComprobante = document.getElementById("nComprobante");
const pagadoA = document.getElementById("seleccionPagadoA");
const descripcionPago = document.getElementById("descripcionPago");
const descripcionDescuento = document.getElementById("descripcionDescuento");
const valorDescuento = document.getElementById("valorDescuento");
const valorBruto = document.getElementById("valorBruto");
const valorNeto = document.getElementById("valorNeto");

const botonGuardar = document.getElementById("buttonGuardar");
const botonRegresar = document.getElementById("buttonRegresar");
const botonExportar = document.getElementById("buttonExportar");
const botonEditar = document.getElementById("buttonEditar");
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
  });
nombreUsuario.textContent = datosUsuario;

function formatearFecha(fecha) {
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ajusta el mes a dos dígitos
  const day = String(date.getDate()).padStart(2, "0"); // Ajusta el día a dos dígitos

  return `${year}-${month}-${day}`;
}

let datosComprobantePago = {};
await fetch("/sgcp/v1/obtener/ComprobantePago", {
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
    datosComprobantePago = data;
    console.log("Comprobante de pago:", datosComprobantePago);
    datosComprobantePago.fecha = formatearFecha(datosComprobantePago.fecha);
    nComprobante.value = datosComprobantePago.num_comprobante;
    fecha.value = datosComprobantePago.fecha;
    pagadoA.value = datosComprobantePago.nombre_proveedor;
    descripcionPago.value = datosComprobantePago.descripcion_pago;
    descripcionDescuento.value = datosComprobantePago.descripcion_descuento;
    valorDescuento.value = datosComprobantePago.valor_descuento;
    valorBruto.value = datosComprobantePago.valor_bruto;
    valorNeto.value = datosComprobantePago.valor_neto;
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
  botonExportar.style.display = "none";
});

botonGuardar.addEventListener("click", () => {
  const data_num_comprobante = nComprobante.value;
  const data_fecha = fecha.value;
  const data_pagado_a = pagadoA.value;
  const data_descripcion_pago = descripcionPago.value;
  const data_descripcion_descuento = descripcionDescuento.value;
  const data_valor_descuento = valorDescuento.value;
  const data_valor_bruto = valorBruto.value;
  const data_valor_neto = valorNeto.value;

  console.log(
    data_num_comprobante,
    data_fecha,
    data_pagado_a,
    data_descripcion_pago,
    data_descripcion_descuento,
    data_valor_descuento,
    data_valor_bruto,
    data_valor_neto
  );
  if (
    data_num_comprobante !== "" &&
    data_fecha !== "" &&
    data_pagado_a !== "" &&
    data_descripcion_pago !== "" &&
    data_valor_bruto !== "" &&
    data_valor_neto !== ""
  ) {
    fetch("/sgcp/v1/actualizar/ComprobantePago", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        descripcion_pago: data_descripcion_pago,
        descripcion_descuento:
          data_descripcion_descuento.length == 0
            ? null
            : data_descripcion_descuento,
        valor_descuento:
          data_valor_descuento.length == 0 ? null : data_valor_descuento,
        valor_bruto: data_valor_bruto,
        valor_neto: data_valor_neto,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.alert("Comprobante de pago actualizado con éxito");
          botonExportar.style.display = "inline-block";
        } else if (response.status === 400) {
          response.json().then((data) => {
            if (data.message === "El comprobante no se pudo actualizar") {
              // Manejar el error "Proveedor ya existe"
              window.alert("El comprobante no se pudo actualizar");
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
  deshabilitarInputs();
});

botonRegresar.addEventListener("click", () => {
  const data_num_comprobante = nComprobante.value;
  const data_fecha = fecha.value;
  const data_pagado_a = pagadoA.value;
  const data_descripcion_pago = descripcionPago.value;
  const data_descripcion_descuento = descripcionDescuento.value;
  const data_valor_descuento = valorDescuento.value;
  const data_valor_bruto = valorBruto.value;
  const data_valor_neto = valorNeto.value;

  console.log(
    data_num_comprobante,
    data_fecha,
    data_pagado_a,
    data_descripcion_pago,
    data_descripcion_descuento,
    data_valor_descuento,
    data_valor_bruto,
    data_valor_neto
  );
  if (
    data_num_comprobante !== "" &&
    data_fecha !== "" &&
    data_pagado_a !== "" &&
    data_descripcion_pago !== "" &&
    data_valor_bruto !== "" &&
    data_valor_neto !== ""
  ) {
    console.log("Estoy en el if ");
    fetch("/sgcp/v1/set/comprobantePago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        num_comprobante: data_num_comprobante,
      }),
    })
      .then((response) => {
        if (response.ok) {
          fetch("/sgcp/v1/obtener/ComprobantePago", {
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
              console.log("Datos del proveedor:", data);
              // Puedes hacer lo que desees con los datos, por ejemplo, mostrarlos en tu página web.
              if (
                (data.num_comprobante == data_num_comprobante,
                data.fecha == data_fecha,
                data.nombre_proveedor == data_pagado_a,
                data.descripcion_pago == data_descripcion_pago,
                data.descripcion_descuento == data_descripcion_descuento,
                data.valor_descuento == data_valor_descuento,
                data.valor_bruto == data_valor_bruto,
                data.valor_neto == data_valor_neto)
              )
                window.history.back();
              else {
                const confirm = window.confirm(
                  "No has guardado los cambios\nQuieres regresar?"
                );
                if (confirm) {
                  //regresar a la anterior vista cargada
                  window.history.back();
                }
              }
            })
            .catch((error) => {
              if (error) {
                const confirm = window.confirm(
                  "No has guardado los cambios\nQuieres regresar?"
                );
                if (confirm) {
                  //regresar a la anterior vista cargada
                  window.history.back();
                }
              } else window.alert("Algo salió mal");
            });
        }
      })
      .catch((error) => {
        // Manejar errores
        window.alert("Algo salió mal");
        console.error("Error en la solicitud:", error);
      });
  } else {
    window.history.back();
    //window.location.href = "/sgcp/v1/menu";
  }
});

//------------------------------------------------
botonExportar.addEventListener("click", () => {
  const data_num_comprobante = nComprobante.value;
  fetch("/sgcp/v1/set/comprobantePago", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      num_comprobante: data_num_comprobante,
    }),
  })
    .then(() => {
      fetch("/sgcp/v1/exportar/ComprobantePago", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      })
        .then((response) => {
          if (response.ok) {
            window.alert("Comprobante de pago exportado con éxito");
          } else if (response.status === 400) {
            response.json().then((data) => {
              if (data.message === "El comprobante no se pudo exportar") {
                // Manejar el error "Proveedor ya existe"
                window.alert("El comprobante no se pudo exportar");
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
    })
    .catch((error) => {
      // Manejar errores
      window.alert("Algo salió mal");
      console.error("Error en la solicitud:", error);
    });
}); 
