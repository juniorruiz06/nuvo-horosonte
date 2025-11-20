from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatMessage(BaseModel):
    message: str
    context: str = ""

class EmailTemplateRequest(BaseModel):
    buyer_name: str
    mineral_type: str
    quantity_kg: float

class WhatsAppTemplateRequest(BaseModel):
    buyer_name: str
    mineral_type: str

@router.post("/ask")
def ask_assistant(msg: ChatMessage):
    service = GeminiService()
    response = service.generate_response(msg.message, msg.context)
    return {"response": response}

@router.post("/templates/email")
def generate_email_template(req: EmailTemplateRequest):
    service = GeminiService()
    template = service.generate_email_template(req.buyer_name, req.mineral_type, req.quantity_kg)
    return {"template": template}

@router.post("/templates/whatsapp")
def generate_whatsapp_template(req: WhatsAppTemplateRequest):
    service = GeminiService()
    template = service.generate_whatsapp_template(req.buyer_name, req.mineral_type)
    return {"template": template}
