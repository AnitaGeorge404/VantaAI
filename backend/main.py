from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import vision
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "vantaai-5adcbf498def.json"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = vision.ImageAnnotatorClient()

@app.post("/web-detect/")
async def web_detect(file: UploadFile = File(...)):
    contents = await file.read()
    image = vision.Image(content=contents)
    response = client.web_detection(image=image)
    annotations = response.web_detection

    # Handle None fields safely
    full_matches = annotations.pages_with_matching_images if annotations.pages_with_matching_images else []
    partial_matches = annotations.partial_matching_images if annotations.partial_matching_images else []
    similar_images = annotations.visually_similar_images if annotations.visually_similar_images else []

    return {
        "fullMatches": [page.url for page in full_matches],
        "partialMatches": [page.url for page in partial_matches],
        "visuallySimilarImages": [img.url for img in similar_images],
    }

