const express = require("express");
const router = express.Router();

const OrdemServico = require("../models/ordemServico");

// Cadastrar ordem de serviço
router.post("/", async (req, res) => {
    try {
        const ordem = await OrdemServico.create(req.body);

        res.status(201).json({
            mensagem: "Ordem de serviço cadastrada com sucesso!",
            ordem
        });
    } catch (erro) {
        res.status(400).json({
            mensagem: "Erro ao cadastrar ordem de serviço.",
            erro: erro.message
        });
    }
});

// Listar todas as ordens
router.get("/", async (req, res) => {
    try {
        const ordens = await OrdemServico.find();

        res.json(ordens);
    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao buscar ordens de serviço.",
            erro: erro.message
        });
    }
});

// Alterar status da ordem
router.put("/:id/status", async (req, res) => {
    try {
        console.log("ID RECEBIDO:", req.params.id);
        console.log("STATUS RECEBIDO:", req.body.status);

        const ordem = await OrdemServico.findById(req.params.id);

        if (!ordem) {
            return res.status(404).json({
                mensagem: "Ordem de serviço não encontrada."
            });
        }

        ordem.status = req.body.status;

        await ordem.save();

        console.log("STATUS SALVO:", ordem.status);

        res.json({
            mensagem: "Status atualizado com sucesso!",
            ordem
        });

    } catch (erro) {
        console.error("ERRO AO ATUALIZAR:", erro);

        res.status(400).json({
            mensagem: "Erro ao atualizar status.",
            erro: erro.message
        });
    }
});

module.exports = router;