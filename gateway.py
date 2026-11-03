import asyncio
import os
import uuid
from pathlib import Path
import httpx
try:
    import boto3
except ImportError:
    boto3 = None
from fastapi import BackgroundTasks, FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="wiuuulab - Unified AI Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AUDIO_DIR = Path("audio_outputs")
AUDIO_DIR.mkdir(exist_ok=True)
app.mount("/audio", StaticFiles(directory=str(AUDIO_DIR)), name="audio")

SERVICES = {
    "styletts2": os.getenv("STYLETTS2_URL", "http://127.0.0.1:8001"),
    "seedvc": os.getenv("SEEDVC_URL", "http://127.0.0.1:8002"),
    "make-an-audio": os.getenv("MAKE_AN_AUDIO_URL", "http://127.0.0.1:8003"),
}

INDONESIAN_VOICES = {
    "alwi": "id-ID-ArdiNeural",
    "athalea": "id-ID-GadisNeural",
    "gadis": "id-ID-GadisNeural",
    "serena": "id-ID-GadisNeural",
    "naya": "id-ID-GadisNeural",
    "siti": "id-ID-GadisNeural",
    "alana": "id-ID-GadisNeural",
    "andi": "id-ID-ArdiNeural",
    "putra": "id-ID-ArdiNeural",
    "mahaputra": "id-ID-ArdiNeural",
    "ujang": "id-ID-ArdiNeural",
    "ardi": "id-ID-ArdiNeural",
    "baron": "id-ID-ArdiNeural",
    "horror": "id-ID-ArdiNeural",
}

GLOBAL_NEURAL_VOICES = {
    "andreas": "en-US-ChristopherNeural",
    "woman": "en-US-JennyNeural",
    "guy": "en-US-GuyNeural",
    "brian": "en-US-BrianNeural",
    "aria": "en-US-AriaNeural",
}

API_KEY = os.getenv("API_KEY", "12345")
S3_BUCKET = os.getenv("S3_BUCKET", "")
S3_PREFIX = os.getenv("S3_PREFIX", "wiuuulab-outputs")

def get_s3_client():
    if not (os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY")):
        return None

    client_kwargs = {"region_name": os.getenv("AWS_REGION", "us-east-1")}
    client_kwargs["aws_access_key_id"] = os.getenv("AWS_ACCESS_KEY_ID")
    client_kwargs["aws_secret_access_key"] = os.getenv("AWS_SECRET_ACCESS_KEY")
    if os.getenv("AWS_ENDPOINT_URL"):
        client_kwargs["endpoint_url"] = os.getenv("AWS_ENDPOINT_URL")

    try:
        return boto3.client("s3", **client_kwargs)
    except Exception:
        return None

s3_client = get_s3_client()
client = httpx.AsyncClient(timeout=300.0)

import re

INDONESIAN_SLANG_MAP = {
    r"\bbgt\b": "banget",
    r"\bbngt\b": "banget",
    r"\bgak\b": "nggak",
    r"\bga\b": "nggak",
    r"\bngga\b": "nggak",
    r"\bg\b": "nggak",
    r"\bklo\b": "kalau",
    r"\bkalo\b": "kalau",
    r"\byg\b": "yang",
    r"\bdgn\b": "dengan",
    r"\budh\b": "sudah",
    r"\budah\b": "sudah",
    r"\bsdh\b": "sudah",
    r"\bblm\b": "belum",
    r"\bbelom\b": "belum",
    r"\btp\b": "tapi",
    r"\btpi\b": "tapi",
    r"\bbeneran\b": "bener-bener",
    r"\bsantuy\b": "santai",
    r"\bgimana\b": "gimana",
    r"\blu\b": "kamu",
    r"\bgue\b": "aku",
    r"\bgw\b": "aku",
    r"\bnjir\b": "aduh",
    r"\banjir\b": "aduh",
    r"\bkrn\b": "karena",
    r"\bkarna\b": "karena",
    r"\bjd\b": "jadi",
    r"\bjgn\b": "jangan",
    r"\bkm\b": "kamu",
    r"\bsy\b": "saya",
}

# Formal EYD Indonesian Normalizer (for News, Official Documents, Presentations)
INDONESIAN_FORMAL_MAP = {
    r"\bgak\b": "tidak",
    r"\bga\b": "tidak",
    r"\bngga\b": "tidak",
    r"\bnggak\b": "tidak",
    r"\bg\b": "tidak",
    r"\budh\b": "sudah",
    r"\budah\b": "sudah",
    r"\bsdh\b": "sudah",
    r"\bklo\b": "kalau",
    r"\bkalo\b": "kalau",
    r"\byg\b": "yang",
    r"\bdgn\b": "dengan",
    r"\bblm\b": "belum",
    r"\bbelom\b": "belum",
    r"\btp\b": "tetapi",
    r"\btpi\b": "tetapi",
    r"\bkrn\b": "karena",
    r"\bkarna\b": "karena",
    r"\bbgt\b": "sangat",
    r"\bbngt\b": "sangat",
    r"\bbener\b": "benar",
    r"\bbeneran\b": "sungguh-sungguh",
    r"\baja\b": "saja",
    r"\baj\b": "saja",
    r"\bjd\b": "jadi",
    r"\bjgn\b": "jangan",
    r"\bkm\b": "Anda",
    r"\bsy\b": "saya",
    r"\btau\b": "tahu",
    r"\bbikin\b": "membuat",
}

# Casual & Jaksel Colloquial Normalizer (for Daily Conversation, Podcasts, Slang)
INDONESIAN_CASUAL_MAP = {
    r"\bbgt\b": "banget",
    r"\bbngt\b": "banget",
    r"\bgak\b": "nggak",
    r"\bga\b": "nggak",
    r"\bngga\b": "nggak",
    r"\bg\b": "nggak",
    r"\bklo\b": "kalau",
    r"\bkalo\b": "kalau",
    r"\byg\b": "yang",
    r"\bdgn\b": "dengan",
    r"\budh\b": "udah",
    r"\bsdh\b": "sudah",
    r"\bblm\b": "belum",
    r"\bbelom\b": "belum",
    r"\btp\b": "tapi",
    r"\btpi\b": "tapi",
    r"\bbeneran\b": "bener-bener",
    r"\bsantuy\b": "santai",
    r"\bgw\b": "gue",
    r"\bkrn\b": "karena",
    r"\bkarna\b": "karena",
    r"\bjd\b": "jadi",
    r"\bjgn\b": "jangan",
    r"\bkm\b": "kamu",
    r"\bsy\b": "saya",
    r"\blg\b": "lagi",
    r"\blgi\b": "lagi",
    r"\bskrg\b": "sekarang",
    r"\bskg\b": "sekarang",
    r"\bntar\b": "sebentar",
    r"\bgpp\b": "nggak apa-apa",
    r"\bgapapa\b": "nggak apa-apa",
    r"\bygy\b": "ya guys ya",
    r"\bbtw\b": "by the way",
    r"\bfyi\b": "for your information",
    r"\bpls\b": "tolong",
    r"\bplz\b": "tolong",
    r"\bthx\b": "terima kasih",
    r"\bty\b": "terima kasih",
    r"\btengs\b": "thanks",
}

def normalize_indonesian_text(text: str, is_formal: bool = False) -> str:
    mapping = INDONESIAN_FORMAL_MAP if is_formal else INDONESIAN_CASUAL_MAP
    cleaned = text
    for pattern, repl in mapping.items():
        cleaned = re.sub(pattern, repl, cleaned, flags=re.IGNORECASE)
    return cleaned

def prepare_indonesian_voice_params(
    text: str,
    voice_key: str,
    speed_multiplier: float = 1.0,
    stability: float = 0.5,
    style: float = 0.0
) -> tuple[str, str, str, str]:
    is_formal = "mahaputra" in voice_key or "formal" in voice_key or stability >= 0.70
    normalized = normalize_indonesian_text(text, is_formal=is_formal)

    # Process ElevenLabs Audio Prompt Tags into organic pause & tempo markers
    normalized = re.sub(r"\[(whispers?|whispering|bisik)\]", " ... ", normalized, flags=re.IGNORECASE)
    normalized = re.sub(r"\[/(whispers?|whispering|bisik)\]", "", normalized, flags=re.IGNORECASE)
    normalized = re.sub(r"\[(pause|jeda)\]", " ... — ", normalized, flags=re.IGNORECASE)
    normalized = re.sub(r"\[(clears throat|coughing|chuckling|sighing|laughing)\]", " ... ", normalized, flags=re.IGNORECASE)
    normalized = re.sub(r"\[.*?\]", "", normalized)  # Clean any remaining prompt tags

    # Biological Respiration & Pacing Pauses using natural punctuation
    normalized = re.sub(r"\.{3,}", "...", normalized)
    normalized = normalized.replace("...", "... — ")

    # Voice Archetype & Acoustic Timbre Calibration
    if "alwi" in voice_key:
        # Alwi: Cinematic Horror & Mystery Narrator (Medium-low baritone, warm, subtle husky, calm pacing)
        voice_id = "id-ID-ArdiNeural"
        rate_val = int(-8 * speed_multiplier)
        pitch_val = -6
    elif "athalea" in voice_key:
        # Athalea: Atmospheric & Chilling Storyteller (Medium-low female pitch, velvety, dark suspense)
        voice_id = "id-ID-GadisNeural"
        rate_val = int(-6 * speed_multiplier)
        pitch_val = -4
    elif "mahaputra" in voice_key or "formal" in voice_key:
        # Mahaputra: Formal, stiff, authoritative broadcast delivery
        voice_id = "id-ID-ArdiNeural"
        rate_val = int(-3 * speed_multiplier)
        pitch_val = -1
    elif "ujang" in voice_key or "jawa" in voice_key:
        # Ujang: Soft, gentle Javanese regional dialect, warm & relaxed
        voice_id = "id-ID-ArdiNeural"
        rate_val = int(-6 * speed_multiplier)
        pitch_val = -2
    elif "andi" in voice_key or "putra" in voice_key:
        # Andi / Putra: Young male casual, energetic creator & colloquial slang
        voice_id = "id-ID-ArdiNeural"
        rate_val = int(+5 * speed_multiplier)
        pitch_val = +1
    elif "siti" in voice_key or "alana" in voice_key or "casual" in voice_key or "jaksel" in voice_key:
        # Siti / Alana: Conversational female casual, lively Jaksel slang
        voice_id = "id-ID-GadisNeural"
        rate_val = int(+5 * speed_multiplier)
        pitch_val = +2
    elif "serena" in voice_key:
        # Serena: Heartfelt, soothing, deep emotional female narration
        voice_id = "id-ID-GadisNeural"
        rate_val = int(-10 * speed_multiplier)
        pitch_val = -2
    elif "naya" in voice_key:
        # Naya: Gentle, soothing bedtime fairy tale storyteller
        voice_id = "id-ID-GadisNeural"
        rate_val = int(-6 * speed_multiplier)
        pitch_val = 0
    elif "ardi" in voice_key or "baron" in voice_key or "horror" in voice_key:
        # Ardi / Baron: Deep cinematic narrator & horror storytelling (Medium-low, Warm, Husky, Resonant)
        voice_id = "id-ID-ArdiNeural"
        rate_val = int(-7 * speed_multiplier)
        pitch_val = -5
    else:
        # Default: Gadis (Cinematic, warm, female storyteller)
        voice_id = "id-ID-GadisNeural"
        rate_val = int(-7 * speed_multiplier)
        pitch_val = -2

    rate_str = f"{rate_val:+d}%"
    pitch_str = f"{pitch_val:+d}Hz"
    return normalized, voice_id, rate_str, pitch_str

class GenerateSpeechRequest(BaseModel):
    text: str
    target_voice: str = "gadis"
    stability: float = 0.5
    similarity_boost: float = 0.75
    style: float = 0.0
    speed: float = 1.0

@app.get("/health")
async def health():
    statuses = {}
    for name, url in SERVICES.items():
        try:
            r = await client.get(f"{url}/health", timeout=3.0)
            statuses[name] = r.json() if r.status_code == 200 else f"status {r.status_code}"
        except Exception as e:
            statuses[name] = f"offline ({str(e)})"
    return {
        "gateway": "online",
        "indonesian_engine": "ready",
        "voices": ["gadis", "siti", "ardi", "andreas", "woman"],
        "services": statuses,
    }

@app.post("/generate")
@app.post("/styletts2/generate")
async def generate_speech_endpoint(
    request: GenerateSpeechRequest,
    req: Request,
    background_tasks: BackgroundTasks,
    authorization: str = Header(None),
):
    voice_key = request.target_voice.lower().strip()

    # If it's an Indonesian Voice, generate directly via Neural Indonesian Anti-Robotic Engine
    indo_keys = ["alwi", "athalea", "gadis", "siti", "ardi", "baron", "horror", "mahaputra", "ujang", "serena", "naya", "andi", "casual", "formal", "jaksel", "jawa"]
    if voice_key in INDONESIAN_VOICES or any(k in voice_key for k in indo_keys):
        return await synthesize_indonesian(
            request.text,
            voice_key,
            request.speed,
            request.stability,
            request.style,
            req,
            background_tasks
        )

    # If it's a global voice or StyleTTS2 is not reachable, use studio neural voice
    if voice_key in GLOBAL_NEURAL_VOICES:
        return await synthesize_global_neural(
            request.text,
            voice_key,
            request.speed,
            req,
            background_tasks
        )

    # Otherwise proxy to StyleTTS2 (if Colab GPU is active)
    try:
        return await proxy_request("styletts2", "generate", req)
    except Exception:
        # Fallback to studio neural voice if Colab is offline
        return await synthesize_global_neural(
            request.text,
            "andreas",
            request.speed,
            req,
            background_tasks
        )

async def synthesize_global_neural(
    text: str,
    voice_key: str,
    speed: float,
    request: Request,
    background_tasks: BackgroundTasks
):
    import edge_tts

    voice_id = GLOBAL_NEURAL_VOICES.get(voice_key, "en-US-ChristopherNeural")
    rate_val = int((speed - 1.0) * 100)
    rate_str = f"{rate_val:+d}%"

    audio_id = str(uuid.uuid4())
    output_filename = f"{audio_id}.mp3"
    local_path = AUDIO_DIR / output_filename

    communicate = edge_tts.Communicate(text, voice_id, rate=rate_str)
    await communicate.save(str(local_path))

    if s3_client and S3_BUCKET:
        s3_key = f"{S3_PREFIX}/{output_filename}"
        s3_client.upload_file(str(local_path), S3_BUCKET, s3_key)
        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": s3_key},
            ExpiresIn=3600 * 24,
        )
        return {"audio_url": presigned_url, "s3_key": s3_key}

    base_url = str(request.base_url).rstrip("/")
    audio_url = f"{base_url}/audio/{output_filename}"
    return {"audio_url": audio_url, "s3_key": f"local/{output_filename}"}

async def synthesize_indonesian(
    text: str,
    voice_key: str,
    speed: float,
    stability: float,
    style: float,
    request: Request,
    background_tasks: BackgroundTasks
):
    import edge_tts

    # Prepare clean humanized text and calibrated acoustic parameters
    clean_text, voice_id, rate_str, pitch_str = prepare_indonesian_voice_params(
        text=text,
        voice_key=voice_key,
        speed_multiplier=speed,
        stability=stability,
        style=style
    )

    audio_id = str(uuid.uuid4())
    output_filename = f"{audio_id}.mp3"
    local_path = AUDIO_DIR / output_filename

    # Synthesize with natural organic storytelling intonation
    communicate = edge_tts.Communicate(clean_text, voice_id, rate=rate_str, pitch=pitch_str)
    await communicate.save(str(local_path))

    # If S3 client is configured, upload to S3
    if s3_client and S3_BUCKET:
        s3_key = f"{S3_PREFIX}/{output_filename}"
        s3_client.upload_file(str(local_path), S3_BUCKET, s3_key)
        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": s3_key},
            ExpiresIn=3600 * 24,
        )
        return {"audio_url": presigned_url, "s3_key": s3_key}

    # Otherwise return local static URL (100% Free, no S3 setup required!)
    base_url = str(request.base_url).rstrip("/")
    audio_url = f"{base_url}/audio/{output_filename}"
    return {"audio_url": audio_url, "s3_key": f"local/{output_filename}"}

@app.api_route("/convert", methods=["GET", "POST"])
@app.api_route("/seedvc/convert", methods=["GET", "POST"])
async def default_convert(request: Request):
    return await proxy_request("seedvc", "convert", request)

@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def routed_proxy(service: str, path: str, request: Request):
    if service not in SERVICES:
        return Response(content=f'{{"error": "Unknown service: {service}"}}', status_code=404, media_type="application/json")
    return await proxy_request(service, path, request)

async def proxy_request(service: str, path: str, request: Request):
    target_base = SERVICES[service]
    target_url = f"{target_base}/{path}"

    headers = dict(request.headers)
    headers.pop("host", None)
    body = await request.body()

    try:
        upstream_res = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
            params=request.query_params,
        )
        return Response(
            content=upstream_res.content,
            status_code=upstream_res.status_code,
            headers=dict(upstream_res.headers),
            media_type=upstream_res.headers.get("content-type"),
        )
    except Exception as e:
        return Response(
            content=f'{{"error": "Failed to connect to backend {service}", "detail": "{str(e)}"}}',
            status_code=502,
            media_type="application/json",
        )
