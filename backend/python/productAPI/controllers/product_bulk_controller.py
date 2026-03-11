from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from productAPI.services import ProductService


class ProductBulkUploadController(APIView):
    
    def post(self, request):
        
        file=request.FILES.get("file")
        
        if not file:
            return Response(
                {"error":"CSV file is a must!!!"},
                status = status.HTTP_400_BAD_REQUEST
            )
            
        try: 
            result = ProductService.bulk_create_products(file)
            return Response(
                result,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
            
