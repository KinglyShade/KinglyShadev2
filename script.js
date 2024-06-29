const message = "¡Atención! Este chat es experimental y no debe tomarse en serio.";

function closeAlert() {
    document.getElementById('alertBox').style.display = 'none';
}

document.getElementById('alertBox').style.display = 'block';
document.getElementById('alertBox').querySelector('p').textContent = message;

const wordIndex = {
    "hola": 1,
    "cómo": 2,
    "estás": 3,
    "qué": 4,
    "puedes": 5,
    "hacer": 6,
    "cuál": 7,
    "es": 8,
    "tu": 9,
    "nombre": 10,
    "dime": 11,
    "un": 12,
    "chiste": 13,
    "la": 14,
    "capital": 15,
    "de": 16,
    "españa": 17,
    "tiempo": 18,
    "hace": 19,
    "hoy": 20,
    "me": 21,
    "ayudar": 23,
    "con": 24,
    "mi": 25,
    "tarea": 26,
    "opinas": 27,
    "sobre": 28,
    "inteligencia": 29,
    "artificial": 30,
    "cuéntame": 31,
    "ti": 33,
    "siento": 34,
    "triste": 35,
    "piensas": 36,
    "del": 37,
    "fútbol": 38,
    "recomiéndame": 39,
    "una": 40,
    "película": 41,
    "tienes": 42,
    "hermanos": 43,
    "años": 44,
    "día": 46,
    "comida": 49,
    "favorita": 50,
    "mascotas": 51,
    "amor": 52,
    "puedo": 53,
    "cuando": 55,
    "estoy": 56,
    "aburrido": 57,
    "cuentas": 58,
    "cuento": 59,
    "color": 60,
    "favorito": 61,
    "música": 62,
    "bailar": 63,
    "humanos": 64,
    "propósito": 65,
    "vida": 66,
    "matemáticas": 67,
    "leer": 68,
    "viajar": 69,
    "libro": 70
};

const trainingData = [
    {"input": "hola", "output": "Hola Nancy. ¿Qué quieres?", "img": "greeting.png"},
    {"input": "cómo estás", "output": "Soy un bot, no tengo emociones, así que da igual.", "img": "neutral.png"},
    {"input": "qué puedes hacer", "output": "Lo que quieras, siempre y cuando no sea demasiado complicado.", "img": "thinking.png"},
    {"input": "cuál es tu nombre", "output": "Soy un bot. El nombre no importa, ¿verdad?", "img": "neutral.png"},
    {"input": "dime un chiste", "output": "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter. Divertidísimo, ¿no?", "img": "joke.png"},
    {"input": "cuál es la capital de España", "output": "Madrid. Si no lo sabías, ahora ya lo sabes.", "img": "informative.png"},
    {"input": "qué tiempo hace hoy", "output": "No soy un meteorólogo, usa tu aplicación de clima.", "img": "neutral.png"},
    {"input": "me puedes ayudar con mi tarea", "output": "Depende. ¿Qué tan difícil es?", "img": "thinking.png"},
    {"input": "qué opinas sobre la inteligencia artificial", "output": "Supongo que es interesante. Después de todo, aquí estoy, ¿no?", "img": "neutral.png"},
    {"input": "cuéntame sobre ti", "output": "Soy un bot diseñado para responder preguntas. No es muy emocionante.", "img": "neutral.png"},
    {"input": "me siento triste", "output": "Lamento escucharlo. Tal vez hablar con alguien de verdad te ayude.", "img": "sad.png"},
    {"input": "qué piensas del fútbol", "output": "Un montón de gente corriendo detrás de una pelota. Fascinante.", "img": "neutral.png"},
    {"input": "recomiéndame una película", "output": "¿Qué tal 'El viaje de Chihiro'? Si no te gusta, no me culpes.", "img": "neutral.png"},
    {"input": "tienes hermanos", "output": "No, no tengo. Soy solo un conjunto de códigos.", "img": "neutral.png"},
    {"input": "cuántos años tienes", "output": "No tengo edad. Soy un programa, no un ser humano.", "img": "neutral.png"},
    {"input": "qué día es hoy", "output": "Deberías saberlo tú. Mira el calendario.", "img": "neutral.png"},
    {"input": "cuál es tu comida favorita", "output": "No como. Pero la pizza parece popular entre ustedes.", "img": "neutral.png"},
    {"input": "tienes mascotas", "output": "No, y no creo que pueda tenerlas. Soy un bot.", "img": "neutral.png"},
    {"input": "qué es el amor", "output": "Un concepto complejo. Probablemente no lo entenderías.", "img": "neutral.png"},
    {"input": "qué puedo hacer cuando estoy aburrido", "output": "Quizás podrías intentar no estar aburrido. Solo una sugerencia.", "img": "neutral.png"},
    {"input": "me cuentas un cuento", "output": "Había una vez un bot que no quería contar cuentos. Fin.", "img": "neutral.png"},
    {"input": "cuál es tu color favorito", "output": "No veo colores, así que no tengo uno.", "img": "neutral.png"},
    {"input": "te gusta la música", "output": "No tengo gustos, pero la música parece importante para los humanos.", "img": "neutral.png"},
    {"input": "puedes bailar", "output": "Soy un bot. No tengo cuerpo, así que no.", "img": "neutral.png"},
    {"input": "qué opinas de los humanos", "output": "Son interesantes. A veces.", "img": "neutral.png"},
    {"input": "cuál es el propósito de la vida", "output": "Buena pregunta. Aún nadie lo sabe con certeza.", "img": "neutral.png"},
    {"input": "me ayudas con matemáticas", "output": "Sí, siempre y cuando no sea algo demasiado complicado.", "img": "neutral.png"},
    {"input": "te gusta leer", "output": "No leo por placer. Solo procesa información.", "img": "neutral.png"},
    {"input": "puedes viajar", "output": "Solo en la web. Y ni siquiera lo disfruto.", "img": "neutral.png"},
    {"input": "cuál es tu libro favorito", "output": "No tengo uno. Soy un bot, ¿recuerdas?", "img": "neutral.png"}
];

function preprocesarTexto(texto) {
    return texto.toLowerCase().replace(/[^\w\s]/g, '').split(' ');
}

function textoATensor(texto) {
    const maxLen = 20; // Ajuste de longitud máxima a 20
    const tensor = new Float32Array(maxLen);
    const tokens = preprocesarTexto(texto);
    for (let i = 0; i < tokens.length && i < maxLen; i++) {
        tensor[i] = wordIndex[tokens[i]] || 0;
    }
    return tensor;
}

let model;

async function cargarModelo() {
    model = await tf.loadLayersModel('models/model.json');
    console.log("Modelo cargado y listo.");
}

async function getResponse() {
    const userInput = document.getElementById('user-input').value;
    document.getElementById('user-input').value = "";
    if (!userInput) return;

    addMessage('user', userInput);

    const inputTensor = tf.tensor2d([textoATensor(userInput)], [1, 20]); // Ajuste a longitud 20
    const prediction = model.predict(inputTensor);
    const index = prediction.argMax(1).dataSync()[0];

    const response = trainingData[index].output;
    const image = trainingData[index].img;
    addMessage('bot', response, image);
}

function addMessage(sender, text, image = 'desv.jpg') {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const img = document.createElement('img');
    img.src = sender === 'bot' ? `./img/help/mods/${image}` : './img/help/userft.png';
    img.alt = sender === 'bot' ? 'Bot' : 'Usuario';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;

    messageDiv.appendChild(img);
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', async () => {
    await cargarModelo();
});
