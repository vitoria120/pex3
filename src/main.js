import "./style.css";
console.log("MEU MAIN.JS ESTÁ FUNCIONANDO!");

const API = "http://localhost:3000";

const app = document.querySelector("#app");

const container = document.createElement("div");
container.className = "container";

const header = document.createElement("header");

const titulo = document.createElement("h1");

const tape = document.createElement("span");
tape.textContent = "TAPE";
tape.className = "titulo-tape";

const foz = document.createElement("span");
foz.textContent = "FOZ";
foz.className = "titulo-foz";

titulo.appendChild(tape);
titulo.appendChild(foz);

const subtitulo = document.createElement("p");
subtitulo.textContent = "Sistema de Controle de Serviços";

header.appendChild(titulo);
header.appendChild(subtitulo);

container.appendChild(header);

const dashboard = document.createElement("section");
dashboard.className = "dashboard";

function criarDashboard(titulo, id) {
    const card = document.createElement("div");
    card.className = "dashboard-card";

    const h3 = document.createElement("h3");
    h3.textContent = titulo;

    const numero = document.createElement("strong");
    numero.id = id;
    numero.textContent = "0";

    card.appendChild(h3);
    card.appendChild(numero);

    return card;
}

dashboard.appendChild(criarDashboard("Total de Ordens", "totalOrdens"));
dashboard.appendChild(criarDashboard("Pendentes", "pendentes"));
dashboard.appendChild(criarDashboard("Em andamento", "andamento"));
dashboard.appendChild(criarDashboard("Prontas", "prontas"));

container.appendChild(dashboard);

const formCard = document.createElement("section");
formCard.className = "card";

const tituloForm = document.createElement("h2");
tituloForm.textContent = "Nova Ordem de Serviço";

const form = document.createElement("form");
form.id = "formOrdem";

function criarInput(id, placeholder, tipo = "text") {
    const input = document.createElement("input");

    input.id = id;
    input.placeholder = placeholder;
    input.type = tipo;
    input.required = true;

    return input;
}

form.appendChild(criarInput("cliente", "Nome do cliente"));
form.appendChild(criarInput("telefone", "Telefone"));

const empresa = document.createElement("select");
empresa.id = "empresa";
empresa.required = true;

const opcaoInicial = document.createElement("option");
opcaoInicial.value = "";
opcaoInicial.textContent = "Selecione a empresa";

empresa.appendChild(opcaoInicial);

const opcaoTapefoz = document.createElement("option");
opcaoTapefoz.value = "TAPEFOZ";
opcaoTapefoz.textContent = "TAPEFOZ";

empresa.appendChild(opcaoTapefoz);

const opcaoTapelimp = document.createElement("option");
opcaoTapelimp.value = "TAPELIMP";
opcaoTapelimp.textContent = "TAPELIMP";

empresa.appendChild(opcaoTapelimp);

form.appendChild(empresa);

form.appendChild(criarInput("servico", "Serviço"));
form.appendChild(criarInput("item", "Item (sofá, cadeira, pufe...)"));

form.appendChild(
    criarInput("quantidade", "Quantidade", "number")
);

const prazo = criarInput("prazoEntrega", "Prazo de entrega", "date");

form.appendChild(prazo);

const observacoes = document.createElement("textarea");
observacoes.id = "observacoes";
observacoes.placeholder = "Observações";

form.appendChild(observacoes);

const botao = document.createElement("button");
botao.type = "submit";
botao.textContent = "Cadastrar Ordem";

form.appendChild(botao);

const mensagem = document.createElement("p");
mensagem.id = "mensagem";

formCard.appendChild(tituloForm);
formCard.appendChild(form);
formCard.appendChild(mensagem);

container.appendChild(formCard);

const ordensCard = document.createElement("section");
ordensCard.className = "card";

const tituloOrdens = document.createElement("h2");
tituloOrdens.textContent = "Ordens de Serviço";

const listaOrdens = document.createElement("div");
listaOrdens.id = "listaOrdens";

ordensCard.appendChild(tituloOrdens);
ordensCard.appendChild(listaOrdens);

container.appendChild(ordensCard);

app.appendChild(container);

async function carregarOrdens() {
    try {
        const resposta = await fetch(API + "/ordens");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar ordens");
        }

        const ordens = await resposta.json();

        document.querySelector("#totalOrdens").textContent =
            ordens.length;

        document.querySelector("#pendentes").textContent =
            ordens.filter(
                ordem =>
                    !ordem.status ||
                    ordem.status === "Pendente"
            ).length;

        document.querySelector("#andamento").textContent =
            ordens.filter(
                ordem =>
                    ordem.status === "Em andamento"
            ).length;

        document.querySelector("#prontas").textContent =
            ordens.filter(
                ordem =>
                    ordem.status === "Pronto"
            ).length;

        listaOrdens.innerHTML = "";

        if (ordens.length === 0) {
            listaOrdens.textContent =
                "Nenhuma ordem cadastrada.";
            return;
        }

        ordens.forEach(ordem => {

          console.log("ORDEM COMPLETA:", ordem);
          console.log("ID DA ORDEM:", ordem._id);

            const card = document.createElement("div");
            card.className = "ordem";

            const nome = document.createElement("h3");
            nome.textContent = ordem.cliente;

            const telefone = document.createElement("p");
            telefone.textContent =
                "Telefone: " + ordem.telefone;

            const empresaTexto = document.createElement("p");
            empresaTexto.textContent =
                "Empresa: " + ordem.empresa;

            const servicoTexto = document.createElement("p");
            servicoTexto.textContent =
                "Serviço: " + ordem.servico;

            const itemTexto = document.createElement("p");
            itemTexto.textContent =
                "Item: " + ordem.item;

            const quantidadeTexto = document.createElement("p");
            quantidadeTexto.textContent =
                "Quantidade: " + ordem.quantidade;

            const prazoTexto = document.createElement("p");

            const data = new Date(ordem.prazoEntrega);

            prazoTexto.textContent =
                "Prazo: " +
                data.toLocaleDateString("pt-BR");

           const statusTexto = document.createElement("p");

statusTexto.textContent =
    "Status: " +
    (ordem.status || "Pendente");

const seletorStatus = document.createElement("select");

const status = [
    "Pendente",
    "Em andamento",
    "Pronto",
    "Entregue",
    "Cancelado"
];

status.forEach(opcao => {
    const option = document.createElement("option");

    option.value = opcao;
    option.textContent = opcao;

    if ((ordem.status || "Pendente") === opcao) {
        option.selected = true;
    }

    seletorStatus.appendChild(option);
});

seletorStatus.addEventListener("change", async () => {

    console.log("ID DA ORDEM:", ordem._id);
    console.log("NOVO STATUS:", seletorStatus.value);

    const novoStatus = seletorStatus.value;

    try {
        const resposta = await fetch(
            API + "/ordens/" + ordem._id + "/status",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: novoStatus
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.erro ||
                dados.mensagem ||
                "Erro ao atualizar status"
            );
        }

  ordem.status = novoStatus;

statusTexto.textContent = "Status: " + novoStatus;

await carregarOrdens();

} catch (erro) {
    console.error(erro);
    alert("Não foi possível alterar o status.");
}
});
card.appendChild(nome);
card.appendChild(telefone);
card.appendChild(empresaTexto);
card.appendChild(servicoTexto);
card.appendChild(itemTexto);
card.appendChild(quantidadeTexto);
card.appendChild(prazoTexto);
card.appendChild(statusTexto);
card.appendChild(seletorStatus);

if (ordem.observacoes) {
    const observacaoTexto =
        document.createElement("p");

    observacaoTexto.textContent =
        "Observações: " +
        ordem.observacoes;

    card.appendChild(observacaoTexto);
}

listaOrdens.appendChild(card);
        });
        
    } catch (erro) {
        console.error(erro);

        listaOrdens.textContent =
            "Não foi possível carregar as ordens.";
    }
}

form.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    mensagem.textContent =
        "Cadastrando ordem...";

    const ordem = {
        cliente:
            document.querySelector("#cliente").value,

        telefone:
            document.querySelector("#telefone").value,

        empresa:
            document.querySelector("#empresa").value,

        servico:
            document.querySelector("#servico").value,

        item:
            document.querySelector("#item").value,

        quantidade:
            Number(
                document.querySelector("#quantidade").value
            ),

        prazoEntrega:
            document.querySelector("#prazoEntrega").value,

        observacoes:
            document.querySelector("#observacoes").value
    };

    try {
        const resposta = await fetch(
            API + "/ordens",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(ordem)
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.erro ||
                dados.mensagem ||
                "Erro ao cadastrar ordem"
            );
        }

        mensagem.textContent =
            "Ordem cadastrada com sucesso!";

        form.reset();

        await carregarOrdens();

    } catch (erro) {
        console.error(erro);

        mensagem.textContent =
            "Erro ao cadastrar ordem.";
    }
});

carregarOrdens();