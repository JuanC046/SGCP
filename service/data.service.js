const { createDatabaseConnection } = require("../config/database.conection");

// Ejemplo consultas
const ejemplo = () => {
  const userId = 1; // Supongamos que este valor proviene de alguna entrada del usuario

  const sql = "SELECT * FROM usuarios WHERE id = ?";
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta: " + err.message);
      return;
    }

    // Procesa los resultados de la consulta
    console.log("Resultado de la consulta:", results);
  });
};

//----------------------------------------------------------
/*
const listaProveedores = (userId) => {
    const sql = 'SELECT * FROM proveedor WHERE id_usuario = ?';
    results = connection.query(sql, [userId], (err, results) => {
    if (err) {
        console.error('Error al ejecutar la consulta: ' + err.message);
        return;
    }
    // Procesa los resultados de la consulta
    //console.log('Resultado de la consulta:', results);
    console.log(typeof results);
    return results;
    });
    return results;
}
*/

//Registro usuario
const existeUsuario = async (userId) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = "SELECT * FROM  usuarios WHERE id_usuario = ?";
    const [rows, fields] = await connection.execute(sql, [userId]);
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
    const sql = "INSERT INTO usuarios (id_usuario, contrasena, nombre, segundo_nombre, apellido, segundo_apellido, tipo_documento) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [rows, fields] = await connection.execute(sql, datos);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

//Registro de proveedor

const existeProveedor = async (userId, id_proveedor) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = "SELECT * FROM  proveedores WHERE id_usuario = ? and id_proveedor = ?";
    const [rows, fields] = await connection.execute(sql, [userId, id_proveedor]);
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
    const sql = "INSERT INTO proveedores (id_proveedor, nombre, ciudad, telefono, id_usuario) VALUES (?, ?, ?, ?, ?)";
    await connection.execute(sql, datos);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};
//Creación comprobante de pago

const listaProveedoresCompPago = async (userId) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = "SELECT id_proveedor, nombre FROM proveedores WHERE id_usuario = ?";
    const [rows, fields] = await connection.execute(sql, [userId]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const ultimoCompPago = async (userId) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = "SELECT MAX(num_comprobante) AS num_ultimo_cp FROM comprobantes_de_pago WHERE id_usuario = ?";
    const [rows, fields] = await connection.execute(sql, [userId]);
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
    const sql = "INSERT INTO comprobantes_de_pago (num_comprobante, id_usuario,fecha, id_proveedor, descripcion_pago, descripcion_descuento, valor_descuento, valor_bruto, valor_neto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await connection.execute(sql, datos);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return true; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};
const listaProveedores = async (userId) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = "SELECT nombre, id_proveedor, ciudad FROM proveedores WHERE id_usuario = ?";
    const [rows, fields] = await connection.execute(sql, [userId]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const listaComprobantesDePago = async (userId) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT comprobantes_de_pago.num_comprobante, comprobantes_de_pago.fecha, 
    proveedores2.nombre AS Proveedor, comprobantes_de_pago.valor_neto 
    FROM comprobantes_de_pago 
    LEFT JOIN (SELECT * FROM proveedores WHERE id_usuario = ?) AS proveedores2 
    ON comprobantes_de_pago.id_proveedor = proveedores2.id_proveedor 
    WHERE comprobantes_de_pago.id_usuario = ?`;
    const [rows, fields] = await connection.execute(sql, [userId, userId]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};
const listaComprobantesDePago_proveedor = async (userId) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = `SELECT comprobantes_de_pago.num_comprobante, comprobantes_de_pago.fecha, 
    proveedores2.nombre AS Proveedor, comprobantes_de_pago.valor_neto 
    FROM comprobantes_de_pago 
    LEFT JOIN (SELECT * FROM proveedores WHERE id_usuario = ?) AS proveedores2 
    ON comprobantes_de_pago.id_proveedor = proveedores2.id_proveedor 
    WHERE comprobantes_de_pago.id_usuario = ? ORDER BY proveedores2.id_proveedor`;
    const [rows, fields] = await connection.execute(sql, [userId, userId]);
    connection.end(); // Cierra la conexión cuando hayas terminado

    return rows; // Retorna los resultados de la consulta
  } catch (error) {
    console.error("Error al ejecutar la consulta: " + error.message);
    throw error; // Lanza el error para que pueda ser manejado en un nivel superior
  }
};

const listaComprobantesDePago_fecha = async (userId) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql =`SELECT comprobantes_de_pago.num_comprobante, comprobantes_de_pago.fecha, 
    proveedores2.nombre AS Proveedor, comprobantes_de_pago.valor_neto 
    FROM comprobantes_de_pago 
    LEFT JOIN (SELECT * FROM proveedores WHERE id_usuario = ?) AS proveedores2 
    ON comprobantes_de_pago.id_proveedor = proveedores2.id_proveedor 
    WHERE comprobantes_de_pago.id_usuario = ? ORDER BY comprobantes_de_pago.fecha DESC`;
    const [rows, fields] = await connection.execute(sql, [userId, userId]);
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
  crearCompPago
};
