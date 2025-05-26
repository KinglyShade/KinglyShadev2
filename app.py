from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from diffusers import StableDiffusionPipeline
from compel import Compel
from PIL import Image
import torch
import uuid
import os

app = Flask(__name__)
CORS(app)

# Configurar modelo
model_id = "runwayml/stable-diffusion-v1-5"
device = "cuda" if torch.cuda.is_available() else "cpu"
dtype = torch.float16 if device == "cuda" else torch.float32

pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=dtype,
    use_safetensors=True,
    low_cpu_mem_usage=True
).to(device)

pipe.safety_checker = lambda images, **kwargs: (images, [False] * len(images))
compel_proc = Compel(tokenizer=pipe.tokenizer, text_encoder=pipe.text_encoder)

os.makedirs("static", exist_ok=True)

@app.route("/generate", methods=["POST"])
def generate():
    prompt = request.json.get("prompt", "")
    negative_prompt = "blurry, low quality, bad anatomy, unrealistic, watermark, distorted, text"

    prompt_embeds = compel_proc(prompt)
    negative_embeds = compel_proc(negative_prompt)

    with torch.autocast(device):
        image = pipe(prompt_embeds=prompt_embeds, negative_prompt_embeds=negative_embeds, guidance_scale=8.5).images[0]

    filename = f"{uuid.uuid4().hex}.png"
    filepath = os.path.join("static", filename)
    image.save(filepath)

    return jsonify({"image_url": f"/static/{filename}"})


@app.route("/static/<path:filename>")
def serve_image(filename):
    return send_from_directory("static", filename)


if __name__ == "__main__":
    app.run(debug=True)
