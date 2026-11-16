const mongoose = require("mongoose");

const ordemServicoSchema = new mongoose.Schema(
    {
        cliente: {
            type: String,
            required: true
        },

        telefone: {
            type: String,
            required: true
        },

        empresa: {
            type: String,
            enum: ["TAPEFOZ", "TAPELIMP"],
            required: true
        },

        servico: {
            type: String,
            required: true
        },

        item: {
            type: String,
            required: true
        },

        quantidade: {
            type: Number,
            required: true,
            min: 1
        },

        dataEntrada: {
            type: Date,
            default: Date.now
        },

        prazoEntrega: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pendente",
                "Em andamento",
                "Pronto",
                "Entregue",
                "Cancelado"
            ],
            default: "Pendente"
        },

        observacoes: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("OrdemServico", ordemServicoSchema);