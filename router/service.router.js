const router = require('express').Router();
const statusService = require('../service/data.service');
const path = require("path");
const express = require('express');

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

module.exports = router;
