import tensorflow as tf
import numpy as np
import os
import matplotlib.pyplot as plt

# Datos de entrenamiento
training_data = [
    {"input": "hola", "output": "Hola Nancy. ¿Qué quieres?"},
    {"input": "cómo estás", "output": "Soy un bot, no tengo emociones, así que da igual."},
    # Agrega más datos de entrenamiento aquí
]

def preprocess_text(text):
    text = text.lower()
    text = ''.join([c for c in text if c.isalnum() or c.isspace()])
    return text.split()

word_index = {}
index = 1

for data in training_data:
    tokens = preprocess_text(data['input'])
    for token in tokens:
        if token not in word_index:
            word_index[token] = index
            index += 1

def text_to_tensor(text):
    max_len = 20
    tensor = np.zeros(max_len)
    tokens = preprocess_text(text)
    for i, token in enumerate(tokens):
        if i < max_len:
            tensor[i] = word_index.get(token, 0)
    return tensor

# Preparar los datos para el entrenamiento
xs = np.array([text_to_tensor(d['input']) for d in training_data])
ys = tf.keras.utils.to_categorical(np.arange(len(training_data)), num_classes=len(training_data))

# Crear el modelo
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=index, output_dim=16, input_length=20),
    tf.keras.layers.LSTM(64, return_sequences=True),
    tf.keras.layers.LSTM(64),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(len(training_data), activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Entrenar el modelo y guardar el historial de entrenamiento
history = model.fit(xs, ys, epochs=200)

model.save('KinglyShade-v1.keras')

# Graficar todas las métricas disponibles
def plot_metrics(history):
    metrics = history.history.keys()
    for metric in metrics:
        plt.plot(history.history[metric])
        plt.title(f'{metric} durante el entrenamiento')
        plt.xlabel('Época')
        plt.ylabel(metric.capitalize())
        plt.show()

plot_metrics(history)
