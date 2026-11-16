const express = require("express");
const router = express.Router();

const Cliente = require("../models/clientes");

// Cadastrar cliente
router.post("/", async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body);

        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!",
            cliente
        });
    } catch (erro) {
        res.status(400).json({
            mensagem: "Erro ao cadastrar cliente.",
            erro: erro.message
        });
    }
});

// Listar clientes
router.get("/", async (req, res) => {
    try {
        const clientes = await Cliente.find();

        res.json(clientes);
    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao buscar clientes.",
            erro: erro.message
        });
    }
});

module.exports = router;