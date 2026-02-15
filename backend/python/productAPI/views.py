from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializer import ProductSerializer
from rest_framework import status
from django.core.paginator import Paginator


# Create your views here.
class ProductListCreate(APIView):
    
    def get(self, request):
        products = Product.objects.all()
        paginator = Paginator(products,3)
        
        page_number = request.GET.get('page')
        if page_number is not None:
            page_number = int(page_number)
        
        data = paginator.get_page(page_number)
        serializer = ProductSerializer(data, many=True)
        
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ProductSerializer(data = request.data)
        
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    

class ProductUpdateDelete(APIView):
    
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None
    
    def put(self, request, pk):
        product=self.get_object(pk)
        
        if product is None:
            return Response(
                {"error":"No Product found!!!"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProductSerializer(product, data=request.data)  
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def delete(self, request, pk):
        product=self.get_object(pk)
        
        if product is None:
            return Response(
                {"error":"Product Not Found!!!"},
                status=status.HTTP_404_NOT_FOUND
            ) 
        
        product.delete()
        return Response(
            {"message":"Product deleted successfully!!!"},
            status=status.HTTP_204_NO_CONTENT
        )
         
    