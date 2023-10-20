const json2csv = require('json2csv');
const fs = require('fs');

const {
    listaProveedoresCsv,
  listaComprobantesCsv,
  leerUsuario
} = require("./data.service");

const generarCSV = (csvOptions,jsonData, filename) => { 
  // Convierte los datos JSON a CSV
  const csv = json2csv.parse(jsonData, csvOptions);
  
  // Escribe el CSV en un archivo
  fs.writeFile(`${filename}.csv`, csv, (err) => {
    if (err) {
      console.error('Error al escribir el archivo CSV', err);
    } else {
      console.log('Archivo CSV creado con éxito.');
    }
  });
  

}

// Datos en formato JSON
/*const jsonData = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
    { name: 'Bob', age: 35 },
  ]; */
  

  async function  generarCSV_proveedor(){
    // Configura opciones para la conversión
  const csvOptions = {
    fields: ['id_proveedor', 'nombre','ciudad','telefono'], // Campos que deseas incluir en el archivo CSV
    header: true, // Incluir una fila de encabezado en el archivo CSV
    };
    //leerUsuario().id_usuario ||
    const id_usuario =  leerUsuario().id_usuario;
    const datos = await listaProveedoresCsv(id_usuario);
    console.log(datos)
    const filename = 'proveedores';
    generarCSV(csvOptions,datos,filename);

}
async function generarCSV_comprobantes(){
    const csvOptions = {
        fields: ['num_comprobante', 'id_proveedor', 'descripcion_pago', 'descripcion_descuento',
            'valor_descuento', 'valor_neto', 'valor_bruto' ], // Campos que deseas incluir en el archivo CSV
        header: true, // Incluir una fila de encabezado en el archivo CSV
        };
        //leerUsuario().id_usuario ||
    const id_usuario =  leerUsuario().id_usuario;
    const datos = await listaComprobantesCsv(id_usuario);
    console.log(datos)
    const filename = 'comprobantes';
    generarCSV(csvOptions,datos,filename);
}

module.exports = {
    generarCSV_proveedor,
    generarCSV_comprobantes
}