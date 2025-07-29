import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, set, push, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const produtosRef = ref(db, 'produtos');

const tabela = document.getElementById("tabela");
const addRowBtn = document.getElementById("addRow");
const resetCountsBtn = document.getElementById("resetCounts");

addRowBtn.onclick = () => {
  const newRef = push(produtosRef);
  set(newRef, {
    produto: "",
    grupo: "",
    estoque: 0,
    bar: 0,
    avarias: 0
  });
};

resetCountsBtn.onclick = () => {
  onValue(produtosRef, snapshot => {
    snapshot.forEach(child => {
      const key = child.key;
      update(ref(db, 'produtos/' + key), {
        estoque: 0,
        bar: 0,
        avarias: 0
      });
    });
  }, { onlyOnce: true });
};

onValue(produtosRef, snapshot => {
  tabela.innerHTML = "";
  snapshot.forEach(child => {
    const data = child.val();
    const key = child.key;
    const row = document.createElement("div");
    row.className = "row";

    const produto = createInput("text", data.produto);
    const grupo = createInput("text", data.grupo);
    const estoque = createInput("number", data.estoque);
    const bar = createInput("number", data.bar);
    const avarias = createInput("number", data.avarias);
    const total = document.createElement("span");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => remove(ref(db, 'produtos/' + key));

    const atualizarTotal = () => {
      const totalValue = Number(estoque.value) + Number(bar.value) + Number(avarias.value);
      total.textContent = totalValue;
    };

    [produto, grupo, estoque, bar, avarias].forEach(el => {
      el.oninput = () => {
        update(ref(db, 'produtos/' + key), {
          produto: produto.value,
          grupo: grupo.value,
          estoque: Number(estoque.value),
          bar: Number(bar.value),
          avarias: Number(avarias.value)
        });
        atualizarTotal();
      };
    });

    atualizarTotal();

    [produto, grupo, estoque, bar, avarias, total].forEach(el => row.appendChild(el));
    row.appendChild(deleteBtn);
    tabela.appendChild(row);
  });
});

function createInput(type, value) {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  return input;
}
