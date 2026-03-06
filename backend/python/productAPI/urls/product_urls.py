from django.urls import path
from productAPI.controllers import ProductListController
from productAPI.controllers import ProductDetailController

urlpatterns = [
    path("product/", ProductListController.as_view()),
    path("product/<str:product_id>/", ProductDetailController.as_view()),
]
