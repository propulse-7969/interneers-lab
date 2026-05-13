import os
from dotenv import load_dotenv
from groq import Groq


load_dotenv()


class AIService:

    client = Groq(
        api_key=os.getenv(
            "GROQ_API_KEY"
        )
    )


    MODEL = "llama-3.3-70b-versatile"


    @staticmethod
    def _generate(prompt):

        response = (
            AIService
            .client
            .chat
            .completions
            .create(
                model=AIService.MODEL,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.5,
                max_tokens=200
            )
        )

        return (
            response
            .choices[0]
            .message
            .content
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

        return AIService._generate(
            prompt
        )


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

        return AIService._generate(
            prompt
        )