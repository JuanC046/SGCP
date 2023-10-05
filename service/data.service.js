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
const listaProveedores = async (userId) => {
  try {
    const connection = await createDatabaseConnection(); // Obtiene la conexión desde el módulo
    const sql = "SELECT * FROM proveedores WHERE id_usuario = ?";
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
    const sql = "SELECT * FROM comprobantes_de_pago WHERE id_usuario = ?";
    const [rows, fields] = await connection.execute(sql, [userId]);
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
    const sql = "SELECT * FROM comprobantes_de_pago WHERE id_usuario = ? ORDER BY id_proveedor";
    const [rows, fields] = await connection.execute(sql, [userId]);
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
    const sql = "SELECT * FROM comprobantes_de_pago WHERE id_usuario = ? ORDER BY fecha DESC ";
    const [rows, fields] = await connection.execute(sql, [userId]);
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
};
