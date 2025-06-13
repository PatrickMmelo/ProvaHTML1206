let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let editandoIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  renderizarPedidos();
});

document.getElementById("pedidoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const tipo = document.getElementById("tipo").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const restricoes = Array.from(document.querySelectorAll(".restricao:checked")).map(el => el.value);

  let valorTotal = 25 * quantidade;
  if (tipo === "Vegetariana") valorTotal *= 0.9; // 10% desconto
  if (restricoes.length > 0) valorTotal += quantidade * 5;

  const pedido = { nome, tipo, quantidade, restricoes, valorTotal };

  if (editandoIndex !== null) {
    pedidos[editandoIndex] = pedido;
    editandoIndex = null;
    mostrarMensagem("Pedido atualizado com sucesso!");
  } else {
    pedidos.push(pedido);
    mostrarMensagem("Pedido salvo com sucesso!");
  }

  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  this.reset();
  renderizarPedidos();
});

function renderizarPedidos() {
  const tabela = document.getElementById("tabelaPedidos");
  tabela.innerHTML = "";

  pedidos.forEach((pedido, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${pedido.nome}</td>
      <td>${pedido.tipo}</td>
      <td>${pedido.quantidade}</td>
      <td>${pedido.restricoes.join(", ") || "Nenhuma"}</td>
      <td>R$${pedido.valorTotal.toFixed(2)}</td>
      <td>
        <button onclick="editarPedido(${index})">Editar</button>
        <button onclick="excluirPedido(${index})">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

function editarPedido(index) {
  const pedido = pedidos[index];
  document.getElementById("nome").value = pedido.nome;
  document.getElementById("tipo").value = pedido.tipo;
  document.getElementById("quantidade").value = pedido.quantidade;

  document.querySelectorAll(".restricao").forEach(el => {
    el.checked = pedido.restricoes.includes(el.value);
  });

  editandoIndex = index;
}

function excluirPedido(index) {
  if (confirm("Deseja realmente excluir este pedido?")) {
    pedidos.splice(index, 1);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    renderizarPedidos();
    mostrarMensagem("Pedido excluído com sucesso!");
  }
}

function mostrarMensagem(texto) {
  const msg = document.getElementById("mensagem");
  msg.textContent = texto;
  setTimeout(() => msg.textContent = "", 3000);
}