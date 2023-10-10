const puppeteer = require("puppeteer");
const fs = require("fs");
const Handlebars = require("handlebars"); // Agrega esta línea

// Datos del archivo JSON (reemplaza 'datos.json' con tu ruta y nombre de archivo)
const datos = require("../datos.json");

const generarPdf = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Lee y carga la plantilla HTML (reemplaza 'plantilla.html' con tu ruta y nombre de archivo)
  const html = fs.readFileSync("./comprobantePago.html", "utf-8");

  // Compila la plantilla Handlebars
  const template = Handlebars.compile(html);

  // Renderiza la plantilla con los datos
  const htmlConDatos = template({ datos });

  // Establece el contenido HTML de la página
  await page.setContent(htmlConDatos);

  // Genera el PDF
  await page.pdf({
    path: "comprobante_pago.pdf",
    format: "A4",
    landscape: true, // Establece la orientación en horizontal
  });

  await browser.close();
};

module.exports = {
  generarPdf,
};


/*generarPdfButton.addEventListener("click", () => {
    fetch("/generar_pdf")
        .then(response => response.text())
        .then(message => console.log(message))
        .catch(error => console.error(error));
});*/