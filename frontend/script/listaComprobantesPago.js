window.addEventListener("load", function () {
  // Verifica si la variable de recarga está configurada
  if (localStorage.getItem("recargarPagina") === "true") {
    // Elimina la variable para que no se recargue la próxima vez
    localStorage.removeItem("recargarPagina");

    // Recarga la página
    location.reload();
  }
});

// Función para crear y agregar una fila al contenedor
function agregarFila(datos) {
  const contenedor = document.getElementById("contenedor-filas");

  // Crear elementos para la fila
  const fila = document.createElement("div");
  fila.className = "row";

  for (let i = 0; i < 4; i++) {
    const columna = document.createElement("div");
    columna.className = "column";
    columna.textContent = datos[i] || ""; // Si no hay datos, establece el contenido como cadena vacía
    fila.appendChild(columna);
  }
  // Agregar la fila al contenedor
  contenedor.appendChild(fila);
}

function formatearFecha(fecha) {
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  return fechaFormateada;
}

function listarComprobantes() {
  const contenedor = document.getElementById("contenedor-filas");
  // Eliminar todas las filas existentes
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  let listaComprobantesDePago = [];
  fetch("/sgcp/v1/obtener/listaComprobantesDePago", {
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
      listaComprobantesDePago = data;
      listaComprobantesDePago.forEach((item) => {
        item.fecha = formatearFecha(item.fecha);
      });
      console.log("Lista de proveedores:", listaComprobantesDePago);
      listaComprobantesDePago.forEach((comprobante) => {
        const datosFila = [
          comprobante.num_comprobante,
          comprobante.fecha,
          comprobante.proveedor,
          comprobante.valor_neto,
        ];
        agregarFila(datosFila);
      });
    });
}

listarComprobantes();
//----------------------------------------------------------------------
const contenedorFilas = document.getElementById("contenedor-filas");
const buttonVer = document.getElementById("buttonVer");
const buttonEliminar = document.getElementById("buttonEliminar");

const ordenado = document.getElementById("ordenado");
const seleccionOrdenado = document.getElementById("seleccionOrdenado");

ordenado.addEventListener("change", function () {
  const opcionSeleccionada = ordenado.options[ordenado.selectedIndex];
  const valorSeleccionado = opcionSeleccionada.textContent;
  console.log(valorSeleccionado);
  seleccionOrdenado.value = valorSeleccionado;
  let listaComprobantesDePago = [];

  const fetchData = (url) => {
    fetch(url, {
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
              window.alert("El usuario no existe");
              console.error("Usuario no existe:", data.error);
            } else {
              console.error("Otro tipo de error:", data.error);
            }
          });
        }
      })
      .then((data) => {
        listaComprobantesDePago = data;
        listaComprobantesDePago.forEach((item) => {
          item.fecha = formatearFecha(item.fecha);
        });
        console.log("Lista de comprobantes:", listaComprobantesDePago);
        listaComprobantesDePago.forEach((comprobante) => {
          const datosFila = [
            comprobante.num_comprobante,
            comprobante.fecha,
            comprobante.proveedor,
            comprobante.valor_neto,
          ];
          agregarFila(datosFila);
        });
      });
  };

  if (seleccionOrdenado.value === "Proveedor") {
    const contenedor = document.getElementById("contenedor-filas");
    // Eliminar todas las filas existentes
    while (contenedor.firstChild) {
      contenedor.removeChild(contenedor.firstChild);
    }
    fetchData("/sgcp/v1/obtener/por/proveedor/listaComprobantesDePago");
  } else if (seleccionOrdenado.value === "Fecha") {
    const contenedor = document.getElementById("contenedor-filas");
    // Eliminar todas las filas existentes
    while (contenedor.firstChild) {
      contenedor.removeChild(contenedor.firstChild);
    }
    fetchData("/sgcp/v1/obtener/por/fecha/listaComprobantesDePago");
  }
});


// Función para cambiar el estado de selección de una fila
function toggleSeleccion(fila) {
  const isSelected = fila.getAttribute("data-selected") === "true";
  fila.setAttribute("data-selected", !isSelected);
  fila.style.backgroundColor = isSelected ? "" : "#a0a0a0"; // Cambiar el color de fondo al seleccionar
}

// Función para deseleccionar todas las filas excepto la actual
function deseleccionarOtrasFilas(filaSeleccionada) {
  const filas = contenedorFilas.querySelectorAll(".row");
  filas.forEach((fila) => {
    if (fila !== filaSeleccionada) {
      fila.setAttribute("data-selected", "false");
      fila.style.backgroundColor = "";
    }
  });
}

// Evento clic en el contenedor de filas (delegado)
contenedorFilas.addEventListener("click", (event) => {
  const fila = event.target.closest(".row");
  if (fila) {
    deseleccionarOtrasFilas(fila);
    toggleSeleccion(fila);
  }
});

function obtenerContenidoFilaSeleccionada() {
  const filaSeleccionada = contenedorFilas.querySelector(
    ".row[data-selected='true']"
  );
  if (filaSeleccionada) {
    const columnas = filaSeleccionada.querySelectorAll(".column");
    const contenidoFila = [];

    columnas.forEach((columna) => {
      contenidoFila.push(columna.textContent);
    });

    return contenidoFila;
  } else {
    return null; // Si no hay una fila seleccionada, devuelve null o puedes manejarlo de otra manera.
  }
}

// Evento clic en el botón "VER"
buttonVer.addEventListener("click", () => {
  const contenidoFilaSeleccionada = obtenerContenidoFilaSeleccionada();
  console.log("Filas seleccionadas para eliminar:", contenidoFilaSeleccionada);

  fetch("/sgcp/v1/set/comprobantePago", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      num_comprobante: contenidoFilaSeleccionada[0],
    }),
  }).then((response) => {
    if (response.ok) {
      window.location.href = "/sgcp/v1/ver/comprobantePago";
    } else if (response.status === 400) {
      response.json().then((data) => {
        if (data.message === "El proveedor no existe") {
          // Manejar el error "Proveedor no existe"
          window.alert("El proveedor no existe");
          console.error("Proveedor no existe:", data.error);
        } else {
          // Manejar otro tipo de error 400
          console.error("Otro tipo de error:", data.error);
        }
      });
    }
  });
});

// Evento clic en el botón "ELIMINAR"
buttonEliminar.addEventListener("click", () => {
  const contenidoFilaSeleccionada = obtenerContenidoFilaSeleccionada();
  console.log("Filas seleccionadas para eliminar:", contenidoFilaSeleccionada);

  const confirm = window.confirm(
    `Esta seguro de eliminar el comprobante ${contenidoFilaSeleccionada[0]}?`
  );
  if (confirm) {
    fetch("/sgcp/v1/eliminar/ComprobantePago", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        num_comprobante: contenidoFilaSeleccionada[0],
      }),
    }).then((response) => {
      if (response.ok) {
        window.alert("Comprobante de pago eliminado con éxito");
        listarComprobantes();
      } else if (response.status === 400) {
        response.json().then((data) => {
          if (data.message === "El comprobante de pago no existe") {
            // Manejar el error comprbante no existe"
            window.alert("El comprobante de pago no existe");
            console.error("El comprobante no existe:", data.error);
          } else {
            // Manejar otro tipo de error 400
            console.error("Otro tipo de error:", data.error);
          }
        });
      }
    });
  }
});
