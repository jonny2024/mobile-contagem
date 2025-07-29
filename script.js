const tabela = document.getElementById("tabela");
const addRowBtn = document.getElementById("addRow");
const resetBtn = document.getElementById("resetCounts");

// Carrega do localStorage
function carregarDados() {
  const data = JSON.parse(localStorage.getItem("contagem")) || [];
  data.forEach(addRow);
}

// Salva no localStorage
function salvarDados() {
  const rows = Array.from(document.querySelectorAll(".row")).map(row => ({
    produto: row.querySelector(".produto").value,
    grupo: row.querySelector(".grupo").value,
    estoque: row.querySelector(".estoque").value,
    bar: row.querySelector(".bar").value,
    avarias: row.querySelector(".avarias").value
  }));
  localStorage.setItem("contagem", JSON.stringify(rows));
}

function addRow(data = {}) {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <input type="text" class="produto" placeholder="Produto" value="${data.produto || ''}">
    <input type="text" class="grupo" placeholder="Grupo" value="${data.grupo || ''}">
    <input type="number" class="estoque" value="${data.estoque || 0}">
    <input type="number" class="bar" value="${data.bar || 0}">
    <input type="number" class="avarias" value="${data.avarias || 0}">
    <input type="number" class="total" disabled value="0">
    <button class="delete">🗑️</button>
  `;

  const inputs = row.querySelectorAll("input[type='number']");
  const totalField = row.querySelector(".total");

  function atualizarTotal() {
    const estoque = parseInt(row.querySelector(".estoque").value) || 0;
    const bar = parseInt(row.querySelector(".bar").value) || 0;
    const avarias = parseInt(row.querySelector(".avarias").value) || 0;
    const total = estoque + bar + avarias;
    totalField.value = total;
    salvarDados();
  }

  inputs.forEach(input => {
    input.addEventListener("input", atualizarTotal);
  });

  const textInputs = row.querySelectorAll("input[type='text']");
  textInputs.forEach(input => {
    input.addEventListener("input", salvarDados);
  });

  row.querySelector(".delete").addEventListener("click", () => {
    row.remove();
    salvarDados();
  });

  tabela.appendChild(row);
  atualizarTotal();
}

addRowBtn.addEventListener("click", () => addRow());
resetBtn.addEventListener("click", () => {
  document.querySelectorAll(".estoque, .bar, .avarias").forEach(input => {
    input.value = 0;
  });
  document.querySelectorAll(".row").forEach(row => {
    const totalField = row.querySelector(".total");
    totalField.value = 0;
  });
  salvarDados();
});

carregarDados();
