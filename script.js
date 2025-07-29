import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMVXlYLkJ7CU-4_k75f8wFzMEzAr4g_2g",
  authDomain: "contagemdeprodutos-62d48.firebaseapp.com",
  databaseURL: "https://contagemdeprodutos-62d48-default-rtdb.firebaseio.com",
  projectId: "contagemdeprodutos-62d48",
  storageBucket: "contagemdeprodutos-62d48.appspot.com",
  messagingSenderId: "203996681838",
  appId: "1:203996681838:web:c1ef444145e7086998387f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "produtos");

const tabela = document.getElementById("tabela");
const addRowBtn = document.getElementById("addRow");
const resetBtn = document.getElementById("resetCounts");

function criarInput(value = '', type = 'text', oninput = null) {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  input.oninput = () => {
    if (oninput) oninput();
    salvarDados();
  };
  return input;
}

function calcularTotal(row, estoqueInput, barInput, avariasInput) {
  const total = parseInt(estoqueInput.value || 0) +
                parseInt(barInput.value || 0) +
                parseInt(avariasInput.value || 0);
  row.querySelector(".total").textContent = total;
}

function criarLinha(dados = {}) {
  const row = document.createElement("div");
  row.className = "product-row";

  const produtoInput = criarInput(dados.produto || '');
  const grupoInput = criarInput(dados.grupo || '');
  const estoqueInput = criarInput(dados.estoque || 0, 'number', () => calcularTotal(row, estoqueInput, barInput, avariasInput));
  const barInput = criarInput(dados.bar || 0, 'number', () => calcularTotal(row, estoqueInput, barInput, avariasInput));
  const avariasInput = criarInput(dados.avarias || 0, 'number', () => calcularTotal(row, estoqueInput, barInput, avariasInput));

  const totalSpan = document.createElement("span");
  totalSpan.className = "total";
  totalSpan.textContent = dados.total || 0;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Excluir";
  delBtn.onclick = () => {
    tabela.removeChild(row);
    salvarDados();
  };

  row.append(produtoInput, grupoInput, estoqueInput, barInput, avariasInput, totalSpan, delBtn);
  tabela.appendChild(row);

  calcularTotal(row, estoqueInput, barInput, avariasInput);
}

function salvarDados() {
  const linhas = tabela.querySelectorAll(".product-row");
  const dados = Array.from(linhas).map(row => {
    const inputs = row.querySelectorAll("input");
    return {
      produto: inputs[0].value,
      grupo: inputs[1].value,
      estoque: parseInt(inputs[2].value || 0),
      bar: parseInt(inputs[3].value || 0),
      avarias: parseInt(inputs[4].value || 0),
      total: parseInt(row.querySelector(".total").textContent || 0)
    };
  });
  set(dbRef, dados);
}

addRowBtn.onclick = () => criarLinha();

resetBtn.onclick = () => {
  const linhas = tabela.querySelectorAll(".product-row");
  linhas.forEach(row => {
    const inputs = row.querySelectorAll("input");
    inputs[2].value = 0;
    inputs[3].value = 0;
    inputs[4].value = 0;
    row.querySelector(".total").textContent = 0;
  });
  salvarDados();
};

onValue(dbRef, snapshot => {
  tabela.innerHTML = "";
  const dados = snapshot.val() || [];
  dados.forEach(produto => criarLinha(produto));
});
