import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMVXlYLkJ7CU-4_k75f8wFzMEzAr4g_2g",
  authDomain: "contagemdeprodutos-62d48.firebaseapp.com",
  databaseURL: "https://contagemdeprodutos-62d48-default-rtdb.firebaseio.com",
  projectId: "contagemdeprodutos-62d48",
  storageBucket: "contagemdeprodutos-62d48.appspot.com",
  messagingSenderId: "203996681838",
  appId: "1:203996681838:web:c1ef444145e7086998387f",
  measurementId: "G-6LRFB4V3PF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tabela = document.getElementById("tabela");
const addRowBtn = document.getElementById("addRow");
const resetBtn = document.getElementById("resetCounts");

function createRow(id, data = {}) {
  const row = document.createElement("div");
  row.className = "row";

  const produto = document.createElement("input");
  produto.value = data.produto || "";
  produto.oninput = () => save();

  const grupo = document.createElement("input");
  grupo.value = data.grupo || "";
  grupo.oninput = () => save();

  const estoque = document.createElement("input");
  estoque.type = "number";
  estoque.value = data.estoque || 0;
  estoque.oninput = () => updateTotal(row);

  const bar = document.createElement("input");
  bar.type = "number";
  bar.value = data.bar || 0;
  bar.oninput = () => updateTotal(row);

  const avarias = document.createElement("input");
  avarias.type = "number";
  avarias.value = data.avarias || 0;
  avarias.oninput = () => updateTotal(row);

  const total = document.createElement("span");
  total.textContent = calcularTotal(estoque.value, bar.value, avarias.value);

  const excluir = document.createElement("button");
  excluir.textContent = "Excluir";
  excluir.onclick = () => {
    row.remove();
    save();
  };

  row.append(produto, grupo, estoque, bar, avarias, total, excluir);
  tabela.appendChild(row);
}

function calcularTotal(e, b, a) {
  return Number(e) + Number(b) + Number(a);
}

function updateTotal(row) {
  const inputs = row.querySelectorAll("input");
  const totalSpan = row.querySelector("span");
  const [produto, grupo, estoque, bar, avarias] = inputs;
  totalSpan.textContent = calcularTotal(estoque.value, bar.value, avarias.value);
  save();
}

function save() {
  const rows = Array.from(tabela.children).map(row => {
    const inputs = row.querySelectorAll("input");
    const total = row.querySelector("span").textContent;
    return {
      produto: inputs[0].value,
      grupo: inputs[1].value,
      estoque: inputs[2].value,
      bar: inputs[3].value,
      avarias: inputs[4].value,
      total
    };
  });

  set(ref(db, "produtos"), rows);
}

function resetContagem() {
  Array.from(tabela.children).forEach(row => {
    const inputs = row.querySelectorAll("input");
    inputs[2].value = 0; // estoque
    inputs[3].value = 0; // bar
    inputs[4].value = 0; // avarias
    updateTotal(row);
  });
  save();
}

onValue(ref(db, "produtos"), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    tabela.innerHTML = "";
    data.forEach((item, i) => createRow(i, item));
  }
});

addRowBtn.onclick = () => createRow(Date.now());
resetBtn.onclick = resetContagem;
