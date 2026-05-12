from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from productAPI.services.report_service import ReportService
from productAPI.serializers.report_serializer import CategoryCountReportSerializer, LowQuantityProductSerializer
from productAPI.services import AIService
from productAPI.constants import DEFAULT_THRESHOLD_VALUE

class CategoryCountReportController(APIView):

    def get(self, request):

        min_count = request.GET.get("min_count")
        max_count = request.GET.get("max_count")

        data = ReportService.get_category_count_report(
            min_count=int(min_count) if min_count else None,
            max_count=int(max_count) if max_count else None
        )

        serializer = CategoryCountReportSerializer(
            data,
            many=True
        )
        
        result = {}
        
        result["report"] = serializer.data
        
        analysis = (AIService.generate_category_report_analysis(serializer.data))
        
        result["analysis"] = analysis

        return Response(result, status=status.HTTP_200_OK)
    

class ProductsBelowThresholdController(APIView):
    
    def get(self, request):
        
        threshold_quantity = request.GET.get("threshold", DEFAULT_THRESHOLD_VALUE) 
        
        threshold_quantity=int(threshold_quantity)
        
        data = ReportService.get_product_below_threshold(threshold_quantity)
        
        serializer = LowQuantityProductSerializer(
            data,
            many=True
        )
        
        result = {}
        
        result["report"]  = serializer.data
        
        analysis = (AIService.generate_product_report_analysis(serializer.data))
        
        result["analysis"] = analysis
        
        
        return Response(result, status=status.HTTP_200_OK)
        
        