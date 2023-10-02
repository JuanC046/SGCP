require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'tu_usuario',
    password: process.env.DB_PASSWORD || 'tu_contraseña',
    database: process.env.DB_DATABASE || 'tu_base_de_datos',
  }
};

module.exports = {
  config,
};