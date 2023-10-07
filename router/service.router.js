const router = require('express').Router();
const path = require("path");
const express = require('express');

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
} = require('../service/data.service');

router.use(express.json());

//Renders -----------------------------------------------------
router.use(express.static(path.join(__dirname, '../frontend')));

router.get("/", (req, res) => {
    res.render("inicio");
});

router.get("/ingreso", (req,res) =>{
    res.render("ingreso");
});

router.get("/registro", (req,res) =>{
    res.render("registro");
});

router.get("/comprobanteDePago",(req,res) =>{
    res.render("comprobantePago");
});

router.get("/listaComprobantesDePago",(req,res) =>{
    res.render("listaCompPago");
});

router.get("/listaProveedores",(req,res) =>{
    res.render("listaProveedor");
});

router.get("/menu",(req,res) =>{
    res.render("menu");
});

router.get("/proveedor",(req,res) =>{
    res.render("proveedor");
});
//-----------------------------------------------------

router.post("/registro/usuario", async (req, res) => {
    const id_usuario = req.body.id_usuario;
  
    existeUsuario(id_usuario)
      .then((result) => {
        console.log('Resultado de la consulta:', result);
        if (result.length === 0) { // No existe el usuario
          const datos = [
            req.body.id_usuario,
            req.body.password,
            req.body.nombre,
            req.body.segundo_nombre,
            req.body.apellido,
            req.body.segundo_apellido,
            req.body.tipo_documento
          ];
          crearUsuario(datos)
            .then(() => {
              console.log('Usuario creado con éxito');
              res.status(200).json({ message: 'Usuario creado con éxito' });
            })
            .catch((error) => {
              console.error('Error en la consulta:', error);
              res.status(400).json({ error: 'Error al crear el usuario' });
            });
        } else {
          const mensaje = "El usuario ya existe";
          res.status(400).json({ error: mensaje });
        }
      })
      .catch((error) => {
        console.error('Error en la consulta:', error);
        res.status(400).json({ error: 'Error en la consulta' });
      });
  });
  
  router.post("/registro/proveedor", async (req, res) => {
    const id_usuario  = req.body.id_usuario;
    const id_proveedor = req.body.id_proveedor;
    existeProveedor(id_usuario, id_proveedor)
      .then((result) => {
        console.log('Resultado de la consulta:', result);
        if (result.length === 0) { // No existe el proveedor
          const datos = [
            req.body.id_proveedor,
            req.body.nombre,
            req.body.ciudad,
            req.body.telefono,
            req.body.id_usuario
          ];
          crearProveedor(datos)
            .then(() => {
              console.log('Proveedor creado con éxito');
              res.status(200).json({ message: 'Proveedor creado con éxito' });
            })
            .catch((error) => {
              console.error('Error en la consulta:', error);
              res.status(400).json({ error: 'Error al crear el proveedor' });
            });
        } else {
          const mensaje = "El proveedor ya existe";
          res.status(400).json({ error: mensaje });
        }
      })
      .catch((error) => {
        console.error('Error en la consulta:', error);
        res.status(400).json({ error: 'Error en la consulta' });
      });
  });

  router.get("/obtener/listaProveedores/comprobantePago", async (req,res) =>{
    const id_usuario = req.body.id_usuario;
    
    listaProveedoresCompPago(id_usuario)
        .then((result) => {
            console.log('Resultado de la consulta:', result);
            res.status(200).json(result);
        })
        .catch((error) => {
            console.error('Error en la consulta:', error);
            res.status(400);
        });
    
});

router.get("/obtener/ultimo/comprobantePago", async (req,res) =>{
    const id_usuario = req.body.id_usuario;
    
    ultimoCompPago(id_usuario)
        .then((result) => {
            console.log('Resultado de la consulta:', result);
            res.status(200).json(result);
        })
        .catch((error) => {
            console.error('Error en la consulta:', error);
            res.status(400);
        });
    
});

router.post("/crear/comprobantePago", async (req, res) => {
    const datos = [
        req.body.num_comprobante,
        req.body.id_usuario,
        req.body.fecha,
        req.body.id_proveedor,
        req.body.descripcion_pago,
        req.body.descripcion_descuento,
        req.body.valor_descuento,
        req.body.valor_bruto,
        req.body.valor_neto
      ];
    crearCompPago(datos)
      .then((result) => {
        console.log('Resultado de la consulta:', result);
        console.log('Comprobante de pago creado con éxito');
        res.status(200).json({ message: 'Comprobante de pago creado con éxito' });
      })
      .catch((error) => {
        console.error('Error en la consulta:', error);
        res.status(400).json({ error: 'Error al crear el comprobante de pago' });
      });
  });
  
router.get("/obtener/listaProveedores", async (req,res) =>{
    const id_usuario = req.body.id_usuario;
    
    listaProveedores(id_usuario)
        .then((result) => {
            console.log('Resultado de la consulta:', result);
            res.status(200).json(result);
        })
        .catch((error) => {
            console.error('Error en la consulta:', error);
            res.status(400);
        });
    
});

router.get("/obtener/listaComprobantesDePago", async (req,res) =>{
    const id_usuario = req.body.id_usuario;

    listaComprobantesDePago(id_usuario)
        .then((result) => {
            console.log('Resultado de la consulta:', result);
            res.status(200).json(result);
        })
        .catch((error) => {
            console.error('Error en la consulta:', error);
            res.status(400);
        });
    
});

router.get("/obtener/por/proveedor/listaComprobantesDePago", async (req,res) =>{
    const id_usuario = req.body.id_usuario;

    listaComprobantesDePago_proveedor(id_usuario)
        .then((result) => {
            console.log('Resultado de la consulta:', result);
            res.status(200).json(result);
        })
        .catch((error) => {
            console.error('Error en la consulta:', error);
            res.status(400);
        });
    
});

router.get("/obtener/por/fecha/listaComprobantesDePago", async (req,res) =>{
    const id_usuario = req.body.id_usuario;

    listaComprobantesDePago_fecha(id_usuario)
        .then((result) => {
            console.log('Resultado de la consulta:', result);
            res.status(200).json(result);
        })
        .catch((error) => {
            console.error('Error en la consulta:', error);
            res.status(400);
        });
    
});

router.get("/obtener/Proveedor", async (req,res) =>{
  const id_usuario = req.body.id_usuario;
  const id_proveedor = req.body.id_proveedor;
  
  datosProveedor(id_usuario, id_proveedor)
      .then((result) => {
          console.log('Resultado de la consulta:', result);
          res.status(200).json(result);
      })
      .catch((error) => {
          console.error('Error en la consulta:', error);
          res.status(400);
      });
  
});

router.put("/actualizar/Proveedor", async (req, res) => {
  const datos = [
      req.body.id_proveedor,
      req.body.nombre,
      req.body.ciudad,
      req.body.telefono,
      req.body.id_antiguo_proveedor,
      req.body.id_usuario
    ];
  actualizarProveedor(datos)
    .then((result) => {
      console.log('Resultado de la consulta:', result);
      console.log('Proveedor actualizado con éxito');
      res.status(200).json({ message: 'Proveedor actualizado con éxito' });
    })
    .catch((error) => {
      console.error('Error en la consulta:', error);
      res.status(400).json({ error: 'Error al actualizar proveedor' });
    });
});

router.get("/obtener/ComprobantePago", async (req,res) =>{
  const id_usuario = req.body.id_usuario;
  const num_comprobante = req.body.num_comprobante;
  
  datosComprobantePago(id_usuario, num_comprobante)
      .then((result) => {
          console.log('Resultado de la consulta:', result);
          res.status(200).json(result);
      })
      .catch((error) => {
          console.error('Error en la consulta:', error);
          res.status(400);
      });
  
});

router.put("/actualizar/ComprobantePago", async (req, res) => {
  const datos = [
      req.body.descripcion_pago,
      req.body.descripcion_descuento,
      req.body.valor_descuento,
      req.body.valor_bruto,
      req.body.valor_neto,
      req.body.num_comprobante,
      req.body.id_usuario
    ];
  actualizarComprobantePago(datos)
    .then((result) => {
      console.log('Resultado de la consulta:', result);
      console.log('Comprobante de pago actualizado con éxito');
      res.status(200).json({ message: 'Comprobante de pago actualizado con éxito' });
    })
    .catch((error) => {
      console.error('Error en la consulta:', error);
      res.status(400).json({ error: 'Error al actualizar comprobante de pago' });
    });
});

module.exports = router;
