# main1.py

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import vision
import os

# Set your service account key file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "vantaai-50fae3d7726c.json"

app = FastAPI()

# Allow frontend (React) to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, use specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/web-detect/")
async def web_detect(file: UploadFile = File(...)):
    contents = await file.read()
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=contents)
    response = client.web_detection(image=image)
    annotations = response.web_detection

    return {
        "fullMatches": [page.url for page in annotations.pages_with_matching_images],
        "partialMatches": [page.url for page in annotations.partial_matching_images],
        "visuallySimilarImages": [img.url for img in annotations.visually_similar_images],
    }




