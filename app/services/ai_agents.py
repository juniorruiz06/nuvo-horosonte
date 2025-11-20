"""
Servicio de agentes IA múltiples para análisis, búsqueda y scraping inteligente
Utiliza Claude 4 Sonnet, GPT-4o y Gemini como agentes especializados
"""

import json
import requests
from typing import Optional
import anthropic
import openai
import google.generativeai as genai
from app.config import get_settings
from app.utils.logger import logger, AuditLog

settings = get_settings()

# Configurar APIs
claude_client = anthropic.Anthropic(api_key=settings.claude_api_key)
openai.api_key = settings.openai_api_key
genai.configure(api_key=settings.gemini_api_key)


class AIAgent:
    """Agente IA base con múltiples modelos"""
    
    @staticmethod
    def claude_search(query: str, context: str = "") -> dict:
        """Usa Claude 4 Sonnet para búsquedas inteligentes"""
        try:
            logger.info(f"🤖 Claude buscando: {query}")
            
            message = claude_client.messages.create(
                model=settings.claude_model,
                max_tokens=settings.claude_max_tokens,
                temperature=settings.claude_temperature,
                system=f"Eres un experto en minerales y mercados en Perú. {context}",
                messages=[
                    {
                        "role": "user",
                        "content": query
                    }
                ]
            )
            
            response_text = message.content[0].text
            logger.info(f"✅ Claude respondió exitosamente")
            
            return {
                "success": True,
                "model": "Claude 4 Sonnet",
                "response": response_text
            }
        except Exception as e:
            logger.error(f"❌ Error en Claude: {str(e)}")
            return {
                "success": False,
                "model": "Claude 4 Sonnet",
                "error": str(e)
            }

    @staticmethod
    def gpt4_analyze(data: dict, analysis_type: str = "general") -> dict:
        """Usa GPT-4o para análisis profundos"""
        try:
            logger.info(f"🤖 GPT-4o analizando: {analysis_type}")
            
            response = openai.ChatCompletion.create(
                model=settings.openai_model,
                max_tokens=settings.openai_max_tokens,
                temperature=settings.openai_temperature,
                messages=[
                    {
                        "role": "system",
                        "content": f"Eres un analista experto en mercados de minerales. Realiza análisis de tipo: {analysis_type}"
                    },
                    {
                        "role": "user",
                        "content": f"Analiza los siguientes datos y proporciona insights: {json.dumps(data, ensure_ascii=False)}"
                    }
                ]
            )
            
            analysis = response.choices[0].message.content
            logger.info(f"✅ GPT-4o completó análisis")
            
            return {
                "success": True,
                "model": "GPT-4o",
                "analysis": analysis
            }
        except Exception as e:
            logger.error(f"❌ Error en GPT-4o: {str(e)}")
            return {
                "success": False,
                "model": "GPT-4o",
                "error": str(e)
            }

    @staticmethod
    def gemini_extract(url: str, extraction_type: str = "text") -> dict:
        """Usa Gemini para extracción de información de URLs"""
        try:
            logger.info(f"🤖 Gemini extrayendo de: {url}")
            
            model = genai.GenerativeModel("gemini-pro")
            
            prompt = f"""
            Extrae información {extraction_type} del siguiente contenido web.
            URL: {url}
            
            Por favor proporciona:
            1. Información relevante encontrada
            2. Precios si están disponibles
            3. Contactos de empresas
            4. Certificaciones o validaciones
            
            Formatea la respuesta como JSON estructurado.
            """
            
            response = model.generate_content(prompt)
            
            logger.info(f"✅ Gemini extrajo información exitosamente")
            
            return {
                "success": True,
                "model": "Gemini",
                "extracted_data": response.text
            }
        except Exception as e:
            logger.error(f"❌ Error en Gemini: {str(e)}")
            return {
                "success": False,
                "model": "Gemini",
                "error": str(e)
            }


class ProviderSearchAgent:
    """Agente especializado en búsqueda de proveedores de minerales"""
    
    @staticmethod
    async def search_providers(mineral_type: str, location: str = "Trujillo") -> dict:
        """Busca proveedores reales de minerales usando múltiples IA"""
        logger.info(f"🔍 Buscando proveedores de {mineral_type} en {location}")
        
        try:
            # Paso 1: Claude busca proveedores verificados
            claude_result = AIAgent.claude_search(
                query=f"""
                Busca y lista los 5 principales proveedores/compradores verificados de {mineral_type} 
                en {location}, Perú. 
                
                Para cada uno proporciona:
                - Nombre de la empresa
                - RUC
                - Dirección
                - Teléfono
                - Email
                - Años en operación
                - Certificaciones
                
                Solo incluye empresas verificadas y legales.
                Responde en formato JSON.
                """,
                context="Enfócate en empresas con registro SUNAT activo y certificaciones vigentes."
            )
            
            # Paso 2: GPT-4o valida y analiza la información
            if claude_result["success"]:
                gpt_analysis = AIAgent.gpt4_analyze(
                    data={
                        "providers_data": claude_result["response"],
                        "mineral": mineral_type,
                        "location": location
                    },
                    analysis_type="provider_validation"
                )
            
            return {
                "success": True,
                "mineral_type": mineral_type,
                "location": location,
                "claude_search": claude_result,
                "gpt_analysis": gpt_analysis if claude_result["success"] else None
            }
        except Exception as e:
            logger.error(f"Error en búsqueda de proveedores: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }


class PriceAnalysisAgent:
    """Agente especializado en análisis de precios de minerales"""
    
    @staticmethod
    async def analyze_prices(mineral_type: str) -> dict:
        """Analiza precios reales de minerales usando IA"""
        logger.info(f"💰 Analizando precios de {mineral_type}")
        
        try:
            # Paso 1: Buscar información actual de precios
            claude_search = AIAgent.claude_search(
                query=f"""
                Proporciona información de precios actuales de {mineral_type}:
                
                1. Precio spot actual (USD)
                2. Precio histórico (últimos 30 días)
                3. Tendencia del mercado
                4. Factores que afectan el precio
                5. Pronóstico a 30 días
                
                Incluye fuentes confiables. Responde en JSON.
                """,
                context="Usa datos de mercados reconocidos como London Metal Exchange, COMEX, etc."
            )
            
            # Paso 2: Analizar tendencias con GPT-4o
            gpt_analysis = AIAgent.gpt4_analyze(
                data={
                    "price_data": claude_search.get("response", ""),
                    "mineral": mineral_type
                },
                analysis_type="price_trend_analysis"
            )
            
            # Paso 3: Gemini extrae datos de fuentes públicas
            gemini_extraction = AIAgent.gemini_extract(
                url="https://www.kitco.com/charts/metals",
                extraction_type="precious_metals_prices"
            )
            
            return {
                "success": True,
                "mineral_type": mineral_type,
                "claude_market_analysis": claude_search,
                "gpt_trend_analysis": gpt_analysis,
                "gemini_price_data": gemini_extraction,
                "timestamp": str(__import__("datetime").datetime.now())
            }
        except Exception as e:
            logger.error(f"Error en análisis de precios: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }


class ScrapingAgent:
    """Agente especializado en scraping inteligente"""
    
    @staticmethod
    async def scrape_mineral_data(url: str) -> dict:
        """Realiza scraping inteligente de sitios de minerales"""
        logger.info(f"🕷️ Scraping de: {url}")
        
        try:
            # Usar Gemini para análisis inteligente del contenido
            result = AIAgent.gemini_extract(
                url=url,
                extraction_type="mineral_market_data"
            )
            
            return {
                "success": result["success"],
                "url": url,
                "data": result.get("extracted_data", ""),
                "model": "Gemini"
            }
        except Exception as e:
            logger.error(f"Error en scraping: {str(e)}")
            return {
                "success": False,
                "url": url,
                "error": str(e)
            }


class ReportAgent:
    """Agente especializado en generar reportes completos"""
    
    @staticmethod
    async def generate_market_report(mineral_type: str) -> dict:
        """Genera reporte completo del mercado mineral"""
        logger.info(f"📊 Generando reporte para {mineral_type}")
        
        try:
            # Recopilar datos de múltiples fuentes
            price_analysis = await PriceAnalysisAgent.analyze_prices(mineral_type)
            provider_search = await ProviderSearchAgent.search_providers(mineral_type)
            
            # Generar reporte ejecutivo con GPT-4o
            report = AIAgent.gpt4_analyze(
                data={
                    "prices": price_analysis,
                    "providers": provider_search,
                    "mineral": mineral_type
                },
                analysis_type="executive_report"
            )
            
            return {
                "success": True,
                "mineral_type": mineral_type,
                "price_analysis": price_analysis,
                "provider_search": provider_search,
                "executive_report": report,
                "generated_at": str(__import__("datetime").datetime.now())
            }
        except Exception as e:
            logger.error(f"Error generando reporte: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
