from fastapi import FastAPI, UploadFile, File, Form
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

app = FastAPI(title="Tanya SEPUH API")

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
        Anda adalah Tanya SEPUH AI, asisten pemeliharaan mesin industri.
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

@app.get("/api/dashboard")
def get_dashboard():
    return {
        "stats": {
            "normal": 3,
            "warning": 1,
            "critical": 1,
            "efficiency": 98
        },
        "recent_alerts": [
            {"id": 1, "machine": "Machine E", "message": "Motor mencapai 92°C", "time": "09:22", "type": "critical"},
            {"id": 2, "machine": "Machine C", "message": "Vibration meningkat", "time": "09:18", "type": "warning"}
        ],
        "system_status": {
            "api": "Online",
            "ai_engine": "Running",
            "database": "Connected"
        }
    }

@app.get("/api/knowledge")
def get_knowledge_list():
    return [
        {"id": 1, "knowledge": "Motor Overheating", "category": "Motor & Cooling System", "created": "20 Jul 2026", "confidence": 94, "status": "Active"},
        {"id": 2, "knowledge": "Excessive Machine Vibration", "category": "Machine Vibration", "created": "18 Jul 2026", "confidence": 91, "status": "Active"}
    ]

@app.post("/api/upload")
def upload_dataset(file: UploadFile = File(...)):
    return {"filename": file.filename, "message": "File berhasil diunggah dan sedang diproses oleh AI."}

@app.post("/api/knowledge/upload-interview")
def upload_interview(title: str = Form(...), file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "title": title,
        "message": "Interview berhasil diunggah dan sedang diproses oleh pipeline Speech-to-Text."
    }

@app.get("/api/machines")
def get_machines():
    return [
        {"id": "M1", "name": "Machine A", "type": "Conveyor", "line": "Production Line A", "status": "Healthy", "temp": "45°C", "health": 98},
        {"id": "M2", "name": "Machine B", "type": "Packaging", "line": "Production Line A", "status": "Healthy", "temp": "47°C", "health": 96},
        {"id": "M3", "name": "Machine C", "type": "Filling", "line": "Production Line B", "status": "Warning", "temp": "69°C", "health": 74},
        {"id": "M4", "name": "Machine D", "type": "Sealing", "line": "Production Line B", "status": "Healthy", "temp": "43°C", "health": 99},
        {"id": "M5", "name": "Machine E", "type": "Labeling", "line": "Production Line C", "status": "Critical", "temp": "92°C", "health": 21}
    ]

@app.get("/api/users")
def get_users():
    return [
        {"id": 1, "name": "Administrator", "email": "admin@legacymind.ai", "role": "Admin", "status": "Active"},
        {"id": 2, "name": "Operator 1", "email": "operator@legacymind.ai", "role": "Operator", "status": "Active"}
    ]