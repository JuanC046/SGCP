//const { connectToDatabase, closeDatabaseConnection, getDatabaseConnection } = require("../config/database.conection");
const db = require("../config/database.conection");
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
const existeUsuario = (id_usuario) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();

      const sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
      console.log("Consulta SQL:", sql);

      conn.all(sql, [id_usuario], (err, rows) => {
        if (err) {
          console.error("Error al ejecutar la consulta:", err.message);
          reject(err);
        } else {
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
};


const crearUsuario = async (datos) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();

      const sql = `INSERT INTO usuarios 
      (id_usuario, contrasena, nombre, segundo_nombre, apellido, segundo_apellido, tipo_documento) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", datos);

      conn.all(sql, datos, function (err) {
        if (err) {
          console.error("Error al insertar usuario:", err.message);
          reject(err);
        } else {
          console.log(`Usuario insertado con ID: `);
          db.close();
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
};

//Registro de proveedor

const existeProveedor = async (id_usuario, id_proveedor) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
      "SELECT * FROM  proveedores WHERE id_usuario = ? and id_proveedor = ?";
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario, id_proveedor);

      conn.all(sql, [id_usuario, id_proveedor], function (err, rows) {
        if (err) {
          console.error("Error al buscar el proveedor:", err.message);
          reject(err);
        } else {
          console.log(`Proveedor encontrado: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
};

const crearProveedor = async (datos) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql = `INSERT INTO proveedores 
    (id_proveedor, nombre, ciudad, telefono, id_usuario) VALUES (?, ?, ?, ?, ?)`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", datos);

      conn.all(sql, datos, function (err) {
        if (err) {
          console.error("Error al crear proveedor:", err.message);
          reject(err);
        } else {
          console.log(`Proveedor credo con exito`);
          db.close();
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
};

//Creación comprobante de pago

const listaProveedoresCompPago = async (id_usuario) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
    `SELECT id_proveedor, nombre 
    FROM proveedores WHERE id_usuario = ? AND eliminado != 1`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario);

      conn.all(sql, [id_usuario], function (err, rows) {
        if (err) {
          console.error("Error al buscar los proveedores:", err.message);
          reject(err);
        } else {
          console.log(`Proveedores encontrados: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
};


const ultimoCompPago = async (id_usuario) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
    "SELECT MAX(num_comprobante) AS num_ultimo_cp FROM comprobantes_de_pago WHERE id_usuario = ?";
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario);

      conn.all(sql, [id_usuario], function (err, rows) {
        if (err) {
          console.error("Error al buscar comprobante de pago:", err.message);
          reject(err);
        } else {
          console.log(`comprobante encontrado: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
};


const crearCompPago = async (datos) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
    `INSERT INTO comprobantes_de_pago 
      (num_comprobante, id_usuario,fecha, 
      id_proveedor, descripcion_pago, descripcion_descuento, valor_descuento, 
      valor_bruto, valor_neto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", datos);

      conn.all(sql, datos, function (err, rows) {
        if (err) {
          console.error("Error al crear comprobante de pago:", err.message);
          reject(err);
        } else {
          console.log(`Comprobante creado`);
          db.close();
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
};

//Lista de proveedores
const listaProveedores = async (id_usuario) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
    `SELECT nombre, id_proveedor, ciudad 
    FROM proveedores WHERE id_usuario = ? AND eliminado != 1`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario);

      conn.all(sql, [id_usuario], function (err, rows) {
        if (err) {
          console.error("Error al buscar los proveedores:", err.message);
          reject(err);
        } else {
          console.log(`Proveedores encontrados: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
};

//Lista comprobantes de pago
const listaComprobantesDePago = async (id_usuario) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
    `SELECT comprobantes_de_pago.num_comprobante, comprobantes_de_pago.fecha, 
    proveedores2.nombre AS proveedor, comprobantes_de_pago.valor_neto 
    FROM comprobantes_de_pago 
    LEFT JOIN (SELECT * FROM proveedores WHERE id_usuario = ?) AS proveedores2 
    ON comprobantes_de_pago.id_proveedor = proveedores2.id_proveedor 
    WHERE comprobantes_de_pago.id_usuario = ? AND comprobantes_de_pago.eliminado != 1`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario);

      conn.all(sql, [id_usuario, id_usuario], function (err, rows) {
        if (err) {
          console.error("Error al buscar los comprobantes de pago:", err.message);
          reject(err);
        } else {
          console.log(`Comprobantes de pago encontrados: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
  };

const listaComprobantesDePago_proveedor = async (id_usuario) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
    `SELECT comprobantes_de_pago.num_comprobante, comprobantes_de_pago.fecha, 
    proveedores2.nombre AS proveedor, comprobantes_de_pago.valor_neto 
    FROM comprobantes_de_pago 
    LEFT JOIN (SELECT * FROM proveedores WHERE id_usuario = ?) AS proveedores2 
    ON comprobantes_de_pago.id_proveedor = proveedores2.id_proveedor 
    WHERE comprobantes_de_pago.id_usuario = ? AND comprobantes_de_pago.eliminado != 1 ORDER BY proveedores2.nombre`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario);

      conn.all(sql, [id_usuario, id_usuario], function (err, rows) {
        if (err) {
          console.error("Error al buscar los comprobantes de pago:", err.message);
          reject(err);
        } else {
          console.log(`Comprobantes de pago encontrados: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
    };
const listaComprobantesDePago_fecha = async (id_usuario) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
    `SELECT comprobantes_de_pago.num_comprobante, comprobantes_de_pago.fecha, 
    proveedores2.nombre AS proveedor, comprobantes_de_pago.valor_neto 
    FROM comprobantes_de_pago 
    LEFT JOIN (SELECT * FROM proveedores WHERE id_usuario = ?) AS proveedores2 
    ON comprobantes_de_pago.id_proveedor = proveedores2.id_proveedor 
    WHERE comprobantes_de_pago.id_usuario = ? AND comprobantes_de_pago.eliminado != 1 ORDER BY comprobantes_de_pago.fecha DESC`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario);

      conn.all(sql, [id_usuario, id_usuario], function (err, rows) {
        if (err) {
          console.error("Error al buscar los comprobantes de pago:", err.message);
          reject(err);
        } else {
          console.log(`Comprobantes de pago encontrados: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  });
    };

//Actualizar proveedor
const datosProveedor = async (id_usuario, id_proveedor) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
    `SELECT * FROM proveedores WHERE id_usuario = ? AND id_proveedor = ?`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario, id_proveedor);

      conn.all(sql, [id_usuario, id_proveedor], function (err, rows) {
        if (err) {
          console.error("Error al buscar el proveedor:", err.message);
          reject(err);
        } else {
          console.log(`Proveedor encontrado: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  }
  )};

const actualizarProveedor = async (datos) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql = `UPDATE proveedores SET nombre = ?,
    ciudad = ?, telefono = ? WHERE id_proveedor = ? AND id_usuario = ?`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", datos);

      conn.all(sql, datos, function (err) {
        if (err) {
          console.error("Error al actualizar proveedor:", err.message);
          reject(err);
        } else {
          console.log(`Proveedor actualizado`);
          db.close();
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  }
  )};

//Actualizar comprobante de pago
const datosComprobantePago = async (id_usuario, num_comprobante) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql =
    `SELECT *, 
    (SELECT nombre FROM proveedores 
      WHERE proveedores.id_proveedor = comprobantes_de_pago.id_proveedor  
      AND id_usuario = ?) AS nombre_proveedor 
    FROM comprobantes_de_pago  
    WHERE id_usuario = ? AND num_comprobante = ?`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario, num_comprobante);

      conn.all(sql, [id_usuario, id_usuario, num_comprobante], function (err, rows) {
        if (err) {
          console.error("Error al buscar el comprobante de pago:", err.message);
          reject(err);
        } else {
          console.log(`Comprobante de pago encontrado: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  }
  )};

const actualizarComprobantePago = async (datos) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql = `UPDATE comprobantes_de_pago SET descripcion_pago = ?, descripcion_descuento = ?,
    valor_descuento = ?, valor_bruto = ?, valor_neto = ? WHERE num_comprobante = ? AND id_usuario = ?`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", datos);

      conn.all(sql, datos, function (err) {
        if (err) {
          console.error("Error al actualizar comprobante de pago:", err.message);
          reject(err);
        } else {
          console.log(`Comprobante de pago actualizado`);
          db.close();
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  }
  )};

//Borrar Proveedor (borrado logico)
const eliminarProveedor = async (id_usuario, id_proveedor) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql = `UPDATE proveedores SET eliminado = 1
    WHERE id_usuario = ? AND id_proveedor = ?`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario, id_proveedor);

      conn.all(sql, [id_usuario, id_proveedor], function (err) {
        if (err) {
          console.error("Error al eliminar proveedor:", err.message);
          reject(err);
        } else {
          console.log(`Proveedor eliminado`);
          db.close();
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  }
  )};

//Borrar Comprobante de pago (borrado logico)
const eliminarComprobantePago = async (id_usuario, id_proveedor) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql = `UPDATE comprobantes_de_pago SET eliminado = 1
    WHERE id_usuario = ? AND num_comprobante = ?`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario, id_proveedor);

      conn.all(sql, [id_usuario, id_proveedor], function (err) {
        if (err) {
          console.error("Error al eliminar comprobante de pago:", err.message);
          reject(err);
        } else {
          console.log(`Comprobante de pago eliminado`);
          db.close();
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  }
  )};

//Csv------------------------------------------------------
const listaProveedoresCsv = async (id_usuario) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql = `SELECT id_proveedor, nombre, ciudad, telefono 
    FROM proveedores WHERE id_usuario = ? AND eliminado != 1`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario);

      conn.all(sql, [id_usuario], function (err, rows) {
        if (err) {
          console.error("Error al buscar los proveedores:", err.message);
          reject(err);
        } else {
          console.log(`Proveedores encontrados: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  }
  )};

const listaComprobantesCsv = async (id_usuario) => {
  return new Promise((resolve, reject) => {
    try {
      const conn = db.open();
    const sql = `SELECT num_comprobante, id_proveedor, descripcion_pago, descripcion_descuento,
    valor_descuento, valor_neto, valor_bruto 
    FROM comprobantes_de_pago WHERE id_usuario = ? AND eliminado != 1`;
      console.log("Consulta SQL:", sql);
      console.log("Parámetros:", id_usuario);

      conn.all(sql, [id_usuario], function (err, rows) {
        if (err) {
          console.error("Error al buscar los comprobantes de pago:", err.message);
          reject(err);
        } else {
          console.log(`Comprobantes de pago encontrados: ${rows}`);
          db.close();
          resolve(rows);
        }
      });
    } catch (error) {
      console.error("Error al abrir la conexión:", error.message);
      reject(error);
    }
  }
  )};
  
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
