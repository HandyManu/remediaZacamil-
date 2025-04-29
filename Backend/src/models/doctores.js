import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    especialidad: {
      type: String,
      required: false,
    },
    correo: {
      type: String,
      required: true,

    },
    contraseña: {
      type: String,
      required: true,

    },
  },
  {
    timestamps: true, // Agrega automáticamente "createdAt" y "updatedAt"
    strict: false,    // Permite campos adicionales no definidos en el esquema
  }
);

export default model("products", productSchema);
