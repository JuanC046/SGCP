const nombreUsuario = document.getElementById("h3-CP");
const fecha = document.getElementById("fecha");
const nComprobante = document.getElementById("nComprobante");
const pagadoA = document.getElementById("pagadoA");
const seleccionPagadoA = document.getElementById("seleccionPagadoA");
const descripcionPago = document.getElementById("descripcionPago");
const descripcionDescuento = document.getElementById("descripcionDescuento");
const valorDescuento = document.getElementById("valorDescuento");
const valorBruto = document.getElementById("valorBruto");
const valorNeto = document.getElementById("valorNeto");

const botonGuardar = document.getElementById("buttonGuardar");
const botonRegresar = document.getElementById("buttonRegresar");
const botonExportar = document.getElementById("buttonExportar");

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
  });
nombreUsuario.textContent = datosUsuario;

let numeroComprobante = null
await fetch("/sgcp/v1/obtener/ultimo/comprobantePago",
{
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
        if (data.message === "El comprobante no existe") {
          // Manejar el error "Usuario no existe"
          window.alert("El comprobante no existe");
        } else {
          // Manejar otro tipo de error 400
          window.alert("Algo salió mal");
        }
      })
    }
  })
  .then((data) => {
    numeroComprobante = data.num_ultimo_cp;
    nComprobante.value = numeroComprobante != null? numeroComprobante + 1 : 1 ;
  });

let listaProveedores = []
await fetch("/sgcp/v1/obtener/listaProveedores/comprobantePago",
{
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
        if (data.message === "El comprobante no existe") {
          // Manejar el error "Usuario no existe"
          window.alert("El comprobante no existe");
        } else {
          // Manejar otro tipo de error 400
          window.alert("Algo salió mal");
        }
      })
    }
  })
  .then((data) => {
    listaProveedores = data;
  });
//crear una función que agrege las opciones de proveedores dentro el select pagadoA
function agregarOpciones() {
  for (let i = 0; i < listaProveedores.length; i++) {
    let opcion = document.createElement("option");
    opcion.value = listaProveedores[i].id_proveedor;
    opcion.text = listaProveedores[i].nombre;
    pagadoA.add(opcion);
  }
}
agregarOpciones()

// Agregar un manejador de eventos al elemento select
pagadoA.addEventListener("change", function() {
  const opcionSeleccionada = pagadoA.options[pagadoA.selectedIndex];
  const valorSeleccionado = opcionSeleccionada.text;
  console.log(valorSeleccionado)
  seleccionPagadoA.value = valorSeleccionado;
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
  if (
    data_num_comprobante !== "" &&
    data_fecha !== "" &&
    data_pagado_a !== "" &&
    data_descripcion_pago !== "" &&
    data_valor_bruto !== "" &&
    data_valor_neto !== ""
  ) {
    if (data_valor_neto < 0 || data_valor_descuento < 0 || data_valor_bruto < 0){
      window.alert("Los valores no pueden ser negativos");
      return;
    }
    fetch("/sgcp/v1/crear/comprobantePago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        num_comprobante: data_num_comprobante,
        fecha: data_fecha,
        id_proveedor: data_pagado_a,
        descripcion_pago: data_descripcion_pago,
        descripcion_descuento: data_descripcion_descuento.length == 0? null : data_descripcion_descuento,
        valor_descuento: data_valor_descuento.length == 0? null : data_valor_descuento,
        valor_bruto: data_valor_bruto,
        valor_neto: data_valor_neto,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.alert("Comprobante de pago creado con éxito");
          window.location.href = "/sgcp/v1/menu";
        } else if (response.status === 400) {
          response.json().then((data) => {
            if (data.message === "El comprobante ya existe") {
              // Manejar el error "Proveedor ya existe"
              window.alert("Ya hay un registro relacionado");
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
  const data_num_comprobante = nComprobante.value;
  const data_fecha = fecha.value;
  const data_pagado_a = pagadoA.value;
  const data_descripcion_pago = descripcionPago.value;
  const data_descripcion_descuento = descripcionDescuento.value;
  const data_valor_descuento = valorDescuento.value;
  const data_valor_bruto = valorBruto.value;
  const data_valor_neto = valorNeto.value;

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
        num_comprobante : data_num_comprobante,
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
              if (data.num_comprobante == data_num_comprobante) {
                const confirm = window.confirm(
                  "Ya existe un registro relacionado\nQuieres regresar?"
                );
                if (confirm) {
                  window.history.back();
                }
              } else {
                const confirm = window.confirm(
                  "No has hecho el registro\nQuieres regresar?"
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
                  "No has hecho el registro\nQuieres regresar?"
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
  }
});
