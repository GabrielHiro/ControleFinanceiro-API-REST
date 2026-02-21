import { Router } from "express";
import Inscricao from "../models/Inscricao.js";
import Evento from "../models/Evento.js";

const router = Router();

// inscrever em evento
router.post("/", async (req, res) => {
  try {
    const { eventoId, participanteId } = req.body;

    // verificar se evento existe
    const evento = await Evento.findById(eventoId);
    if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

    // verificar vagas
    const totalInscritos = await Inscricao.countDocuments({ eventoId });
    if (totalInscritos >= evento.vagas) {
      return res.status(400).json({ error: "Evento sem vagas disponíveis" });
    }

    const inscricao = await Inscricao.create({ eventoId, participanteId });
    res.status(201).json(inscricao);
  } catch (err) {
    // se for duplicata (unique index)
    if (err.code === 11000) {
      return res.status(409).json({ error: "Você já está inscrito neste evento" });
    }
    res.status(400).json({ error: err.message });
  }
});

// cancelar inscricao
router.delete("/:id", async (req, res) => {
  try {
    const inscricao = await Inscricao.findByIdAndDelete(req.params.id);
    if (!inscricao) return res.status(404).json({ error: "Inscrição não encontrada" });
    res.json({ msg: "Inscrição cancelada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// minhas inscricoes (participante)
router.get("/participante/:participanteId", async (req, res) => {
  try {
    const inscricoes = await Inscricao.find({ participanteId: req.params.participanteId })
      .populate("eventoId")
      .sort({ createdAt: -1 });
    res.json(inscricoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// inscritos de um evento (organizador)
router.get("/evento/:eventoId", async (req, res) => {
  try {
    const inscricoes = await Inscricao.find({ eventoId: req.params.eventoId })
      .populate("participanteId", "-senha")
      .sort({ createdAt: -1 });
    res.json(inscricoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
