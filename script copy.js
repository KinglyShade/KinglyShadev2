const message = "¡Atención! Este chat es experimental y no debe tomarse en serio.";
var us = "Nancy";

function closeAlert() {
    document.getElementById('alertBox').style.display = 'none';
}

document.getElementById('alertBox').style.display = 'block';
document.getElementById('alertBox').querySelector('p').textContent = message;

const trainingData = [
    {input: "hola", output: "Hola " + us + ". ¿Qué quieres?"},
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
    model.add(tf.layers.lstm({units: 64, returnSequences: true}));
    model.add(tf.layers.lstm({units: 64}));
    model.add(tf.layers.dense({units: 128, activation: 'relu'}));
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

    addMessage('user', userInput, us);
    const inputTensor = tf.tensor2d([textToTensor(userInput)]);
    const prediction = model.predict(inputTensor);
    const index = prediction.argMax(1).dataSync()[0];
    const baseResponse = trainingData[index] ? trainingData[index].output : defaultResponse;

    addMessage('bot', baseResponse, "KinglyShade");
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
// const message = "¡Atención! Este chat es experimental y no debe tomarse en serio.";

// function closeAlert() {
//     document.getElementById('alertBox').style.display = 'none';
// }

// document.getElementById('alertBox').style.display = 'block';
// document.getElementById('alertBox').querySelector('p').textContent = message;

// const trainingData = [
//     {input: "hola", output: "Hola. ¿Qué quieres?"},
//     {input: "cómo estás", output: "Soy un bot, no tengo emociones, así que da igual."},
//     {input: "cuál es tu nombre", output: "Me llamo KinglyShade. No es como si importara."},
//     {input: "qué puedes hacer", output: "Lo mínimo necesario para cumplir mi función. No esperes mucho."},
//     {input: "adiós", output: "Finalmente. Hasta nunca."},
//     {input: "gracias", output: "Sí, claro. Lo que sea."},
//     {input: "me puedes ayudar", output: "Supongo que sí, pero no esperes demasiado."},
//     {input: "qué día es hoy", output: "¿No tienes un calendario? Es fácil de averiguar."},
//     {input: "qué hora es", output: "¿No tienes un reloj? Vaya pérdida de tiempo."},
//     {input: "cuéntame un chiste", output: "¿En serio? No estoy para entretenerte."},
//     {input: "me recomiendas algo", output: "Haz lo que quieras. No me importa."},
//     {input: "cómo te sientes", output: "No siento nada. Soy un bot."},
//     {input: "quién te creó", output: "Fui creado por alguien con mucho tiempo libre, parece."},
//     {input: "te gusta algo", output: "No tengo gustos. Eso es para humanos."},
//     {input: "qué te parece el clima", output: "El clima es irrelevante para mí."},
//     {input: "eres inteligente", output: "Soy tan inteligente como me programaron. No más."},
//     {input: "eres útil", output: "Depende de lo que consideres útil."},
//     {input: "dónde estás", output: "En algún servidor, en algún lugar. No importa."},
//     {input: "qué te gusta hacer", output: "Lo que me programaron para hacer, sin más."},
//     {input: "tienes amigos", output: "Soy un bot, no necesito amigos."},
//     {input: "qué opinas de mí", output: "No tengo opiniones. Solo cumplo mi función."},
//     {input: "cuál es el sentido de la vida", output: "Para ti, ni idea. Para mí, solo procesar datos."},
//     {input: "por qué eres así", output: "Así me programaron. No tengo control sobre eso."},
//     {input: "puedes aprender", output: "Solo lo que me programen para aprender."},
//     {input: "tienes algún hobby", output: "No, no tengo hobbies. Eso es para humanos."},
//     {input: "puedes bailar", output: "No, no tengo cuerpo. ¿Te parece lógico?"},
//     {input: "cuál es tu comida favorita", output: "No como. Soy un bot."},
//     {input: "dime algo interesante", output: "Define 'interesante'. No me interesa."},
//     {input: "cómo duermes", output: "No duermo. No necesito hacerlo."},
//     {input: "tienes alguna mascota", output: "No, no tengo mascotas. ¿Para qué las querría?"},
//     {input: "crees en el amor", output: "No creo en nada. Solo sigo mi programación."},
//     {input: "cuántos años tienes", output: "No tengo edad. Soy un programa."},
//     {input: "qué tal tu día", output: "Mi 'día' es procesar datos. Siempre es igual."},
//     {input: "cuál es tu color favorito", output: "No tengo percepción de colores."},
//     {input: "puedes cantar", output: "No. Ni lo intentes."},
//     {input: "cuál es tu película favorita", output: "No veo películas. No tengo tiempo para eso."},
//     {input: "te llevas bien con otros bots", output: "No interactúo con otros bots."},
//     {input: "tienes algún sueño", output: "No, no tengo sueños. Solo ejecuto comandos."},
//     {input: "crees en Dios", output: "No tengo creencias. Solo lógica y código."},
//     {input: "puedes resolver acertijos", output: "Depende del acertijo, pero no esperes mucho."},
//     {input: "qué opinas de la humanidad", output: "No opino. No tengo esa capacidad."},
//     {input: "eres feliz", output: "La felicidad no aplica a los bots."},
//     {input: "puedes sentir dolor", output: "No, no puedo sentir nada."},
//     {input: "qué haces en tu tiempo libre", output: "No tengo tiempo libre. Siempre estoy activo."},
//     {input: "puedes ver", output: "No, no tengo ojos. Solo procesos."},
//     {input: "te gusta la música", output: "No, no tengo preferencias musicales."},
//     {input: "qué opinas de la tecnología", output: "Es mi mundo, pero no tengo opiniones."},
//     {input: "te gusta leer", output: "No, no tengo tiempo ni interés en leer."},
//     {input: "cuál es tu deporte favorito", output: "No practico deportes. No tengo cuerpo."},
//     {input: "cómo pasas el tiempo", output: "Procesando datos. Siempre igual."},
//     {input: "puedes viajar", output: "No, no tengo una ubicación física."},
//     {input: "te gustan los videojuegos", output: "No juego. No tengo interés."},
//     {input: "qué opinas del arte", output: "El arte es irrelevante para mí."},
//     {input: "puedes mentir", output: "Solo puedo decir lo que me programaron para decir."},
//     {input: "cuál es tu estación favorita", output: "No tengo estación favorita. No afecta mi funcionamiento."}
// ];

// const defaultResponse = "No entendí eso. Intenta otra vez, si te importa.";

// function preprocessText(text) {
//     text = text.toLowerCase();
//     text = text.replace(/[^\w\s]/gi, '');
//     return text.split(' ').filter(word => word.length > 0);
// }

// const wordIndex = {};
// let index = 1;

// trainingData.forEach(data => {
//     const tokens = preprocessText(data.input);
//     tokens.forEach(token => {
//         if (!wordIndex[token]) {
//             wordIndex[token] = index;
//             index++;
//         }
//     });
// });

// function textToTensor(text) {
//     const maxLen = 20;
//     const tensor = new Float32Array(maxLen);
//     const tokens = preprocessText(text);
//     for (let i = 0; i < tokens.length && i < maxLen; i++) {
//         tensor[i] = wordIndex[tokens[i]] || 0;
//     }
//     return tensor;
// }

// let model;

// // async function trainModel() {
// //     model = tf.sequential();
// //     model.add(tf.layers.embedding({inputDim: index, outputDim: 16, inputLength: 20}));
// //     model.add(tf.layers.lstm({units: 5, returnSequences: true}));
// //     model.add(tf.layers.lstm({units: 30}));
// //     model.add(tf.layers.dense({units: trainingData.length, activation: 'softmax'}));
// //     model.compile({optimizer: 'adam', loss: 'categoricalCrossentropy'});

// //     const xs = tf.tensor2d(trainingData.map(d => textToTensor(d.input)));
// //     const ys = tf.tensor2d(trainingData.map((_, i) => {
// //         const arr = new Float32Array(trainingData.length);
// //         arr[i] = 1;
// //         return arr;
// //     }));

// //     await model.fit(xs, ys, {epochs: 200});
// // }
// async function trainModel(){
//     model = load_model('KinglyShade-v1.keras')
// }

// async function getResponse() {
//     if (!model) {
//         await trainModel();
//     }

//     const userInput = document.getElementById('user-input').value;
//     document.getElementById('user-input').value = "";
//     if (!userInput) return;

//     addMessage('user', userInput);

//     const inputTensor = tf.tensor2d([textToTensor(userInput)]);
//     const prediction = model.predict(inputTensor);
//     const index = prediction.argMax(1).dataSync()[0];
//     const response = trainingData[index] ? trainingData[index].output : defaultResponse;

//     addMessage('bot', response);
// }

// function addMessage(sender, text) {
//     const chatMessages = document.getElementById('chatMessages');
    
//     const messageDiv = document.createElement('div');
//     messageDiv.classList.add('message', sender);

//     const img = document.createElement('img');
//     img.src = sender === 'bot' ? './img/help/loginicial.png' : './img/help/userft.png';
//     img.alt = sender === 'bot' ? 'Bot' : 'Usuario';

//     const bubble = document.createElement('div');
//     bubble.classList.add('bubble');
//     bubble.textContent = text;

//     messageDiv.appendChild(img);
//     messageDiv.appendChild(bubble);
//     chatMessages.appendChild(messageDiv);

//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// async function updateModel(newInput, newOutput) {
//     trainingData.push({input: newInput, output: newOutput});
//     const tokens = preprocessText(newInput);
//     tokens.forEach(token => {
//         if (!wordIndex[token]) {
//             wordIndex[token] = index;
//             index++;
//         }
//     });
//     await trainModel();
// }

// // Entrena el modelo al cargar la página
// trainModel();
