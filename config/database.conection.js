// database.js (para manejar la conexión)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
//let db; // Variable para almacenar la instancia de la base de datos

// Función para conectar a la base de datos

/* const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '../pagosdb.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        reject(err);
      } else {
        console.log('Conexión exitosa a la base de datos');
        resolve();
      }
    });
  });
};

// Función para cerrar la conexión a la base de datos
const closeDatabaseConnection = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error al cerrar la conexión a la base de datos:', err.message);
          reject(err);
        } else {
          console.log('Conexión cerrada correctamente');
          resolve();
        }
      });
    } else {
      resolve(); // Resuelve inmediatamente si no hay conexión abierta
    }
  });
};
 */
class DB {
    static #db;

    static open() {
        if (this.#db == undefined) {
          const dbPath = path.join(__dirname, '../pagosdb.sqlite');
            this.#db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_FULLMUTEX, (err) => {
                if (err) {
                    console.error(err.message);        
                } else {
                    console.log('Connection is ready!');
                }}
            );
        }
        return this.#db;
    }

    static close() {
        if (this.#db != undefined) {
            this.#db.close();
            this.#db = undefined;
        }
    }
}

module.exports = DB; 
/* module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  getDatabaseConnection: async () => db,
  
};
 */