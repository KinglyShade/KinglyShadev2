let wordIndex = {};
let intents = {};
let model;

// Función para cargar el archivo JSON de intents
function loadIntents() {
    return fetch('intents.json')
        .then(response => response.json())
        .then(data => {
            intents = data;
            console.log("Intents cargados con éxito", intents); // Verifica la estructura de intents
            wordIndex = loadWordIndex(); // Carga el wordIndex después de cargar los intents
        })
        .catch(error => console.error("Error al cargar los intents:", error));
}

// Función para cargar el archivo JSON del wordIndex
function loadWordIndex() {
    let wordIndex = {};
    let index = 1;

    // Asegúrate de que intents tenga la propiedad 'intents' que es un array
    if (intents && intents.intents && Array.isArray(intents.intents)) {
        intents.intents.forEach(intent => {
            intent.patterns.forEach(pattern => {
                // Tokenizamos el patrón en palabras individuales
                let words = pattern.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
                // Añadimos las palabras al wordIndex si no existen aún
                words.forEach(word => {
                    if (!wordIndex[word] && word !== '') {
                        wordIndex[word] = index++;
                    }
                });
            });
        });
    } else {
        console.error("La propiedad 'intents' no es un array o no existe", intents);
    }

    return wordIndex;
}

// Función para cargar el modelo TensorFlow
async function loadModel() {
    try {
        const model = await tf.loadLayersModel('model2/model.json');
        console.log('Modelo cargado con éxito');
        return model;
    } catch (error) {
        console.error('Error al cargar el modelo:', error);
    }
}



// Cargar ambos archivos y el modelo al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    await loadIntents();
    await loadModel();
});

// Función para preprocesar el texto antes de usar el modelo
function preprocesarTexto(texto) {
    return texto.toLowerCase().replace(/[^\w\s]/g, '').split(' ');
}

// Convertir el texto en un tensor utilizando el wordIndex
function textoATensor(texto) {
    const maxLen = 46; // Asegúrate de que esto coincida con tu inputShape
    const tensor = new Float32Array(maxLen);
    const tokens = preprocesarTexto(texto);
    
    for (let i = 0; i < tokens.length && i < maxLen; i++) {
        tensor[i] = wordIndex[tokens[i]] || 0;  // Asignar 0 si la palabra no está en el wordIndex
    }
    
    return tensor;
}

// Función para seleccionar una respuesta, priorizando las sarcásticas
function selectResponse(intent, type = 'sarcastic') {
    let responses = [];

    if (type === 'sarcastic' && intent.sarcastic_responses.length > 0) {
        responses = intent.sarcastic_responses;
    } else if (type === 'timid' && intent.timid_responses.length > 0) {
        responses = intent.timid_responses;
    } else {
        responses = intent.responses;  // Usamos las respuestas estándar si no hay otras
    }

    // Devolver una respuesta aleatoria
    return responses[Math.floor(Math.random() * responses.length)];
}

// Función para manejar la entrada del usuario
function handleUserInput(userInput) {
    // Normalizar la entrada del usuario
    let input = userInput.toLowerCase();

    // Recorrer las intenciones para encontrar un patrón que coincida
    for (let intent of intents.intents) {
        for (let pattern of intent.patterns) {
            if (input.includes(pattern.toLowerCase())) {
                // Si coincide con un patrón, decidimos la respuesta (80% sarcástica, 20% tímida)
                let responseType = Math.random() < 0.8 ? 'sarcastic' : 'timid';
                return selectResponse(intent, responseType);
            }
        }
    }

    // Si no se encuentra una intención, devolver una respuesta genérica
    return "No estoy seguro de cómo responder a eso.";
}

// Función para generar la respuesta basada en la entrada
// Función para generar la respuesta basada en la entrada
async function getResponse() {
    const userInput = document.getElementById('user-input').value;
    document.getElementById('user-input').value = "";  // Limpiar la entrada
    if (!userInput) return;

    // Añadir el mensaje del usuario al chat
    addMessage('user', userInput);

    // Verificar si el modelo está definido
    if (!model) {
        console.error("Modelo no cargado, no se puede predecir.");
        addMessage('bot', "Lo siento, el modelo no está listo para responder.");
        return;
    }

    // Convertir el texto en un tensor para hacer la predicción
    const inputTensor = tf.tensor2d([textoATensor(userInput)], [1, 46], 'float32'); // Asegúrate de que el tipo de datos sea float32

    try {
        const prediction = model.predict(inputTensor);
        const index = prediction.argMax(1).dataSync()[0];

        // Obtener la respuesta de las intenciones o del modelo
        const response = handleUserInput(userInput);
        
        // Añadir la respuesta del bot al chat
        addMessage('bot', response);
    } catch (error) {
        console.error("Error durante la predicción:", error);
        addMessage('bot', "Ocurrió un error al procesar tu solicitud.");
    }
}


// Función para añadir mensajes al chat
function addMessage(sender, text, image = 'neutral.png') {
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

    // Desplazar el chat hacia abajo para mostrar el nuevo mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
