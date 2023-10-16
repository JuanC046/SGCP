const router = require("express").Router();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const {
  listaProveedores,
  listaComprobantesDePago,
  listaComprobantesDePago_proveedor,
  listaComprobantesDePago_fecha,
  existeUsuario,
  crearUsuario,
  existeProveedor,
  crearProveedor,
  listaProveedoresCompPago,
  ultimoCompPago,
  crearCompPago,
  datosProveedor,
  actualizarProveedor,
  datosComprobantePago,
  actualizarComprobantePago,
  eliminarProveedor,
  eliminarComprobantePago,
  leerUsuario,
  escribirUsuario,
  borrarUsuario,
  eliminarPdfs,
} = require("../service/data.service");

const { crearJson, generarPdf } = require("../service/generar_pdf");

router.use(bodyParser.json());
router.use(express.json());

//Renders -----------------------------------------------------
router.use(express.static(path.join(__dirname, "../frontend")));

router.get("/", (req, res) => {
  res.render("inicio");
});

router.get("/ingreso", (req, res) => {
  res.render("ingreso");
});

router.get("/registro", (req, res) => {
  res.render("registro");
});

router.get("/comprobanteDePago", (req, res) => {
  res.render("comprobantePago");
});

router.get("/listaComprobantesDePago", (req, res) => {
  res.render("listaCompPago");
});

router.get("/listaProveedores", (req, res) => {
  res.render("listaProveedor");
});

router.get("/menu", (req, res) => {
  res.render("menu");
});

router.get("/proveedor", (req, res) => {
  res.render("proveedor");
});

router.get("/ver/proveedor", (req, res) => {
  res.render("editarProveedor");
});

router.get("/ver/comprobantePago", (req, res) => {
  res.render("editarComprobantePago");
});

router.get("/obtener/usuario", (req, res) => {
  const usuario = leerUsuario();
  console.log(usuario);
  res.status(200).json(usuario.nombreUsuario);
});
//-----------------------------------------------------
router.post("/set/proveedor", async (req, res) => {
  const id_proveedor = req.body.id_proveedor;
  console.log(req.body);
  const datosUsuario = leerUsuario();
  datosUsuario.id_proveedor = id_proveedor;
  try {
    escribirUsuario(datosUsuario);
    res.status(200).json({ message: "Proveedor seteado con éxito" });
  } catch {
    console.error("Error en la consulta:", error);
    res.status(400).json({ error: "Error en la consulta" });
  }
});

router.post("/set/comprobantePago", async (req, res) => {
  const num_comprobante = req.body.num_comprobante;
  console.log(req.body);
  const datosUsuario = leerUsuario();
  datosUsuario.num_comprobante = num_comprobante;
  try {
    escribirUsuario(datosUsuario);
    res.status(200).json({ message: "Comprobante seteado con éxito" });
  } catch {
    console.error("Error en la consulta:", error);
    res.status(400).json({ error: "Error en la consulta" });
  }
});

router.post("/ingreso/usuario", async (req, res) => {
  const id_usuario = req.body.id_usuario;
  const password = req.body.password;
  console.log(req.body);
  existeUsuario(id_usuario)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      if (result.length === 0) {
        // No existe el usuario
        console.log("El usuario no está registrado");
        res.status(400).json({ error: "El usuario no está registrado" });
      } else if (result[0].contrasena === password) {
        console.log("Ingreso exitoso");
        const userData = result[0];
        const datosUsuario = {
          nombreUsuario: (
            userData.nombre +
            " " +
            (userData.segundo_nombre === null ? "" : userData.segundo_nombre) +
            " " +
            userData.apellido +
            " " +
            (userData.segundo_apellido === null
              ? ""
              : userData.segundo_apellido)
          ).toUpperCase(),
          id_usuario: userData.id_usuario,
          id_proveedor: null,
          num_comprobante: null,
        };
        escribirUsuario(datosUsuario);
        res.status(200).json({ message: "Ingreso exitoso" });
      } else {
        console.log("La contraseña es incorrecta");
        res.status(400).json({ error: "La contraseña es incorrecta" });
      }
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400).json({ error: "Error en la consulta" });
    });
});

router.post("/registro/usuario", async (req, res) => {
  const id_usuario = req.body.id_usuario;
  console.log(id_usuario);
  existeUsuario(id_usuario)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      if (result.length === 0) {
        // No existe el usuario
        const datos = [
          req.body.id_usuario,
          req.body.contrasena,
          req.body.nombre,
          req.body.segundo_nombre,
          req.body.apellido,
          req.body.segundo_apellido,
          req.body.tipo_documento,
        ];
        crearUsuario(datos)
          .then(() => {
            console.log("Usuario creado con éxito");
            res.status(200).json({ message: "Usuario creado con éxito" });
          })
          .catch((error) => {
            console.error("Error en la consulta:", error);
            res.status(400).json({ error: "Error al crear el usuario" });
          });
      } else {
        const mensaje = "El usuario ya existe";
        res.status(400).json({ error: mensaje });
      }
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400).json({ error: "Error en la consulta" });
    });
});

router.post("/registro/proveedor", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  const id_proveedor = req.body.id_proveedor;
  existeProveedor(id_usuario, id_proveedor)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      if (result.length == 0) {
        // No existe el proveedor
        const datos = [
          req.body.id_proveedor,
          req.body.nombre,
          req.body.ciudad,
          req.body.telefono,
          id_usuario,
        ];
        crearProveedor(datos)
          .then(() => {
            console.log("Proveedor creado con éxito");
            res.status(200).json({ message: "Proveedor creado con éxito" });
          })
          .catch((error) => {
            console.error("Error en la consulta:", error);
            res.status(400).json({ error: "Error al crear el proveedor" });
          });
      } else {
        const mensaje = "El proveedor ya existe";
        res.status(400).json({ message: mensaje });
      }
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400).json({ error: "Error en la consulta" });
    });
});

router.get("/obtener/listaProveedores/comprobantePago", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;

  listaProveedoresCompPago(id_usuario)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400);
    });
});

router.get("/obtener/ultimo/comprobantePago", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;

  ultimoCompPago(id_usuario)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      res.status(200).json(result[0]);
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400);
    });
});

router.post("/crear/comprobantePago", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  const datos = [
    req.body.num_comprobante,
    id_usuario,
    req.body.fecha,
    req.body.id_proveedor,
    req.body.descripcion_pago,
    req.body.descripcion_descuento,
    req.body.valor_descuento,
    req.body.valor_bruto,
    req.body.valor_neto,
  ];
  crearCompPago(datos)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      console.log("Comprobante de pago creado con éxito");
      res.status(200).json({ message: "Comprobante de pago creado con éxito" });
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400).json({ error: "Error al crear el comprobante de pago" });
    });
});

router.get("/obtener/listaProveedores", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  console.log(id_usuario);
  listaProveedores(id_usuario)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400);
    });
});

router.get("/obtener/listaComprobantesDePago", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;

  listaComprobantesDePago(id_usuario)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400);
    });
});

router.get(
  "/obtener/por/proveedor/listaComprobantesDePago",
  async (req, res) => {
    const id_usuario = leerUsuario().id_usuario;

    listaComprobantesDePago_proveedor(id_usuario)
      .then((result) => {
        console.log("Resultado de la consulta:", result);
        res.status(200).json(result);
      })
      .catch((error) => {
        console.error("Error en la consulta:", error);
        res.status(400);
      });
  }
);

router.get("/obtener/por/fecha/listaComprobantesDePago", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;

  listaComprobantesDePago_fecha(id_usuario)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400);
    });
});

router.get("/obtener/Proveedor", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  const id_proveedor = leerUsuario().id_proveedor;

  datosProveedor(id_usuario, id_proveedor)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      res.status(200).json(result[0]);
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res
        .status(400)
        .json({ error: "Error al obtener los datos del proveedor" });
    });
});

router.put("/actualizar/Proveedor", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  const datos = [
    req.body.nombre,
    req.body.ciudad,
    req.body.telefono,
    req.body.id_proveedor,
    id_usuario,
  ];
  actualizarProveedor(datos)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      console.log("Proveedor actualizado con éxito");
      res.status(200).json({ message: "Proveedor actualizado con éxito" });
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400).json({ error: "Error al actualizar proveedor" });
    });
});

router.get("/obtener/ComprobantePago", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  const num_comprobante = leerUsuario().num_comprobante;

  datosComprobantePago(id_usuario, num_comprobante)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      res.status(200).json(result[0]);
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400);
    });
});

router.put("/actualizar/ComprobantePago", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  const num_comprobante = leerUsuario().num_comprobante;
  const datos = [
    req.body.descripcion_pago,
    req.body.descripcion_descuento,
    req.body.valor_descuento,
    req.body.valor_bruto,
    req.body.valor_neto,
    num_comprobante,
    id_usuario,
  ];
  actualizarComprobantePago(datos)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      console.log("Comprobante de pago actualizado con éxito");
      res
        .status(200)
        .json({ message: "Comprobante de pago actualizado con éxito" });
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res
        .status(400)
        .json({ error: "Error al actualizar comprobante de pago" });
    });
});

router.delete("/eliminar/Proveedor", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  const id_proveedor = req.body.id_proveedor;

  eliminarProveedor(id_usuario, id_proveedor)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      console.log("Proveedor eliminado con éxito");
      res.status(200).json({ message: "Proveedor eliminado con éxito" });
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400).json({ error: "Error al eliminar proveedor" });
    });
});

router.delete("/eliminar/ComprobantePago", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  const num_comprobante = req.body.num_comprobante;

  eliminarComprobantePago(id_usuario, num_comprobante)
    .then((result) => {
      console.log("Resultado de la consulta:", result);
      console.log("Comprobante de pago eliminado con éxito");
      res
        .status(200)
        .json({ message: "Comprobante de pago eliminado con éxito" });
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400).json({ error: "Error al eliminar comprobante de pago" });
    });
});

router.get("/exportar/ComprobantePago", async (req, res) => {
  const id_usuario = leerUsuario().id_usuario;
  const num_comprobante = leerUsuario().num_comprobante;
  const nombre_usuario = leerUsuario().nombreUsuario;

  datosComprobantePago(id_usuario, num_comprobante)
    .then(async (result) => {
      console.log("Resultado de la consulta:", result);
      const datos = result[0];
      datos.fecha = new Date(datos.fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      datos.nombre_usuario = nombre_usuario;

      // Generar el PDF y guardar en una ubicación temporal
      crearJson(datos);
      console.log("Cree el JSON");
      try {
        generarPdf();
        console.log("PDF creado con éxito");

        const pdfPath = path.join(__dirname, `../comprobante_pago_n${num_comprobante}.pdf`); // Ruta al archivo PDF generado
        
        // Leer el archivo PDF
        //const pdfStream = fs.createReadStream(pdfPath);

        // Configurar las cabeceras de la respuesta HTTP para indicar que es un archivo PDF
        //res.setHeader("Content-Disposition", `attachment; filename=comprobante_pago.pdf`);
        //res.setHeader("Content-Type", "application/pdf");
        res.sendFile(pdfPath);

        // Enviar el archivo PDF como respuesta
        //pdfStream.pipe(res);
      } catch (error) {
        console.error("Error en la generación del PDF:", error);
        res.status(500).json({ error: "Error al crear el PDF" });
      }
    })
    .catch((error) => {
      console.error("Error en la consulta:", error);
      res.status(400).json({ error: "Error en la consulta de datos" });
    });
});

router.delete("/cerrar/sesion", async (req, res) => {
  if (borrarUsuario() && eliminarPdfs())
    res.status(200).json({ message: "Sesión cerrada con éxito" });
  else res.status(400).json({ error: "Error al cerrar sesión" });
});
module.exports = router;
