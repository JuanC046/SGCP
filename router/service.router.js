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
