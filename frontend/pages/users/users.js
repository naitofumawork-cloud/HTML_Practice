const userId = localStorage.getItem("currentUserId");

async function loadUserInfo() {
  const response = await fetch(`http://localhost:8000/user_info/${userId}`);
  const data = await response.json();

  if (data.status === "ok") {
    document.getElementById("currentUserName").textContent = data.name;
    document.getElementById("currentTicket").textContent = data.battle_ticket;
    document.getElementById("currentCoin").textContent = data.coin;
  } else {
    document.getElementById("currentUserName").textContent = "取得失敗";
  }
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentUserId");
  window.location.href = "../../index/index.html";
});
document.getElementById("gachaBtn").addEventListener("click", () => {
  window.location.href = "gacha/gacha.html";
});

loadUserInfo();
