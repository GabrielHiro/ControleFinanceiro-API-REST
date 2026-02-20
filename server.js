import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

/**
 * Conexão com MongoDB (usando MONGODB_URI do .env)
 */
mongoose
    .connect(process.env.MONGODB_URI, { dbName: "Movimentacao" })
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.error("Erro na conexão:", err.message));

/**
 * Modelo de Movimentação (Entrada/Saída)
 */
const entradaSaidaSchema = new mongoose.Schema(
    {
        tipo: { type: String, required: true, enum: ["entrada", "saida"],},
        categoria: { type: String, required: true, trim: true, minlength: 2, },
        data: { type: String, required: true },
        valor: { type: Number, required: true, min: 0.01, },
    },
    { collection: "EntradaSaida", timestamps: true }
);

const EntradaSaida = mongoose.model( "EntradaSaida", entradaSaidaSchema, "EntradaSaida" );

/**
 * Rotasda API
 */
app.get("/", (req, res) => res.json({ msg: "API rodando" }));

/**
 * Criar movimentação
 */
app.post("/movimentacoes", async (req, res) => {
    try {
        const mov = await EntradaSaida.create(req.body);
        res.status(201).json(mov);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Listar movimentações, com filtros opcionais:
 * - tipo: "entrada" ou "saida"
 * - categoria: string
 * - data_ini: string ISO (ex: "2026-01-01T00:00:00Z")
 * - data_fim: string ISO (ex: "2026-01-31T23:59:59Z") 
 * 
 * 
 * Exemplo de uso:
 * GET /movimentacoes?tipo=saida&categoria=alimentacao&data_ini=2026-01-01T00:00:00Z&data_fim=2026-01-31T23:59:59Z
 * 
 * Retorna todas as movimentações do tipo "saida", categoria "alimentacao", entre 1 e 31 de janeiro de 2026.
 */
app.get("/movimentacoes", async (req, res) => {
    try {
        const { tipo, categoria, data_ini, data_fim } = req.query;

        const filter = {};

        if (tipo) filter.tipo = tipo;

        if (categoria) filter.categoria = categoria;

        if (data_ini || data_fim) {
            filter.data = {};
            if (data_ini) filter.data.$gte = data_ini; // string ISO
            if (data_fim) filter.data.$lte = data_fim; // string ISO
        }

        const list = await EntradaSaida.find(filter).sort({ data: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Saldo (entradas - saidas)
/**
 * Rota: GET /saldo
 * Retorna o total de entradas, total de saídas e o saldo (entradas - saídas).
 * Exemplo:     
 * {
 *   "entradas": 5000,
 *   "saidas": 3000,
 *   "saldo": 2000
 * }
 */
app.get("/saldo", async (req, res) => {
    try {
        const agg = await EntradaSaida.aggregate([
        {
            $group: {
            _id: "$tipo",
            total: { $sum: "$valor" },
            },
        },
        ]);

        const entradas = agg.find((x) => x._id === "entrada")?.total ?? 0;
        const saidas = agg.find((x) => x._id === "saida")?.total ?? 0;

        res.json({ entradas, saidas, saldo: entradas - saidas });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Iniciar o servidor
 */
app.listen(process.env.PORT, () =>
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
);