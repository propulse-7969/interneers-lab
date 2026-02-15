from django.contrib import admin
from django.urls import path
from django.http import HttpResponse, JsonResponse
from productAPI.views import ProductListCreate, ProductUpdateDelete


def hello_world(request):
    
    name = request.GET.get("name")
    if name is not None :
        return JsonResponse({"message":f"Namaste, {name}"})
    return HttpResponse("Hello, world! This is our interneers-lab Django server.")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', hello_world),
    path('api/product/',ProductListCreate.as_view(), name="Get all products or add a new one"),
    path('api/product/<int:pk>/',ProductUpdateDelete.as_view(),name="Update or Delete a specific product")
    
]
