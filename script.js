// ★あなたのApps ScriptのURLをここに入れてください（末尾に /exec が必要）
const API_URL = "https://script.google.com/macros/s/AKfycbzH1BxjtpjsnOotarPE7X640L9aA4CC8vWYgCUDNhFQkjuyDcy8tY49CAVtc6yJ8z93/exec";

// フォームとテーブルの取得
const form = document.getElementById("itemForm");
const table = document.getElementById("itemTable");
const loading = document.getElementById("loading");

// フォーム送信時の処理
form.onsubmit = async (e) => {
  e.preventDefault();

  // 各入力欄からデータを取得
  const item = {
    name: document.getElementById("name").value.trim(),
    expiry: document.getElementById("expiry").value,
    owner: document.getElementById("owner").value.trim(),
    place: document.getElementById("place").value.trim(),
  };

  // デバッグ用ログ
  console.log("送信内容:", item);

  // APIにPOST
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(item),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.text();
  console.log("APIレスポンス:", result);

  form.reset();     // フォームを空にする
  loadData();       // 表を更新
};

// データ取得と表示
async function loadData() {
  loading.style.display = "block";
  const res = await fetch(API_URL);
  const data = await res.json();
  renderTable(data);
  loading.style.display = "none";
}

// 表の描画
function renderTable(data) {
  table.innerHTML = "";
  const today = new Date().toISOString().split("T")[0];

  data.forEach(([name, expiry, owner, place]) => {
    const tr = document.createElement("tr");

    // 賞味期限のチェック
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

// n日後の文字列を返す関数（賞味期限チェック用）
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// ページ表示時に初期データ読み込み
loadData();
