const API_URL = "https://d349-34-83-63-154.ngrok-free.app/generate"; // cambia esto si ngrok genera uno nuevo

// Generar o recuperar el ID único del usuario
let userId = localStorage.getItem("user_id");
if (!userId) {
  userId = Math.random().toString(36).substring(2, 10);
  localStorage.setItem("user_id", userId);
}

// Función para enviar y recibir mensajes
async function getResponse() {
  const inputElement = document.getElementById("user-input");
  const userText = inputElement.value.trim();
  if (!userText) return;

  addMessage("user", userText);
  inputElement.value = "";

  // Mostrar mensaje de carga
  const loadingMsgId = addMessage("bot", "⏳ Generando imagen, por favor espera...");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: userText,
        user_id: userId
      })
    });

    const data = await response.json();

    // Eliminar el mensaje de carga
    removeMessageById(loadingMsgId);

    if (data.status === "success") {
      addMessage("bot", `<img src="${data.url}" alt="Imagen generada" style="max-width: 100%; border-radius: 8px;">`);
    } else {
      addMessage("bot", "❌ Error generando la imagen: " + data.message);
    }
  } catch (err) {
    removeMessageById(loadingMsgId);
    addMessage("bot", "⚠️ Error de conexión con el servidor.");
    console.error(err);
  }
}

// Función para añadir mensajes
function addMessage(sender, text) {
  const chatMessages = document.getElementById("chatMessages");

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  const msgId = "msg-" + Date.now();
  messageDiv.id = msgId;

  const img = document.createElement("img");
  img.src = sender === "user" ? "./img/help/user.png" : "./img/help/logoayud.png";
  img.alt = sender;

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerHTML = sender === "bot" ? `<strong>KinglyShade:</strong> ${text}` : text;

  messageDiv.appendChild(img);
  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  return msgId; // Devuelve el ID para poder eliminarlo después si es necesario
}

// Función para quitar un mensaje por ID
function removeMessageById(id) {
  const elem = document.getElementById(id);
  if (elem) elem.remove();
}

// Cerrar alerta
function closeAlert() {
  document.getElementById("alertBox").style.display = "none";
}
