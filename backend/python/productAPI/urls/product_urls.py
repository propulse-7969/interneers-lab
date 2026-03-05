from django.urls import path
from ..controllers.product_list_controller import ProductListController
from ..controllers.product_detail_controller import ProductDetailController

urlpatterns = [
    path("product/", ProductListController.as_view()),
    path("product/<str:product_id>/", ProductDetailController.as_view()),
]
