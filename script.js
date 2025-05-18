const API_URL = "https://script.google.com/macros/s/AKfycbzH1BxjtpjsnOotarPE7X640L9aA4CC8vWYgCUDNhFQkjuyDcy8tY49CAVtc6yJ8z93/exec"; // ← あなたのAPI URLに置き換えてください

const table = document.getElementById("itemTable");
const form = document.getElementById("itemForm");
const loading = document.getElementById("loading");

form.onsubmit = async e => {
  e.preventDefault();
  const item = {
    name: form.name.value.trim(),
    expiry: form.expiry.value,
    owner: form.owner.value.trim(),
    place: form.place.value.trim()
  };
  if (!item.name || !item.expiry || !item.owner || !item.place) return;

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(item),
    headers: { "Content-Type": "application/json" }
  });

  form.reset();
  loadData();
};

async function loadData() {
  loading.style.display = "block";
  const res = await fetch(API_URL);
  const data = await res.json();
  renderTable(data);
  loading.style.display = "none";
}

function renderTable(data) {
  const today = new Date().toISOString().split("T")[0];
  table.innerHTML = "";

  data.forEach(row => {
    const [name, expiry, owner, place] = row;
    const tr = document.createElement("tr");
    if (expiry < today) tr.className = "expired";
    else if (expiry <= addDays(today, 3)) tr.className = "warning";
    tr.innerHTML = `
      <td>${name}</td>
      <td>${expiry}</td>
      <td>${owner}</td>
      <td>${place}</td>
    `;
    table.appendChild(tr);
  });
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

loadData();

