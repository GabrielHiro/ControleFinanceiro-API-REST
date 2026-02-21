import { Router } from "express";
import Usuario from "../models/Usuario.js";

const router = Router();

// cadastro
router.post("/registro", async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const usuario = await Usuario.create({ nome, email, senha, perfil });
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// login simplificado (sem JWT por enquanto)
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email, senha });
    if (!usuario) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// buscar usuario por id
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-senha");
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
