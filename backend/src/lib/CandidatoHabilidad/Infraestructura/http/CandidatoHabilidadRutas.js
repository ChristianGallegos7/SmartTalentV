const express = require("express");
const router = express.Router();
const auth = require("../../../../middlewares/auth");

module.exports = (controller) => {
  router.post("/crear", auth, controller.crear);
  router.get("/ver", auth, controller.listar);
  router.put("/actualizar", auth, controller.actualizar);
  router.delete("/eliminar", auth, controller.eliminar);
  return router;
};
