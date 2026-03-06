from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from productAPI.services import ProductCategoryService
from productAPI.serializers import ProductCategorySerializer

class ProductCategoryListController(APIView):
    
    def get(self,request):
        categories = ProductCategoryService.get_categories()
        
        serializer = ProductCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
    
    
    def post(self, request):
        serializer = ProductCategorySerializer(data=request.data)
        
        if serializer.is_valid():
            category=ProductCategoryService.create_category(serializer.validated_data)
            return Response(
                ProductCategorySerializer(category).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    