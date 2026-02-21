import { Router } from "express";
import Evento from "../models/Evento.js";
import Inscricao from "../models/Inscricao.js";

const router = Router();

// criar evento (organizador)
router.post("/", async (req, res) => {
  try {
    const evento = await Evento.create(req.body);
    res.status(201).json(evento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// listar todos os eventos (catalogo publico)
// aceita filtros: categoria, busca (texto), ordenar por data
router.get("/", async (req, res) => {
  try {
    const { categoria, busca, ordem } = req.query;
    const filtro = {};

    if (categoria) filtro.categoria = categoria;

    if (busca) {
      filtro.$or = [
        { titulo: { $regex: busca, $options: "i" } },
        { descricao: { $regex: busca, $options: "i" } },
      ];
    }

    const sort = ordem === "asc" ? { dataHora: 1 } : { dataHora: -1 };
    const eventos = await Evento.find(filtro).sort(sort);
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// eventos de um organizador especifico
router.get("/organizador/:organizadorId", async (req, res) => {
  try {
    const eventos = await Evento.find({ organizadorId: req.params.organizadorId }).sort({ dataHora: -1 });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// detalhes de um evento
router.get("/:id", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

    // contar inscritos
    const totalInscritos = await Inscricao.countDocuments({ eventoId: evento._id });
    res.json({ ...evento.toObject(), totalInscritos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// editar evento
router.put("/:id", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

    // só edita se ainda nao aconteceu
    if (new Date(evento.dataHora) < new Date()) {
      return res.status(400).json({ error: "Não é possível editar um evento que já ocorreu" });
    }

    const atualizado = await Evento.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// excluir evento
router.delete("/:id", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

    if (new Date(evento.dataHora) < new Date()) {
      return res.status(400).json({ error: "Não é possível excluir um evento que já ocorreu" });
    }

    // remove inscricoes junto
    await Inscricao.deleteMany({ eventoId: evento._id });
    await evento.deleteOne();

    res.json({ msg: "Evento excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
