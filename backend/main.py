from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
import json
from dotenv import load_dotenv

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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

try:
    with open("cases.json", "r") as f:
        historical_cases = json.load(f)
except FileNotFoundError:
    historical_cases = []

vectorizer = TfidfVectorizer()
tfidf_matrix = None
if historical_cases:
    case_symptoms = [case["symptoms"] for case in historical_cases]
    tfidf_matrix = vectorizer.fit_transform(case_symptoms)

@app.post("/analyze")
def analyze_symptoms(data: SymptomInput):
    best_score = 0
    best_match = None
    
    if tfidf_matrix is not None:
        query_vec = vectorizer.transform([data.symptoms])
        similarities = cosine_similarity(query_vec, tfidf_matrix)[0]
        
        best_match_idx = similarities.argmax()
        best_score = similarities[best_match_idx]
        best_match = historical_cases[best_match_idx]

    THRESHOLD = 0.65
    
    if best_score >= THRESHOLD:
        return {
            "status_case": "Similar Case Found (Database)",
            "possible_root_cause": best_match["root_cause"],
            "confidence": best_match["confidence"],
            "recommendations": [best_match["solution"], "Cek riwayat maintenance mesin ini"]
        }
    else:
        prompt = f"""
        Anda adalah LegacyMind AI, asisten pemeliharaan mesin industri.
        Tidak ada kasus serupa di database. Analisis gejala baru pada mesin {data.machine_type}: "{data.symptoms}"
        
        Keluarkan HANYA hasil dalam format JSON persis seperti ini:
        {{
            "status_case": "Reasoning AI Activated (New Case)",
            "possible_root_cause": "Penjelasan singkat",
            "confidence": 65, 
            "recommendations": ["Saran 1", "Saran 2"]
        }}
        """
        
        try:
            chat_completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.1-8b-instant",
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            return json.loads(chat_completion.choices[0].message.content)
        except Exception as e:
            return {"error": str(e)}
        
class ValidationInput(BaseModel):
    symptoms: str
    root_cause: str
    recommendations: list

@app.post("/validate")
def validate_new_case(data: ValidationInput):
    global historical_cases, tfidf_matrix, vectorizer
    
    try:
        with open("cases.json", "r") as f:
            cases = json.load(f)
    except:
        cases = []
        
    new_id = f"C{(len(cases) + 1):03d}"
    
    new_case = {
        "id": new_id,
        "symptoms": data.symptoms,
        "root_cause": data.root_cause,
        "solution": " ".join(data.recommendations),
        "confidence": 100
    }
    
    cases.append(new_case)
    with open("cases.json", "w") as f:
        json.dump(cases, f, indent=4)
        
    historical_cases = cases
    case_symptoms = [c["symptoms"] for c in historical_cases]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(case_symptoms)
    
    return {"message": "Knowledge Graph berhasil di-update! Sistem telah mempelajari kasus ini."}