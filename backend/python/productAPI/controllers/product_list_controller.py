from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from productAPI.services import ProductService
from productAPI.serializers import ProductSerializer

class ProductListController(APIView):
    
    def get(self, request):
        page_number = request.GET.get("page")
        sorting = request.GET.get("sortby","desc")
        
        filters={}
        categories = request.GET.get("categories")
        if categories:
            filters["categories"] = categories.split(",")
        
        min_price = request.GET.get("min_price")
        if min_price is not None:
            try:
                filters["min_price"]=int(min_price)
            except ValueError:
                return Response(
                    {"error":"min_price muse be a valid number"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        max_price = request.GET.get("max_price")
        if max_price is not None:
            try:
                filters["max_price"]=int(max_price)
            except ValueError:
                return Response(
                    {"error":"max_price muse be a valid number"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        brand = request.GET.get("brand")
        if brand:
            filters["brand"]=brand 
        
        name = request.GET.get("name")
        if name:
            filters["name"]=name
            
            
        products = ProductService.list_products(page_number, sorting, filters)
        
        
        
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
    
    
    