import os
from dotenv import load_dotenv

import google.generativeai as genai

load_dotenv()

class AIService:
    
    genai.configure(
        api_key=os.getenv(
            "GEMINI_API_KEY"
        )
    )
    
    model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )
    
    @staticmethod
    def generate_category_report_analysis(data):
    
        prompt = f"""

        Analyze this inventory data.

        {data}

        In around 100 words,
        provide a concise business
        analysis of:

        1. Category wise product variety 
        2. Actionable suggestions

        Return plain text only.

        """

        response = (
            AIService
            .model
            .generate_content(
                prompt
            )
        )

        return response.text    
    
    @staticmethod
    def generate_product_report_analysis(data):
    
        prompt = f"""

        Analyze this inventory data.

        {data}

        In around 100 words,
        provide a concise business
        analysis of:

        1. Stock shortages
        2. Overstock risks
        3. Actionable suggestions

        Return plain text only.

        """

        response = (
            AIService
            .model
            .generate_content(
                prompt
            )
        )

        return response.text    