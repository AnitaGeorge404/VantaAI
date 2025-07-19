from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoImageProcessor, SiglipForImageClassification
from PIL import Image
import io
import torch
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vanta-ai-eight.vercel.app","http://localhost:5173"],  # Change to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load deepfake detection model
model_name = "prithivMLmods/deepfake-detector-model-v1"
model = SiglipForImageClassification.from_pretrained(model_name)
processor = AutoImageProcessor.from_pretrained(model_name)

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1).squeeze().tolist()

    is_deepfake = probs[0] > probs[1]
    confidence = max(probs)

    return {
        "isDeepfake": is_deepfake,
        "confidence": round(confidence, 3),
        "details": "Deepfake detected with high probability." if is_deepfake else "Image appears to be authentic."
    }



      