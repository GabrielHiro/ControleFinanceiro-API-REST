import mongoose from "mongoose";

const inscricaoSchema = new mongoose.Schema(
  {
    eventoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento",
      required: true,
    },
    participanteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { collection: "Inscricoes", timestamps: true }
);

// evita inscrição duplicada no mesmo evento
inscricaoSchema.index({ eventoId: 1, participanteId: 1 }, { unique: true });

const Inscricao = mongoose.model("Inscricao", inscricaoSchema, "Inscricoes");
export default Inscricao;
