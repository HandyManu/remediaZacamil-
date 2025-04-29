import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; // Encriptar

import doctoresModel from "../models/doctores.js";

import { config } from "../config.js";
import { sendMail, HTMLRecoveryEmail } from "../utils/mailPasswordRecovery.js";

const passwordRecoveryController = {};

// Generar y enviar código de recuperación
passwordRecoveryController.requestCode = async (req, res) => {
  const { correo } = req.body;

  try {
    let userFound;
    let userType;

    // Buscamos si el correo está en la colección de doctores
    userFound = await doctoresModel.findOne({ correo });
    if (userFound) {
      userType = "Doctor";
    }

    // Si el usuario no es encontrado
    if (!userFound) {
      return res.status(404).json({ message: "User not found" }); // Cambio: Usé un código de estado HTTP correcto (404)
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();

    const token = jsonwebtoken.sign(
      { correo, code, userType, verified: false }, // Cambio: Corregí "verfied" a "verified"
      config.JWT.secret,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000 });

    await sendMail(
      correo,
      "Password recovery code",
      `Your verification code is: ${code}`,
      HTMLRecoveryEmail(code)
    );

    res.json({ message: "Verification code sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending code", error: error.message }); // Cambio: Añadí una respuesta en caso de errores
  }
};

// Verificar el código de recuperación
passwordRecoveryController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (decoded.code !== code) {
      return res.status(400).json({ message: "Invalid verification code" }); // Cambio: Usé un código de estado HTTP correcto (400)
    }

    const newToken = jsonwebtoken.sign(
      {
        correo: decoded.correo,
        code: decoded.code,
        userType: decoded.userType,
        verified: true,
      },
      config.JWT.secret,
      { expiresIn: "2h" }
    );

    res.cookie("tokenRecoveryCode", newToken, { maxAge: 2 * 60 * 60 * 1000 }); // Cambio: Ajusté "maxAge" para ser coherente con la expiración del token

    res.json({ message: "Verification successful" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message }); // Cambio: Añadí manejo de errores
  }
};

passwordRecoveryController.newPassword = async (req, res) => {
    const { newPassword } = req.body;
  
    try {
      // Validar que newPassword no sea undefined, nulo o un número
      if (!newPassword || typeof newPassword !== "string") {
        return res.status(400).json({ message: "Invalid password format" });
      }
  
      const token = req.cookies.tokenRecoveryCode;
  
      const decoded = jsonwebtoken.verify(token, config.JWT.secret);
  
      if (!decoded.verified) {
        return res.status(403).json({ message: "Unauthorized action" });
      }
  
      const { correo } = decoded;
  
      // Buscar al usuario
      let user = await doctoresModel.findOne({ correo });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const hashPassword = await bcryptjs.hash(newPassword, 10);
  
      await doctoresModel.findOneAndUpdate(
        { correo },
        { password: hashPassword },
        { new: true }
      );
  
      res.clearCookie("tokenRecoveryCode");
  
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating password", error: error.message });
    }
  };
  
export default passwordRecoveryController;
