from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import openai
import tempfile
import os
import asyncio
import edge_tts
from utils import detect_language, LANGUAGE_CODES
from voices import VOICE_MAP
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = "your_openai_api_key"

app.mount("/", StaticFiles(directory="/tmp", html=True), name="static")

@app.post("/api/speech-to-speech/")
async def speech_to_speech(audio: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await audio.read())
        audio_path = tmp.name

    with open(audio_path, "rb") as f:
        transcript = openai.Audio.transcribe("whisper-1", f)

    user_text = transcript["text"]

    lang_code = detect_language(user_text)
    voice = VOICE_MAP.get(lang_code, VOICE_MAP["en"])
    language = LANGUAGE_CODES.get(lang_code, "en-US")

    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"You are a helpful assistant. Reply in the user's language ({language})."},
            {"role": "user", "content": user_text}
        ]
    )
    reply_text = completion['choices'][0]['message']['content']

    mp3_path = audio_path.replace(".wav", "_reply.mp3")
    communicate = edge_tts.Communicate(reply_text, voice=voice)
    await communicate.save(mp3_path)

    return {
        "detected_language": lang_code,
        "transcription": user_text,
        "reply_text": reply_text,
        "voice_used": voice,
        "audio_file": os.path.basename(mp3_path)
    }
