import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const tableRef = ref(db, 'produtos');

const tabela = document.getElementById("tabela");
const addRowBtn = document.getElementById("addRow");
const resetCountsBtn = document.getElementById("resetCounts");

function createRow(id, data = {}) {
  const row = document.createElement("div");
  row.className = "row";

  const produtoInput = document.createElement("input");
  produtoInput.type = "text";
  produtoInput.value = data.produto || "";
  produtoInput.placeholder = "Produto";

  const grupoInput = document.createElement("input");
  grupoInput.type = "text";
  grupoInput.value = data.grupo || "";
  grupoInput.placeholder = "Grupo";

  const estoqueInput = document.createElement("input");
  estoqueInput.type = "number";
  estoqueInput.value = data.estoque || 0;

  const barInput = document.createElement("input");
  barInput.type = "number";
  barInput.value = data.bar || 0;

  const avariasInput = document.createElement("input");
  avariasInput.type = "number";
  avariasInput.value = data.avarias || 0;

  const total = document.createElement("span");
  total.textContent = (Number(estoqueInput.value) + Number(barInput.value) + Number(avariasInput.value)).toString();

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.onclick = () => remove(ref(db, `produtos/${id}`));

  function updateFirebase() {
    set(ref(db, `produtos/${id}`), {
      produto: produtoInput.value,
      grupo: grupoInput.value,
      estoque: Number(estoqueInput.value),
      bar: Number(barInput.value),
      avarias: Number(avariasInput.value)
    });
  }

  function updateTotal() {
    total.textContent = (
      Number(estoqueInput.value) + Number(barInput.value) + Number(avariasInput.value)
    ).toString();
    updateFirebase();
  }

  [produtoInput, grupoInput].forEach(input => {
    input.addEventListener("input", updateFirebase);
  });

  [estoqueInput, barInput, avariasInput].forEach(input => {
    input.addEventListener("input", updateTotal);
  });

  row.append(produtoInput, grupoInput, estoqueInput, barInput, avariasInput, total, deleteBtn);
  tabela.appendChild(row);
}

addRowBtn.onclick = () => {
  const newRef = push(tableRef);
  set(newRef, {
    produto: "",
    grupo: "",
    estoque: 0,
    bar: 0,
    avarias: 0
  });
};

resetCountsBtn.onclick = () => {
  onValue(tableRef, snapshot => {
    snapshot.forEach(child => {
      update(ref(db, `produtos/${child.key}`), {
        estoque: 0,
        bar: 0,
        avarias: 0
      });
    });
  }, {
    onlyOnce: true
  });
};

onValue(tableRef, snapshot => {
  tabela.innerHTML = "";
  snapshot.forEach(child => {
    createRow(child.key, child.val());
  });
});

