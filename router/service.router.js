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
    crearCompPago
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
    const userId = req.body.userId;
  
    existeUsuario(userId)
      .then((result) => {
        console.log('Resultado de la consulta:', result);
        if (result.length === 0) { // No existe el usuario
          const datos = [
            req.body.userId,
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
    const userId  = req.body.userId;
    const id_proveedor = req.body.id_proveedor;
    existeProveedor(userId, id_proveedor)
      .then((result) => {
        console.log('Resultado de la consulta:', result);
        if (result.length === 0) { // No existe el proveedor
          const datos = [
            req.body.id_proveedor,
            req.body.nombre,
            req.body.ciudad,
            req.body.telefono,
            req.body.userId
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
    const userId = req.body.userId;
    
    listaProveedoresCompPago(userId)
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
    const userId = req.body.userId;
    
    ultimoCompPago(userId)
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
        req.body.userId,
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
    const userId = req.body.userId;
    
    listaProveedores(userId)
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
    const userId = req.body.userId;

    listaComprobantesDePago(userId)
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
    const userId = req.body.userId;

    listaComprobantesDePago_proveedor(userId)
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
    const userId = req.body.userId;

    listaComprobantesDePago_fecha(userId)
        .then((result) => {
            console.log('Resultado de la consulta:', result);
            res.status(200).json(result);
        })
        .catch((error) => {
            console.error('Error en la consulta:', error);
            res.status(400);
        });
    
});

module.exports = router;
