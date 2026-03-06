from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from productAPI.services import ProductCategoryService
from productAPI.serializers import ProductSerializer

class CategoryProductController(APIView):
    
    def get(self, request, category_id):
        products = ProductCategoryService.get_products_by_category(category_id)
        
        serializer = ProductSerializer(products, many=True)
        
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
    
    