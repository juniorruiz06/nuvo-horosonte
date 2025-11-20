import google.generativeai as genai
from app.config import get_settings
from app.utils.logger import logger

settings = get_settings()

class GeminiService:
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel("gemini-pro")
            logger.info("✅ Gemini API inicializada correctamente")
        else:
            logger.warning("❌ GEMINI_API_KEY no está configurada")
            self.model = None

    def generate_response(self, prompt: str, context: str = "") -> str:
        """Genera respuesta usando Gemini."""
        if not self.model:
            return "Error: Gemini API no está configurado. Configura GEMINI_API_KEY en .env"
        
        try:
            full_prompt = f"""Eres MINERAL-AGENT, un asistente especializado en ayudar a vendedores de minerales en Trujillo, Perú.

Contexto: {context if context else 'Soy un vendedor de minerales en Trujillo'}

Pregunta del usuario: {prompt}

Proporciona una respuesta clara, estructurada y útil en español. Si es sobre precios o cálculos, sé específico con números."""
            
            response = self.model.generate_content(full_prompt)
            logger.info(f"✅ Respuesta generada correctamente")
            return response.text
        except Exception as e:
            logger.error(f"❌ Error generando respuesta Gemini: {str(e)}")
            return f"Error: {str(e)}"

    def generate_email_template(self, buyer_name: str, mineral_type: str, quantity_kg: float) -> str:
        """Genera plantilla de correo de contacto."""
        prompt = f"""Genera una plantilla profesional de correo en español para contactar a un comprador de minerales.
        
Detalles:
- Comprador: {buyer_name}
- Mineral: {mineral_type}
- Cantidad: {quantity_kg} kg

La plantilla debe ser formal, incluir información de contacto placeholder y mostrar interés en negociar."""
        
        return self.generate_response(prompt)

    def generate_whatsapp_template(self, buyer_name: str, mineral_type: str) -> str:
        """Genera plantilla de mensaje WhatsApp."""
        prompt = f"""Genera un mensaje breve y profesional para WhatsApp en español dirigido a {buyer_name}.
        
Asunto: Interés en venta de {mineral_type}

El mensaje debe ser conciso (máx. 3 líneas), profesional y incluir invitación a conversar."""
        
        return self.generate_response(prompt)

    def analyze_market(self, mineral_type: str) -> str:
        """Analiza el mercado de un mineral específico."""
        prompt = f"""Proporciona un análisis del mercado actual de {mineral_type} en Perú.
        
Incluye:
1. Tendencia de precios
2. Demanda actual
3. Principales compradores
4. Recomendaciones para vendedores

Sé conciso y práctico."""
        
        return self.generate_response(prompt)
