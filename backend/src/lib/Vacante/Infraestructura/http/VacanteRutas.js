const express = require("express");
const router = express.Router();
const auth = require("../../../../middlewares/auth");

module.exports = (controller) => {
  router.post("/crear", auth, controller.crear);
  router.get("/ver", controller.listar);
  router.put("/:id", auth, controller.actualizar);
  router.delete("/:id", auth, controller.eliminar);
  return router;
};
