const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const registerExecBtn = document.getElementById("registerExecBtn");

const loginExecBtn = document.getElementById("loginExecBtn");
const passInput = document.getElementById("registerPassword");
const goTop1 = document.getElementById("goTop1");
const goTop2 = document.getElementById("goTop2");
const loginPass = document.getElementById("loginPass");





// 最初はフォーム非表示
loginForm.style.display = "none";
registerForm.style.display = "none";

// UI を初期状態に戻す関数
function resetUI() {
  loginForm.style.display = "none";
  registerForm.style.display = "none";
  loginBtn.style.display = "inline-block";
  registerBtn.style.display = "inline-block";
}

// ログインボタン → ログインフォーム表示
loginBtn.addEventListener("click", () => {
  loginBtn.style.display = "none";
  registerBtn.style.display = "none";
  loginForm.style.display = "block";
});
//パスワード入力後エンターでログインボタンをクリックしたのと同じにする
loginPass.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("loginExecBtn").click();
  }
});

//ログイン実行
loginExecBtn.addEventListener("click", async () => {
  
  const name = document.getElementById("userName").value;
  const password = document.getElementById("loginPass").value;

  const response = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, password })
  });

  const data = await response.json();

  if (data.status === "ok") {
    // ログインしたユーザー名を保存
    localStorage.setItem("currentUserId", data.id);
    localStorage.setItem("currentUser", name);
    // role によって遷移先を変える
    if (data.role === "admin") {
      window.location.href = "../pages/admin/admin.html";
    } else {
      window.location.href = "../pages/users/users.html";
    }
  } else {
    document.getElementById("loginResult").textContent = data.message;
  }
});


// 新規登録ボタン → 新規登録フォーム表示
registerBtn.addEventListener("click", () => {
  loginBtn.style.display = "none";
  registerBtn.style.display = "none";
  registerForm.style.display = "block";
});
//パスワード入力制限
passInput.addEventListener("input", () => {
  passInput.value = passInput.value.replace(/[^A-Za-z0-9]/g, "");
});
//登録ボタン
registerExecBtn.addEventListener("click", async () => {
  const name = document.getElementById("registerName").value;
  const password = document.getElementById("registerPassword").value;

  const response = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, password })
  });

  const data = await response.json();

  // 成功
  if (data.status === "ok") {
    document.getElementById("registerResult").textContent =
      "登録完了しました！";
  }

  // エラー（名前重複など）
  if (data.status === "error") {
    document.getElementById("registerResult").textContent =
      data.message;
  }
});

// トップへ戻る（ログインフォーム側）
goTop1.addEventListener("click", resetUI);

// トップへ戻る（新規登録フォーム側）
goTop2.addEventListener("click", resetUI);
