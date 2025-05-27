/*const API_URL = "https://c22b-34-82-238-79.ngrok-free.app/generate"; // ⚠️ Cambia si ngrok se reinicia

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
      const imageHtml = `
        <div style="text-align: center;">
          <img 
            src="${data.url}" 
            alt="Imagen generada" 
            style="max-width: 100%; border-radius: 8px; margin-top: 10px;"
          >
          <br>
          <a 
            href="${data.url}" 
            download="imagen-generada.png"
            style="
              display: inline-block;
              margin-top: 8px;
              padding: 6px 12px;
              background-color: #5c67f2;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            "
          >⬇ Descargar imagen</a>
        </div>
      `;
      addMessage("bot", imageHtml);
    } else {
      addMessage("bot", "❌ Error generando la imagen: " + data.message);
    }
  } catch (err) {
    removeMessageById(loadingMsgId);
    addMessage("bot", "⚠️ Error de conexión con el servidor.");
    console.error(err);
  }
}

// Función para añadir mensajes al chat
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

  return msgId;
}

// Función para eliminar mensaje por ID (por ejemplo el mensaje de carga)
function removeMessageById(id) {
  const elem = document.getElementById(id);
  if (elem) elem.remove();
}

// Función para cerrar alertas (si las usas en tu HTML)
function closeAlert() {
  document.getElementById("alertBox").style.display = "none";
}
*/const API_URL = "https://a0ab-34-91-135-170.ngrok-free.app/generate"; // ← cambia esto cada vez que reinicies ngrok

// ID único por usuario
let userId = localStorage.getItem("user_id");
if (!userId) {
  userId = Math.random().toString(36).substring(2, 10);
  localStorage.setItem("user_id", userId);
}

async function getResponse() {
  const inputElement = document.getElementById("user-input");
  const fileInput = document.getElementById("image-input");
  const userText = inputElement.value.trim();

  if (!userText) return;

  addMessage("user", userText);
  inputElement.value = "";

  const loadingMsgId = addMessage("bot", "⏳ Generando imagen, por favor espera...");

  try {
    const formData = new FormData();
    formData.append("prompt", userText);
    formData.append("user_id", userId);

    if (fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    removeMessageById(loadingMsgId);

    if (data.status === "success") {
      const imageHtml = `
        <div style="text-align: center;">
          <img 
            src="${data.url}" 
            alt="Imagen generada" 
            style="max-width: 100%; border-radius: 8px; margin-top: 10px;"
          >
          <br>
          <a 
            href="${data.url}" 
            download="imagen-generada.png"
            style="
              display: inline-block;
              margin-top: 8px;
              padding: 6px 12px;
              background-color: #5c67f2;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            "
          >⬇ Descargar imagen</a>
        </div>
      `;
      addMessage("bot", imageHtml);
    } else {
      addMessage("bot", "❌ Error generando la imagen: " + data.message);
    }
  } catch (err) {
    removeMessageById(loadingMsgId);
    addMessage("bot", "⚠️ Error de conexión con el servidor.");
    console.error(err);
  }
}

// Añadir mensaje
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

  return msgId;
}

// Eliminar mensaje de espera
function removeMessageById(id) {
  const elem = document.getElementById(id);
  if (elem) elem.remove();
}
