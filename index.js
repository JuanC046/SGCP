const loadEndpoint = require("./router")
const { config } = require("./config")
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Configurar vistas y motor de plantillas
app.set("views", path.join(__dirname, "frontend/views"));
app.set("view engine", "ejs");


// Configurar rutas estáticas
app.use(express.static("frontend"));
app.use(express.static(path.join(__dirname, 'frontend')));

loadEndpoint(app);

app.set("port", config.port);

app.listen(app.get("port"), () => {
  console.log(
    `[SERVER]: App running on port on http://localhost:${app.get("port")}/sgcp/v1`
  );
});