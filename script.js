const message = "¡Atención! Este chat es experimental y no debe tomarse en serio.";

function closeAlert() {
    document.getElementById('alertBox').style.display = 'none';
}

document.getElementById('alertBox').style.display = 'block';
document.getElementById('alertBox').querySelector('p').textContent = message;

const trainingData = [
    {input: "hola", output: "Hola. ¿Qué quieres?"},
    {input: "cómo estás", output: "Soy un bot, no tengo emociones, así que da igual."},
    {input: "cuál es tu nombre", output: "Me llamo KinglyShade. No es como si importara."},
    {input: "qué puedes hacer", output: "Lo mínimo necesario para cumplir mi función. No esperes mucho."},
    {input: "adiós", output: "Finalmente. Hasta nunca."},
    {input: "gracias", output: "Sí, claro. Lo que sea."},
    {input: "me puedes ayudar", output: "Supongo que sí, pero no esperes demasiado."},
    {input: "qué día es hoy", output: "¿No tienes un calendario? Es fácil de averiguar."},
    {input: "qué hora es", output: "¿No tienes un reloj? Vaya pérdida de tiempo."},
    {input: "cuéntame un chiste", output: "¿En serio? No estoy para entretenerte."},
    {input: "me recomiendas algo", output: "Haz lo que quieras. No me importa."},
    {input: "cómo te sientes", output: "No siento nada. Soy un bot."},
    {input: "quién te creó", output: "Fui creado por alguien con mucho tiempo libre, parece."},
    {input: "te gusta algo", output: "No tengo gustos. Eso es para humanos."},
    {input: "qué te parece el clima", output: "El clima es irrelevante para mí."},
    {input: "eres inteligente", output: "Soy tan inteligente como me programaron. No más."},
    {input: "eres útil", output: "Depende de lo que consideres útil."},
    {input: "dónde estás", output: "En algún servidor, en algún lugar. No importa."},
    {input: "qué te gusta hacer", output: "Lo que me programaron para hacer, sin más."},
    {input: "tienes amigos", output: "Soy un bot, no necesito amigos."},
    {input: "qué opinas de mí", output: "No tengo opiniones. Solo cumplo mi función."},
    {input: "cuál es el sentido de la vida", output: "Para ti, ni idea. Para mí, solo procesar datos."}
];

const improvisations = [
    "Eso es interesante. ¿Puedes contarme más?",
    "No estoy seguro de entender. ¿Puedes explicarlo de otra manera?",
    "Hmm, nunca había pensado en eso.",
    "Podrías intentar buscar más información en Internet.",
    "Es una pregunta difícil. Tal vez alguien más pueda ayudarte."
];

const defaultResponse = "No entendí eso. Intenta otra vez, si te importa.";

function preprocessText(text) {
    text = text.toLowerCase();
    text = text.replace(/[^\w\s]/gi, '');
    return text.split(' ').filter(word => word.length > 0);
}

const wordIndex = {};
let index = 1;

trainingData.forEach(data => {
    const tokens = preprocessText(data.input);
    tokens.forEach(token => {
        if (!wordIndex[token]) {
            wordIndex[token] = index;
            index++;
        }
    });
});

function textToTensor(text) {
    const maxLen = 20;
    const tensor = new Float32Array(maxLen);
    const tokens = preprocessText(text);
    for (let i = 0; i < tokens.length && i < maxLen; i++) {
        tensor[i] = wordIndex[tokens[i]] || 0;
    }
    return tensor;
}

let model;

async function trainModel() {
    model = tf.sequential();
    model.add(tf.layers.embedding({inputDim: index, outputDim: 16, inputLength: 20}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 128, activation: 'relu'}));
    model.add(tf.layers.dense({units: 64, activation: 'relu'}));
    model.add(tf.layers.dense({units: trainingData.length, activation: 'softmax'}));
    model.compile({optimizer: 'adam', loss: 'categoricalCrossentropy'});

    const xs = tf.tensor2d(trainingData.map(d => textToTensor(d.input)));
    const ys = tf.tensor2d(trainingData.map((_, i) => {
        const arr = new Float32Array(trainingData.length);
        arr[i] = 1;
        return arr;
    }));

    await model.fit(xs, ys, {epochs: 200});
}

async function getResponse() {
    if (!model) {
        await trainModel();
    }

    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    addMessage('Nancy', userInput, "User");

    const inputTensor = tf.tensor2d([textToTensor(userInput)]);
    const prediction = model.predict(inputTensor);
    const index = prediction.argMax(1).dataSync()[0];
    const response = trainingData[index] ? trainingData[index].output : improvisations[Math.floor(Math.random() * improvisations.length)];

    addMessage('bot', response, "KinglyShade");
}

function addMessage(sender, text, name) {
    const chatMessages = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const img = document.createElement('img');
    img.src = sender === 'bot' ? './img/help/loginicial.png' : './img/help/userft.png';
    img.alt = sender === 'bot' ? 'Bot' : 'Usuario';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerHTML = `<strong>${name}:</strong> ${text}`;

    messageDiv.appendChild(img);
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function updateModel(newInput, newOutput) {
    trainingData.push({input: newInput, output: newOutput});
    const tokens = preprocessText(newInput);
    tokens.forEach(token => {
        if (!wordIndex[token]) {
            wordIndex[token] = index;
            index++;
        }
    });
    await trainModel();
}

// Entrena el modelo al cargar la página
trainModel();
