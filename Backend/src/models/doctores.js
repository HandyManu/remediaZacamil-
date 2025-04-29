import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: false,
    },
    precio: {
      type: Number,
      required: true,
      min: 0, // Asegura que el precio no sea negativo
    },
    stock: {
      type: Number,
      required: true,
      min: 0, // Asegura que el stock no sea negativo
    },
  },
  {
    timestamps: true, // Agrega automáticamente "createdAt" y "updatedAt"
    strict: false,    // Permite campos adicionales no definidos en el esquema
  }
);

export default model("products", productSchema);
