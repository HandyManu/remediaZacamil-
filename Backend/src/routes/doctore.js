import express from "express";
import doctoresController  from "../controllers/doctoresController.js";
// Router() nos ayuda a colocar los metodos
// que tendra mi ruta
const router = express.Router();

router
  .route("/")
  .get(doctoresController.getDoctores)
  .post(doctoresController.createDoctores);

router
  .route("/:id")
  .put(doctoresController.updateDoctores)
  .delete(doctoresController.updateDoctores);

export default router;
