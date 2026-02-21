import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import usuariosRoutes from "./routes/usuarios.js";
import eventosRoutes from "./routes/eventos.js";
import inscricoesRoutes from "./routes/inscricoes.js";

const app = express();

app.use(cors());
app.use(express.json());

// conexao com o mongo
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "GerenciadorEventos" })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro na conexão:", err.message));

// rotas
app.get("/", (req, res) => res.json({ msg: "API Gerenciador de Eventos rodando" }));

app.use("/usuarios", usuariosRoutes);
app.use("/eventos", eventosRoutes);
app.use("/inscricoes", inscricoesRoutes);

// iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);