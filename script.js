// 🔁 Substitua pelos seus dados do Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyBMVXlYLkJ7CU-4_k75f8wFzMEzAr4g_2g",
  authDomain: "contagemdeprodutos-62d48.firebaseapp.com",
  databaseURL: "https://contagemdeprodutos-62d48-default-rtdb.firebaseio.com",
  projectId: "contagemdeprodutos-62d48",
  storageBucket: "contagemdeprodutos-62d48.appspot.com",
  messagingSenderId: "203996681838",
  appId: "1:203996681838:web:c1ef444145e7086998387f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const tabela = document.getElementById("tabela");
const addRowBtn = document.getElementById("addRow");
const resetBtn = document.getElementById("resetCounts");

function salvarFirebase() {
  const rows = Array.from(document.querySelectorAll(".row")).map(row => ({
    produto: row.querySelector(".produto").value,
    estoque: row.querySelector(".estoque").value,
    bar: row.querySelector(".bar").value,
    avarias: row.querySelector(".avarias").value
  }));
  db.ref("contagem").set(rows);
}

function carregarFirebase() {
  db.ref("contagem").once("value", snapshot => {
    const data = snapshot.val() || [];
    data.forEach(addRow);
  });
}

function addRow(data = {}) {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <input type="text" class="produto" placeholder="Produto" value="${data.produto || ''}">
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
    salvarFirebase();
  }

  inputs.forEach(input => {
    input.addEventListener("input", atualizarTotal);
  });

  const textInputs = row.querySelectorAll("input[type='text']");
  textInputs.forEach(input => {
    input.addEventListener("input", salvarFirebase);
  });

  row.querySelector(".delete").addEventListener("click", () => {
    row.remove();
    salvarFirebase();
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
  salvarFirebase();
});

carregarFirebase();
