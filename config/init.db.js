// initialize-db.js
const fs = require('fs');
const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const dbName = 'pagosdb.sqlite'; // Nombre fijo de la base de datos


const initializeDatabase = () => {
  dbPath = path.join(
    __dirname,
    `../${dbName}`
  );
  console.log(dbPath);
  // Verifica si la base de datos existe
  if (!fs.existsSync(dbPath)) {
    const db = new sqlite3.Database(dbPath);

    // Código para crear tablas y realizar otras configuraciones iniciales
    db.serialize(() => {
      // Tabla `usuarios`
      db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id_usuario TEXT PRIMARY KEY,
          contrasena TEXT,
          nombre TEXT,
          segundo_nombre TEXT,
          apellido TEXT,
          segundo_apellido TEXT,
          tipo_documento TEXT
        )
      `);

      // Tabla `proveedores`
      db.run(`
        CREATE TABLE IF NOT EXISTS proveedores (
          id_proveedor TEXT,
          nombre TEXT,
          ciudad TEXT,
          telefono TEXT,
          id_usuario TEXT,
          eliminado INTEGER DEFAULT 0,
          PRIMARY KEY (id_proveedor, id_usuario),
          FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);

      // Tabla `comprobantes_de_pago`
      db.run(`
        CREATE TABLE IF NOT EXISTS comprobantes_de_pago (
          num_comprobante INTEGER,
          id_usuario TEXT,
          fecha DATE,
          id_proveedor TEXT,
          descripcion_pago TEXT,
          descripcion_descuento TEXT,
          valor_descuento REAL,
          valor_bruto INTEGER UNSIGNED,
          valor_neto INTEGER UNSIGNED,
          eliminado INTEGER DEFAULT 0,
          PRIMARY KEY (num_comprobante, id_usuario),
          FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY (id_proveedor) REFERENCES proveedores (id_proveedor) ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);

      // Otros comandos SQL según tu esquema
    });

    db.close();
  }
};

module.exports = {initializeDatabase};
