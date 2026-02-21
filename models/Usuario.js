import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    senha: { type: String, required: true, minlength: 4 },
    perfil: { type: String, required: true, enum: ["organizador", "participante"] },
  },
  { collection: "Usuarios", timestamps: true }
);

const Usuario = mongoose.model("Usuario", usuarioSchema, "Usuarios");
export default Usuario;
