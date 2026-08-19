from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from groq import Groq
import os
import json
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from supabase import create_client, Client
import shutil
import pandas as pd
import io

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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

class ValidationInput(BaseModel):
    symptoms: str
    root_cause: str
    recommendations: list

class ManualKnowledgeInput(BaseModel):
    title: str
    category: str
    machine_type: str
    root_cause: str
    symptoms: list
    solutions: list
    tags: str

class MachineInput(BaseModel):
    id: str
    name: str
    type: str
    line: str
    status: str
    temp: str
    health: int
    rpm: Optional[str] = None
    current: Optional[str] = None
    vibration: Optional[str] = None

class UserInput(BaseModel):
    id: str
    name: str
    email: str
    role: str
    status: str

class CaseItem(BaseModel):
    title: str
    category: str
    symptoms: str
    root_cause: str
    solution: str
    confidence: int
    status: str

class SaveKnowledgeInput(BaseModel):
    cases: list[CaseItem]

def get_knowledge_base():
    try:
        response = supabase.table("knowledge_cases").select("*").execute()
        cases = response.data
        if not cases:
            return [], None, None
            
        vectorizer = TfidfVectorizer()
        case_symptoms = [c["symptoms"] for c in cases]
        tfidf_matrix = vectorizer.fit_transform(case_symptoms)
        return cases, vectorizer, tfidf_matrix
    except Exception as e:
        return [], None, None

@app.post("/analyze")
def analyze_symptoms(data: SymptomInput):
    historical_cases, vectorizer, tfidf_matrix = get_knowledge_base()
    
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
            "possible_root_cause": best_match.get("root_cause", ""),
            "confidence": best_match.get("confidence", 100),
            "recommendations": [best_match.get("solution", ""), "Cek riwayat maintenance mesin ini"]
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
                model="openai/gpt-oss-20b",
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            return json.loads(chat_completion.choices[0].message.content)
        except Exception as e:
            return {"error": str(e)}

@app.post("/validate")
def validate_new_case(data: ValidationInput):
    try:
        new_case = {
            "title": f"New Case: {data.machine_type}" if hasattr(data, 'machine_type') else "New Identified Issue",
            "category": "General Troubleshooting",
            "status": "Active",
            "symptoms": data.symptoms,
            "root_cause": data.root_cause,
            "solution": " ".join(data.recommendations),
            "confidence": 100
        }
        
        supabase.table("knowledge_cases").insert(new_case).execute()
        return {"message": "Knowledge Graph berhasil di-update ke Supabase! Sistem telah mempelajari kasus ini."}
    except Exception as e:
        return {"error": f"Gagal menyimpan ke database: {str(e)}"}

@app.get("/api/dashboard")
def get_dashboard():
    db_status = "Disconnected"
    try:
        supabase.table("knowledge_cases").select("id").limit(1).execute()
        db_status = "Connected"
    except Exception:
        db_status = "Error/Disconnected"

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
            "database": db_status
        }
    }

@app.get("/api/knowledge")
def get_knowledge_list():
    try:
        response = supabase.table("knowledge_cases").select("id, title, category, created_at, confidence, status").execute()
        
        formatted_data = []
        for item in response.data:
            item["created"] = item.pop("created_at", "N/A")[:10]
            formatted_data.append(item)
            
        return formatted_data
    except Exception as e:
        return []

@app.get("/api/knowledge/{knowledge_id}")
def get_knowledge_detail(knowledge_id: str):
    try:
        response = supabase.table("knowledge_cases").select("*").eq("id", knowledge_id).execute()
        if response.data:
            data = response.data[0]
            data["prediction"] = data.get("title", "")
            data["created"] = data.pop("created_at", "N/A")[:10]
            
            if isinstance(data.get("symptoms"), str):
                data["symptoms"] = [data["symptoms"]]
            if isinstance(data.get("solution"), str):
                data["recommendation"] = [data["solution"]]
                
            return data
        return {"error": "Knowledge not found"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/upload")
async def upload_dataset(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        filename = file.filename.lower()
        
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(contents))
        elif filename.endswith(".json"):
            df = pd.read_json(io.BytesIO(contents))
        else:
            return {"error": "Format file tidak didukung"}

        data_sample = df.head(10).to_json(orient="records")

        prompt = f"""
        Anda adalah AI Engineer Assistant. Ekstrak data mentah berikut menjadi BEBERAPA kasus masalah mesin industri.
        Data: {data_sample}
        
        Keluarkan HANYA hasil dalam format JSON persis seperti ini:
        {{
            "cases": [
                {{
                    "title": "Nama Spesifik Masalah 1",
                    "category": "General Troubleshooting",
                    "symptoms": "Gejala 1",
                    "root_cause": "Akar masalah utama 1",
                    "solution": "Saran perbaikan 1",
                    "confidence": 90,
                    "status": "Active"
                }},
                {{
                    "title": "Nama Spesifik Masalah 2",
                    "category": "General Troubleshooting",
                    "symptoms": "Gejala 2",
                    "root_cause": "Akar masalah utama 2",
                    "solution": "Saran perbaikan 2",
                    "confidence": 85,
                    "status": "Active"
                }}
            ]
        }}
        """
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-20b",
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        extracted_data = json.loads(chat_completion.choices[0].message.content)
        cases_to_insert = extracted_data.get("cases", [])
        
        if cases_to_insert:
            return {
                "filename": file.filename, 
                "message": f"{len(cases_to_insert)} kasus berhasil diekstrak AI. Menunggu konfirmasi Anda.",
                "extracted_cases": cases_to_insert
            }
        else:
            return {"error": "AI gagal mengekstrak data menjadi kasus."}
            
    except Exception as e:
        return {"error": f"Gagal memproses file: {str(e)}"}

@app.post("/api/save-knowledge")
def save_extracted_knowledge(data: SaveKnowledgeInput):
    try:
        cases_dict = [case.dict() for case in data.cases]
        supabase.table("knowledge_cases").insert(cases_dict).execute()
        return {"message": f"{len(cases_dict)} kasus berhasil dikonfirmasi dan disimpan ke Knowledge Base!"}
    except Exception as e:
        return {"error": f"Gagal menyimpan ke database: {str(e)}"}

@app.post("/api/knowledge/upload-interview")
async def upload_interview(title: str = Form(...), file: UploadFile = File(...)):
    try:
        temp_file_path = f"/tmp/temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        with open(temp_file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
              file=(temp_file_path, audio_file.read()),
              model="whisper-large-v3"
            )
        
        transcript_text = transcription.text
        os.remove(temp_file_path)

        prompt = f"""
        Anda adalah AI Engineer Assistant. Ekstrak transkrip wawancara berikut menjadi BEBERAPA kasus SOP diagnosis mesin (pisahkan jika ada lebih dari satu masalah yang dibahas).
        Transkrip: "{transcript_text}"
        
        Keluarkan HANYA hasil dalam format JSON persis seperti ini:
        {{
            "cases": [
                {{
                    "title": "{title} - [Nama Masalah 1]",
                    "category": "Interview Extraction",
                    "symptoms": "Gejala yang disebutkan",
                    "root_cause": "Akar masalah yang dibahas",
                    "solution": "Tindakan yang disarankan teknisi",
                    "confidence": 95,
                    "status": "Active"
                }},
                {{
                    "title": "{title} - [Nama Masalah 2]",
                    "category": "Interview Extraction",
                    "symptoms": "Gejala 2",
                    "root_cause": "Akar masalah 2",
                    "solution": "Tindakan perbaikan 2",
                    "confidence": 90,
                    "status": "Active"
                }}
            ]
        }}
        """
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-20b",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        extracted_data = json.loads(chat_completion.choices[0].message.content)
        cases_to_insert = extracted_data.get("cases", [])
        
        if cases_to_insert:
            return {
                "filename": file.filename,
                "title": title,
                "message": f"{len(cases_to_insert)} masalah terdeteksi dari interview. Menunggu konfirmasi Anda.",
                "extracted_cases": cases_to_insert
            }
        else:
            return {"error": "AI gagal mengekstrak kasus dari interview."}
            
    except Exception as e:
        return {"error": f"Gagal memproses interview: {str(e)}"}

@app.post("/api/knowledge/manual")
def upload_manual_knowledge(data: ManualKnowledgeInput):
    try:
        symptoms_text = " | ".join(data.symptoms)
        solutions_text = " | ".join(data.solutions)
        
        new_case = {
            "title": data.title,
            "category": data.category,
            "status": "Active",
            "symptoms": symptoms_text,
            "root_cause": data.root_cause,
            "solution": solutions_text,
            "confidence": 100
        }
        
        supabase.table("knowledge_cases").insert(new_case).execute()
        return {"message": "Knowledge manual berhasil disimpan!"}
    except Exception as e:
        return {"error": f"Gagal menyimpan ke database: {str(e)}"}

@app.get("/api/machines")
def get_machines():
    res = supabase.table("machines").select("*").execute()
    return res.data

@app.post("/api/machines")
def add_machine(data: MachineInput):
    supabase.table("machines").insert(data.dict()).execute()
    return {"message": "Mesin berhasil ditambahkan"}

@app.put("/api/machines/{machine_id}")
def update_machine(machine_id: str, data: MachineInput):
    supabase.table("machines").update(data.dict()).eq("id", machine_id).execute()
    return {"message": "Data mesin diupdate"}

@app.delete("/api/machines/{machine_id}")
def delete_machine(machine_id: str):
    supabase.table("machines").delete().eq("id", machine_id).execute()
    return {"message": "Mesin dihapus"}

@app.get("/api/users")
def get_users():
    res = supabase.table("app_users").select("*").execute()
    return res.data

@app.post("/api/users")
def add_user(data: UserInput):
    supabase.table("app_users").insert(data.dict()).execute()
    return {"message": "User berhasil ditambahkan"}

@app.put("/api/users/{user_id}")
def update_user(user_id: str, data: UserInput):
    supabase.table("app_users").update(data.dict()).eq("id", user_id).execute()
    return {"message": "Data user diupdate"}

@app.delete("/api/users/{user_id}")
def delete_user(user_id: str):
    supabase.table("app_users").delete().eq("id", user_id).execute()
    return {"message": "User dihapus"}