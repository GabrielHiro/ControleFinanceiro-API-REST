import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    dataHora: { type: Date, required: true },
    local: { type: String, required: true, trim: true },
    categoria: {
      type: String,
      required: true,
      enum: ["Tecnologia", "Esportes", "Música", "Educação", "Negócios", "Outros"],
    },
    vagas: { type: Number, required: true, min: 1 },
    imagemUrl: { type: String, default: "" },
    organizadorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { collection: "Eventos", timestamps: true }
);

const Evento = mongoose.model("Evento", eventoSchema, "Eventos");
export default Evento;
