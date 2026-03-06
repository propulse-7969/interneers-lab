from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, JsonResponse
# from productAPI.views import ProductListCreate, ProductUpdateDelete


# def hello_world(request):
    
#     name = request.GET.get("name")
#     if name is not None :
#         return JsonResponse({"message":f"Namaste, {name}"})
#     return HttpResponse("Hello, world! This is our interneers-lab Django server.")

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('hello/', hello_world),
    path('api/', include("productAPI.urls.product_urls")),
    path('api/', include("productAPI.urls.category_urls"))
    
]
