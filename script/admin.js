const BASE_URL = "YOUR_BACKEND_URL";
let adminPassword = "";
let deleteIndex = null;

// Alerts
function showAlert(message, type="success") {
  const alertBox = document.getElementById("iceAlert");

  let iconSrc = "";
  if(type === "success") iconSrc = "assets/white_check_mark (2).png";    // ✅ replacement
  else if(type === "error") iconSrc = "assets/x (1).png"; // ❌ replacement
  else if(type === "info") iconSrc = "assets/warning.png";   // ⚠️ replacement

  // Update alert with image and message
  alertBox.innerHTML = `<img src="${iconSrc}" alt="${type}" style="width:1.2em; vertical-align:middle; margin-right:6px;"> ${message}`;
  alertBox.className = `ice-alert ${type} show`;

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
}

// Login
async function login() {
  const pass = document.getElementById("adminPass").value;
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass })
    });
    if(res.ok){
      adminPassword = pass;
      const data = await res.json();
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("messagesPanel").style.display = "block";
      renderMessages(data.messages);
      showAlert("Logged in successfully!", "success");
    } else {
      showAlert("Incorrect password!", "error");
    }
  } catch(err){
    console.error(err);
    showAlert("Server is turned off!", "info");
  }
}

// Render Messages 
function renderMessages(messages) {
  const tbody = document.getElementById("messagesTable");
  tbody.innerHTML = "";
  messages.forEach((msg, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${msg.name}</td>
      <td>${msg.email}</td>
      <td>${msg.message}</td>
      <td>${new Date(msg.date).toLocaleString()}</td>
      <td>
        <button class="delete-btn" onclick="openModal(${index})">
          <img src="assets/warning.png" alt="delete" style="width:1.2em; vertical-align:middle; margin-right:4px;"> Solved??
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Modal
function openModal(index) {
  deleteIndex = index;
  document.getElementById("modalText").textContent = "Are you sure you solved this issue and want to delete this message?";
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("confirmPass").value = "";
}

// Confirm Delete
async function confirmDelete() {
  const confirmPass = document.getElementById("confirmPass").value;
  try {
    const res = await fetch(`${BASE_URL}/admin/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: confirmPass, index: deleteIndex })
    });
    if(res.ok){
      const data = await res.json();
      renderMessages(data.messages);
      closeModal();
      showAlert("Message deleted successfully!", "success");
    } else {
      closeModal();
      showAlert("Failed to delete! Wrong password.", "error");
    }
  } catch(err){
    console.error(err);
    closeModal();
    showAlert("Server error while deleting!", "info");
  }
}

// Logout 
document.querySelector(".logout-btn").addEventListener("click", logout);
function logout() {
  adminPassword = "";
  document.getElementById("messagesPanel").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("adminPass").value = "";
  showAlert("Logged out successfully!", "info");
}