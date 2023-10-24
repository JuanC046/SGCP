window.addEventListener('load', function () {
  // Verifica si la variable de recarga está configurada
  if (localStorage.getItem('recargarPagina') === 'true') {
    // Elimina la variable para que no se recargue la próxima vez
    localStorage.removeItem('recargarPagina');

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

  for (let i = 0; i < 3; i++) {
    const columna = document.createElement("div");
    columna.className = "column";
    columna.textContent = datos[i] || ""; // Si no hay datos, establece el contenido como cadena vacía
    fila.appendChild(columna);
  }
  // Agregar la fila al contenedor
  contenedor.appendChild(fila);
}

function listarProveedores() {
  const contenedor = document.getElementById("contenedor-filas");
  // Eliminar todas las filas existentes
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  let listaProveedores = [];
  fetch("/sgcp/v1/obtener/listaProveedores", {
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
      listaProveedores = data;
      listaProveedores.forEach((proveedor) => {
        const datosFila = [
          proveedor.nombre,
          proveedor.id_proveedor,
          proveedor.ciudad,
        ];
        agregarFila(datosFila);
      });
    });
}

listarProveedores();
//----------------------------------------------------------------------
const contenedorFilas = document.getElementById("contenedor-filas");
const buttonVer = document.getElementById("buttonVer");
const buttonEliminar = document.getElementById("buttonEliminar");

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

    fetch("/sgcp/v1/set/proveedor",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
            id_proveedor: contenidoFilaSeleccionada[1],
        }),
    })
    .then((response) => {
        if (response.ok) {
            window.location.href = "/sgcp/v1/ver/proveedor";
        } else if (response.status === 400) {
            response.json().then((data) => {
                if (data.message === "El proveedor no existe") {
                    // Manejar el error "Proveedor no existe"
                    window.alert("El proveedor no existe");
                } else {
                    // Manejar otro tipo de error 400
                    window.alert("Algo salió mal");
                }
            });
        }
    });
  
});

// Evento clic en el botón "ELIMINAR"
buttonEliminar.addEventListener("click", () => {
  const contenidoFilaSeleccionada = obtenerContenidoFilaSeleccionada();

  const confirm = window.confirm(
    `Esta seguro de eliminar el proveedor ${contenidoFilaSeleccionada[0]}?`);
  if (confirm) {
    fetch("/sgcp/v1/eliminar/Proveedor", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        id_proveedor: contenidoFilaSeleccionada[1],
      }),
    }).then((response) => {
      if (response.ok) {
        window.alert("Proveedor eliminado con éxito");
        listarProveedores();
      } else if (response.status === 400) {
        response.json().then((data) => {
          if (data.message === "El proveedor no existe") {
            // Manejar el error "Proveedor no existe"
            window.alert("El proveedor no existe");
          } else {
            // Manejar otro tipo de error 400
            window.alert("Algo salió mal");
          }
        });
      }
    });
  }
});

const botonExportar = document.getElementById("buttonExportar");

botonExportar.addEventListener("click", () => {
  // Realiza una solicitud al servidor para descargar el archivo CSV
  fetch("/sgcp/v1/csv/proveedor")
    .then((response) => {
      if (response.ok) {
        // Leer el cuerpo de la respuesta como un blob
        return response.blob();
      } else {
        // Manejar errores de respuesta
        throw new Error("Error en la solicitud");
      }
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "proveedores.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(() => {
      window.alert("Algo salió mal");
    });
});
