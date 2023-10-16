const fs = require("fs");
const PDFDocument = require("pdfkit");

// funcion para crear archivo json
function crearJson(data) {
  let datos = JSON.stringify(data);
  fs.writeFileSync("datos.json", datos);
  console.log("Archivo JSON creado");
}

// Datos del comprobante de pago
let datosComprobante = {}
//Funcion para traer los datos de un archivo json
function traerDatos() {
  const fs = require("fs");
  let rawdata = fs.readFileSync("datos.json");
  let datos = JSON.parse(rawdata);
  return datos;
}
datosComprobante = traerDatos();

console.log(datosComprobante);
// Crear un nuevo documento PDF

function generarPdf() {
  const doc = new PDFDocument();

  function drawLabelAndValue(label, value) {
    doc
      .font(labelFont)
      .text(label, { continued: true })
      .font(normalFont)
      .text(value, { align: "left" });
    doc.moveDown(0.5);
  }
  // Configurar el flujo de escritura para guardar el PDF en el servidor
  const pdfStream = fs.createWriteStream("comprobante_pago.pdf");
  doc.pipe(pdfStream);

  // Definir estilos de fuente
  const labelFont = "Helvetica-Bold";
  const normalFont = "Helvetica";

  // Configurar el tamaño de letra para el título
  doc.fontSize(24);

  // Título "COMPROBANTE DE PAGO"
  doc.text("COMPROBANTE DE PAGO", { align: "center" });

  // Configurar el tamaño de letra para el nombre de la persona
  doc.fontSize(18);

  // Nombre de la persona
  doc.text(datosComprobante.nombre_usuario, { align: "center" });

  // Espaciado antes de la tabla
  doc.moveDown(2);

  // Configurar el tamaño de letra para las etiquetas en la tabla
  doc.fontSize(12);

  // Dibujar etiquetas y contenido

  // Dibujar las etiquetas y el contenido en la tabla
  drawLabelAndValue("Fecha:   ", datosComprobante.fecha);
  drawLabelAndValue(
    "Número de Comprobante:   ",
    datosComprobante.num_comprobante
  );
  drawLabelAndValue("Pagado a:    ", datosComprobante.nombre_proveedor);

  // Etiqueta y contenido personalizado para la descripción de pago
  doc
    .font(labelFont)
    .text("Descripción de Pago:  ", { continued: true })
    .font(normalFont)
    .text(datosComprobante.descripcion_pago, { align: "left" });
  doc.moveDown(0.5);

  drawLabelAndValue(
    "Descripción de Descuento:    ",
    datosComprobante.descripcion_descuento != null
      ? datosComprobante.descripcion_descuento
      : " "
  );
  drawLabelAndValue(
    "Valor Descuento:     ",
    datosComprobante.valor_descuento != null
      ? datosComprobante.valor_descuento
      : " "
  );
  drawLabelAndValue("Valor Bruto:     ", datosComprobante.valor_bruto);
  drawLabelAndValue("Valor Neto:      ", datosComprobante.valor_neto);

  // Finalizar y cerrar el PDF
  doc.end();

  console.log("PDF generado y guardado en comprobante_pago.pdf");
}

module.exports = { generarPdf, crearJson };
