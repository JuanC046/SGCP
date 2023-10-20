const { createDatabaseConnection } = require("../config/database.conection");

const fs = require("fs");
const path = require("path");

//Manejo de sesion
// Ruta al archivo JSON de usuarios
const usuarioFilePath = path.join(__dirname, "usuario.json");
const datosFilePath = path.join(__dirname, "../datos.json");

// Leer los datos de usuario desde el archivo JSON
const leerUsuario = () => {
  const usuarioData = fs.readFileSync(usuarioFilePath, "utf-8");
  return JSON.parse(usuarioData);
};

// Escribir los datos de usuario en el archivo JSON
const escribirUsuario = (usuario) => {
  const usuarioData = JSON.stringify(usuario);
  fs.writeFileSync(usuarioFilePath, usuarioData);
};

const borrarUsuario = () => {
  try{
    const usuarioData = JSON.stringify({});
  fs.writeFileSync(usuarioFilePath, usuarioData);
  fs.writeFileSync(datosFilePath, usuarioData);
  return true;
  } catch {return false;}
  
};
const glob = require("glob");

const eliminarPdfs = () => {
  try {
    const pdfFiles = glob.sync("**/*.pdf", { cwd: "../" });

  pdfFiles.forEach((pdfFile) => {
    const filePath = path.join("../", pdfFile);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Archivo PDF eliminado: ${pdfFile}`);
    } else {
      console.log(`El archivo PDF no existe: ${pdfFile}`);
    }
  });
  return true;
  } catch{ return false;}
  
};

//----------------------------------------------------------

//Registro usuario
const existeUsuario = async (id_usuario) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = "SELECT * FROM  usuarios WHERE id_usuario = ?";
    const [rows, fields] = await connection.execute(sql, [id_usuario]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const crearUsuario = async (datos) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `INSERT INTO usuarios 
    (id_usuario, contrasena, nombre, segundo_nombre, apellido, segundo_apellido, tipo_documento) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [rows, fields] = await connection.execute(sql, datos);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

//Registro de proveedor

const existeProveedor = async (id_usuario, id_proveedor) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql =
      "SELECT * FROM  proveedores WHERE id_usuario = ? and id_proveedor = ?";
    const [rows, fields] = await connection.execute(sql, [
      id_usuario,
      id_proveedor,
    ]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const crearProveedor = async (datos) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `INSERT INTO proveedores 
    (id_proveedor, nombre, ciudad, telefono, id_usuario) VALUES (?, ?, ?, ?, ?)`;
    await connection.execute(sql, datos);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};
//Creación comprobante de pago

const listaProveedoresCompPago = async (id_usuario) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT id_proveedor, nombre 
    FROM proveedores WHERE id_usuario = ? AND eliminado != 1`;
    const [rows, fields] = await connection.execute(sql, [id_usuario]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const ultimoCompPago = async (id_usuario) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql =
      "SELECT MAX(num_comprobante) AS num_ultimo_cp FROM comprobantes_de_pago WHERE id_usuario = ?";
    const [rows, fields] = await connection.execute(sql, [id_usuario]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const crearCompPago = async (datos) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql =
      "INSERT INTO comprobantes_de_pago (num_comprobante, id_usuario,fecha, id_proveedor, descripcion_pago, descripcion_descuento, valor_descuento, valor_bruto, valor_neto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await connection.execute(sql, datos);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};
//Lista de proveedores
const listaProveedores = async (id_usuario) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT nombre, id_proveedor, ciudad 
    FROM proveedores WHERE id_usuario = ? AND eliminado != 1`;
    const [rows, fields] = await connection.execute(sql, [id_usuario]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};
//Lista comprobantes de pago
const listaComprobantesDePago = async (id_usuario) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT comprobantes_de_pago.num_comprobante, comprobantes_de_pago.fecha, 
    proveedores2.nombre AS proveedor, comprobantes_de_pago.valor_neto 
    FROM comprobantes_de_pago 
    LEFT JOIN (SELECT * FROM proveedores WHERE id_usuario = ?) AS proveedores2 
    ON comprobantes_de_pago.id_proveedor = proveedores2.id_proveedor 
    WHERE comprobantes_de_pago.id_usuario = ? AND comprobantes_de_pago.eliminado != 1`;
    const [rows, fields] = await connection.execute(sql, [
      id_usuario,
      id_usuario,
    ]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};
const listaComprobantesDePago_proveedor = async (id_usuario) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT comprobantes_de_pago.num_comprobante, comprobantes_de_pago.fecha, 
    proveedores2.nombre AS proveedor, comprobantes_de_pago.valor_neto 
    FROM comprobantes_de_pago 
    LEFT JOIN (SELECT * FROM proveedores WHERE id_usuario = ?) AS proveedores2 
    ON comprobantes_de_pago.id_proveedor = proveedores2.id_proveedor 
    WHERE comprobantes_de_pago.id_usuario = ? AND comprobantes_de_pago.eliminado != 1 ORDER BY proveedores2.nombre`;
    const [rows, fields] = await connection.execute(sql, [
      id_usuario,
      id_usuario,
    ]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const listaComprobantesDePago_fecha = async (id_usuario) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT comprobantes_de_pago.num_comprobante, comprobantes_de_pago.fecha, 
    proveedores2.nombre AS proveedor, comprobantes_de_pago.valor_neto 
    FROM comprobantes_de_pago 
    LEFT JOIN (SELECT * FROM proveedores WHERE id_usuario = ?) AS proveedores2 
    ON comprobantes_de_pago.id_proveedor = proveedores2.id_proveedor 
    WHERE comprobantes_de_pago.id_usuario = ? AND comprobantes_de_pago.eliminado != 1 ORDER BY comprobantes_de_pago.fecha DESC`;
    const [rows, fields] = await connection.execute(sql, [
      id_usuario,
      id_usuario,
    ]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

//Actualizar proveedor
const datosProveedor = async (id_usuario, id_proveedor) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT * 
    FROM proveedores  
    WHERE id_usuario = ? AND id_proveedor = ?`;
    const [rows, fields] = await connection.execute(sql, [
      id_usuario,
      id_proveedor,
    ]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const actualizarProveedor = async (datos) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `UPDATE proveedores SET nombre = ?,
    ciudad = ?, telefono = ? WHERE id_proveedor = ? AND id_usuario = ?`;
    await connection.execute(sql, datos);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

//Actualizar comprobante de pago
const datosComprobantePago = async (id_usuario, num_comprobante) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT *, 
    (SELECT nombre FROM proveedores 
      WHERE proveedores.id_proveedor = comprobantes_de_pago.id_proveedor  
      AND id_usuario = ?) AS nombre_proveedor 
    FROM comprobantes_de_pago  
    WHERE id_usuario = ? AND num_comprobante = ?`;
    const [rows, fields] = await connection.execute(sql, [
      id_usuario,
      id_usuario,
      num_comprobante,
    ]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const actualizarComprobantePago = async (datos) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `UPDATE comprobantes_de_pago SET descripcion_pago = ?, descripcion_descuento = ?,
    valor_descuento = ?, valor_bruto = ?, valor_neto = ? WHERE num_comprobante = ? AND id_usuario = ?`;
    await connection.execute(sql, datos);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

//Borrar Proveedor (borrado logico)
const eliminarProveedor = async (id_usuario, id_proveedor) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `UPDATE proveedores SET eliminado = 1
    WHERE id_usuario = ? AND id_proveedor = ?`;
    await connection.execute(sql, [id_usuario, id_proveedor]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

//Borrar Comprobante de pago (borrado logico)
const eliminarComprobantePago = async (id_usuario, id_proveedor) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `UPDATE comprobantes_de_pago SET eliminado = 1
    WHERE id_usuario = ? AND num_comprobante = ?`;
    await connection.execute(sql, [id_usuario, id_proveedor]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

//Csv------------------------------------------------------
const listaProveedoresCsv = async (id_usuario) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT id_proveedor, nombre, ciudad, telefono 
    FROM proveedores WHERE id_usuario = ? AND eliminado != 1`;
    const [rows, fields] = await connection.execute(sql, [id_usuario]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const listaComprobantesCsv = async (id_usuario) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT num_comprobante, id_proveedor, descripcion_pago, descripcion_descuento,
    valor_descuento, valor_neto, valor_bruto 
    FROM comprobantes_de_pago WHERE id_usuario = ? AND eliminado != 1`;
    const [rows, fields] = await connection.execute(sql, [id_usuario]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};


module.exports = {
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
  listaProveedoresCsv,
  listaComprobantesCsv,
};
