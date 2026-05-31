const express = require("express");
const router = express.Router();
const auth = require("../../../../middlewares/auth");
const upload = require("../../../../middlewares/upload");

module.exports = (controller) => {
  router.post("/crear", auth, upload.single("cv"), controller.crear);
  router.get("/ver", auth, controller.listar);
  router.post("/:id/analizar", auth, controller.analizar);
  router.put("/:id", auth, controller.actualizar);
  router.delete("/:id", auth, controller.eliminar);
  return router;
};
