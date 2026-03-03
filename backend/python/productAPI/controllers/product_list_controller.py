from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..services.product_service import ProductService
from ..serializers.product_serializer import ProductSerializer

class ProductListController(APIView):
    
    def get(self, request):
        page_number = request.GET.get("page")
        sorting = request.GET.get("sortby","desc")
        
        products = ProductService.list_products(page_number, sorting)
        
        
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ProductSerializer(data=request.data) #this ones to valiidate json
        
        if serializer.is_valid():
            product = ProductService.create_product(serializer.validated_data)
            return Response(
                ProductSerializer(product).data, #this to convert object to json
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    