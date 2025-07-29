import { db, ref, set, onValue, remove } from './firebase.js';

const tabela = document.getElementById("tabela");
const addRowBtn = document.getElementById("addRow");
const resetCountsBtn = document.getElementById("resetCounts");
const dadosRef = ref(db, "produtos");

function createRow(produto = "", grupo = "", estoque = "", bar = "", avarias = "", id = Date.now()) {
  const row = document.createElement("div");
  row.className = "row";

  const produtoInput = createInput(produto, "produto");
  const grupoInput = createInput(grupo, "grupo");
  const estoqueInput = createInput(estoque, "estoque", true);
  const barInput = createInput(bar, "bar", true);
  const avariasInput = createInput(avarias, "avarias", true);
  const totalSpan = document.createElement("span");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";

  function calcularTotal() {
    const total = 
      parseInt(estoqueInput.value) || 0 + 
      parseInt(barInput.value) || 0 + 
      parseInt(avariasInput.value) || 0;
    totalSpan.textContent = total;
  }

  [produtoInput, grupoInput, estoqueInput, barInput, avariasInput].forEach(input =>
    input.addEventListener("input", () => {
      calcularTotal();
      salvarDados();
    })
  );

  deleteBtn.onclick = () => {
    remove(ref(db, `produtos/${id}`));
  };

  calcularTotal();

  row.append(produtoInput, grupoInput, estoqueInput, barInput, avariasInput, totalSpan, deleteBtn);
  row.dataset.id = id;
  return row;
}

function createInput(value = "", type = "", isNumber = false) {
  const input = document.createElement("input");
  input.value = value;
  input.type = isNumber ? "number" : "text";
  input.placeholder = type;
  return input;
}

function salvarDados() {
  const rows = Array.from(document.querySelectorAll(".row"));
  const data = {};
  rows.forEach(row => {
    const id = row.dataset.id;
    const inputs = row.querySelectorAll("input");
    data[id] = {
      produto: inputs[0].value,
      grupo: inputs[1].value,
      estoque: inputs[2].value,
      bar: inputs[3].value,
      avarias: inputs[4].value
    };
  });
  set(dadosRef, data);
}

function carregarDados() {
  onValue(dadosRef, (snapshot) => {
    tabela.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      Object.entries(data).forEach(([id, valores]) => {
        const linha = createRow(valores.produto, valores.grupo, valores.estoque, valores.bar, valores.avarias, id);
        tabela.appendChild(linha);
      });
    }
  });
}

addRowBtn.onclick = () => {
  const novaLinha = createRow();
  tabela.appendChild(novaLinha);
  salvarDados();
};

resetCountsBtn.onclick = () => {
  const rows = document.querySelectorAll(".row");
  rows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    inputs[2].value = "";
    inputs[3].value = "";
    inputs[4].value = "";
  });
  salvarDados();
};

carregarDados();
