from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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

@app.post("/analyze")
def analyze_symptoms(data: SymptomInput):
    prompt = f"""
    Anda adalah LegacyMind AI, asisten pemeliharaan mesin industri.
    Analisis gejala pada mesin {data.machine_type}: "{data.symptoms}"
    
    Keluarkan HANYA hasil dalam format JSON persis seperti ini:
    {{
        "status_case": "Reasoning AI Activated",
        "possible_root_cause": "Penjelasan singkat",
        "confidence": 85,
        "recommendations": ["Saran 1", "Saran 2"]
    }}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        return json.loads(chat_completion.choices[0].message.content)
    except Exception as e:
        return {"error": str(e)}