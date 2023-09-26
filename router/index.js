const router = require("express").Router();

const statusRouter = require("./service.router");

const loadEndpoint = (app) => {
  app.use("/sgcp/v1", router);
  router.use("/", statusRouter);
};

module.exports = loadEndpoint;