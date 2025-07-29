// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, set, push, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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
const tabelaRef = ref(db, 'produtos');
const tabelaEl = document.getElementById("tabela");
const addRowBtn = document.getElementById("addRow");
const resetBtn = document.getElementById("resetCounts");

function createInput(value, type = "text", onChange) {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  input.addEventListener("input", onChange); // Usando 'input' ao invés de 'change'
  return input;
}

function createRow(key, data) {
  const row = document.createElement("div");
  row.className = "row";

  const produtoInput = createInput(data.produto, "text", (e) => updateValue(key, 'produto', e.target.value));
  produtoInput.className = "wide";
  const grupoInput = createInput(data.grupo, "text", (e) => updateValue(key, 'grupo', e.target.value));
  grupoInput.className = "wide";

  const estoqueInput = createInput(data.estoque || 0, "number", (e) => updateNumber(key));
  const barInput = createInput(data.bar || 0, "number", (e) => updateNumber(key));
  const avariasInput = createInput(data.avarias || 0, "number", (e) => updateNumber(key));

  const total = document.createElement("span");
  total.className = "total";
  total.innerText = Number(data.estoque || 0) + Number(data.bar || 0) + Number(data.avarias || 0);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Excluir";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => remove(ref(db, `produtos/${key}`)));

  row.append(produtoInput, grupoInput, estoqueInput, barInput, avariasInput, total, deleteBtn);
  tabelaEl.appendChild(row);
}

function updateValue(key, field, value) {
  set(ref(db, `produtos/${key}/${field}`), value);
}

function updateNumber(key) {
  const row = [...tabelaEl.children].find(r => r.querySelector(".delete-btn").onclick.toString().includes(key));
  if (!row) return;

  const [produtoInput, grupoInput, estoqueInput, barInput, avariasInput, totalEl] = row.children;
  const estoque = Number(estoqueInput.value) || 0;
  const bar = Number(barInput.value) || 0;
  const avarias = Number(avariasInput.value) || 0;
  const total = estoque + bar + avarias;
  totalEl.innerText = total;

  set(ref(db, `produtos/${key}`), {
    produto: produtoInput.value,
    grupo: grupoInput.value,
    estoque,
    bar,
    avarias
  });
}

function loadData() {
  onValue(tabelaRef, (snapshot) => {
    tabelaEl.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      Object.entries(data).forEach(([key, value]) => createRow(key, value));
    }
  });
}

addRowBtn.addEventListener("click", () => {
  const newRef = push(tabelaRef);
  set(newRef, {
    produto: "",
    grupo: "",
    estoque: 0,
    bar: 0,
    avarias: 0
  });
});

resetBtn.addEventListener("click", () => {
  onValue(tabelaRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    Object.keys(data).forEach((key) => {
      const item = data[key];
      set(ref(db, `produtos/${key}`), {
        ...item,
        estoque: 0,
        bar: 0,
        avarias: 0
      });
    });
  }, { onlyOnce: true });
});

loadData();
