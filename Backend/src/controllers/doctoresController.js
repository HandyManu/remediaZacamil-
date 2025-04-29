const doctoresController = {};    
import doctoresModel from "../models/doctores.js"   

// SELECT
doctoresController.getDoctores = async (req, res) => {
    const doctores = await doctoresModel.find();
    res.json(doctores);
  };
  
  // INSERT
  doctoresController.createDoctores = async (req, res) => {
    const { nombre , descripcion , precio , stock} = req.body;
    const newDoctor = new doctoresModel({ nombre , descripcion , precio , stock});
    await newDoctor.save();
    res.json({ message: "al chile ya lo guarde" });
  };
  
  // DELETE
  doctoresController.deleteDoctores = async (req, res) => {
  const deleteDoctores = await doctoresModel.findByIdAndDelete(req.params.id);
    if (!deleteDoctores) {
      return res.status(404).json({ message: "no lo halle vos" });
    }
    res.json({ message: "eliminado" });
  };
  
  // UPDATE
  doctoresController.updateDoctores = async (req, res) => {
    // Solicito todos los valores
    const { nombre , descripcion , precio , stock } = req.body;
    // Actualizo
    await doctoresModel.findByIdAndUpdate(
      req.params.id,
      {
        nombre , descripcion , precio , stock
      },
      { new: true }
    );
    // muestro un mensaje que todo se actualizo
    res.json({ message: "Actualizado" });
  };
  
  export default doctoresController;
  