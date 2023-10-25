const nombre = document.getElementById("nombre");
const segundo_nombre = document.getElementById("segundoNombre");
const apellido = document.getElementById("apellido");
const segundo_apellido = document.getElementById("segundoApellido");
const tipo_documento = document.getElementById("tipoDocumento");
const numero_documento = document.getElementById("numeroDocumento");
const contrasena = document.getElementById("newContrasena");
const confirmar_contrasena = document.getElementById("confirmContrasena");
const botonRegistrarse = document.getElementById("buttonRegistrarse2");

botonRegistrarse.addEventListener("click", () => {
  const elementosFormulario = [
    nombre.value,
    apellido.value,
    tipo_documento.value,
    numero_documento.value,
    contrasena.value,
    confirmar_contrasena.value,
  ];
  let band = false;
  elementosFormulario.forEach(element => {
    if (element !== "") {
      band = true;
    } else {
      band = false;
    }
  });
  if (band) {
    //validar si nit_cc sea un número
    let regexNumerico = /^[0-9]+$/;
    if (!regexNumerico.test(numero_documento.value)) {
      window.alert("El numero de documento debe ser un número");
      return;
    }
    //validar que los nombres y apellidos no contengan números 
    let regexAlfabetico = /^[A-Za-zÀ-ÖØ-öø-ÿÀ-ÖØ]+$/;
    if (!regexAlfabetico.test(nombre.value)) {
      window.alert("El nombre no puede contener números");
      return;
    }
    if (!regexAlfabetico.test(segundo_nombre.value) && segundo_nombre.value !== "") {
      window.alert("El segundo nombre no puede contener números");
      return;
    }
    if (!regexAlfabetico.test(apellido.value)) {
      window.alert("El apellido no puede contener números");
      return;
    }
    if (!regexAlfabetico.test(segundo_apellido.value) && segundo_apellido.value !== "") {
      window.alert("El segundo apellido no puede contener números");
      return;
    }
    if (contrasena.value === confirmar_contrasena.value) {
      fetch("/sgcp/v1/registro/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          nombre: nombre.value,
          segundo_nombre: segundo_nombre.value.length == 0? null : segundo_nombre.value,
          apellido: apellido.value,
          segundo_apellido: segundo_apellido.value.length == 0? null : segundo_apellido.value,
          tipo_documento: tipo_documento.value,
          id_usuario: numero_documento.value,
          contrasena: contrasena.value,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("La solicitud no fue exitosa");
          }
          window.alert("Registro exitoso");
          window.location.href = "/sgcp/v1/ingreso";
        })
        .catch((error) => {
          // Manejo de errores, por ejemplo, si la solicitud no pudo completarse
          window.alert("No fue posible hacer el registro");
        });
    } else {
      window.alert("Las contraseñas no coinciden");
    }
  } else {
    window.alert("Por favor ingrese todos los datos solicitados");
  }
});
