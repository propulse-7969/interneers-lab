from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from productAPI.services import ProductCategoryService, ProductService
from productAPI.serializers import ProductSerializer

class CategoryWiseProductListController(APIView):
    
    def get(self, request, category_id):
        products = ProductCategoryService.get_products_by_category(category_id)
        
        serializer = ProductSerializer(products, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, category_id):
        product_id = request.data.get("id")
        result = ProductService.assign_category(product_id,category_id)
        if not result:
            return Response(
                {
                    "error":"No product found with the given ID"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {
                "message":"Successfully Added product to this category"
            },
            status=status.HTTP_200_OK
        )
    

        
    