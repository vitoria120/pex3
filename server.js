require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const clientesRoutes = require("./routes/clientes");
const ordensRoutes = require("./routes/ordens");

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/clientes", clientesRoutes);
app.use("/ordens", ordensRoutes);

app.get("/", (req, res) => {
    res.json({
        mensagem: "Sistema Tapefoz funcionando!"
    });
});

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    family: 4
})
    .then(() => {
        console.log("MongoDB conectado com sucesso!");
    })
    .catch((erro) => {
        console.error("Erro ao conectar ao MongoDB:", erro.message);
    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});