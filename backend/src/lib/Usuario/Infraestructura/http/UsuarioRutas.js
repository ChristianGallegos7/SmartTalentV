const express = require("express");
const router = express.Router();
const auth = require("../../../../middlewares/auth");

module.exports = (controller) => {
  router.post("/login", controller.login);
  router.post("/crear", controller.crear);
  router.get("/ver", auth, controller.listar);
  router.put("/:id", auth, controller.actualizar);
  router.delete("/:id", auth, controller.eliminar);

  return router;
};
