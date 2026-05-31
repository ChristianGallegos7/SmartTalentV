const express = require("express");
const router = express.Router();
const auth = require("../../../../middlewares/auth");

module.exports = (controller) => {
  router.post("/asociar", auth, controller.asociar);
  router.get("/ver", controller.listar);
  router.delete("/eliminar", auth, controller.eliminar);
  return router;
};
