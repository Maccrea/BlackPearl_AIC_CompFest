from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="LegacyMind AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomInput(BaseModel):
    symptoms: str
    machine_type: str = "General"

@app.get("/")
def read_root():
    return {"status": "ok", "message": "LegacyMind AI Backend is running!"}

@app.post("/analyze")
def analyze_symptoms(data: SymptomInput):
    
    return {
        "status_case": "Mock Case Found",
        "possible_root_cause": f"Analisis awal untuk gejala: {data.symptoms}",
        "confidence": 75,
        "recommendations": ["Periksa sensor suhu", "Cek pelumas komponen"]
    }