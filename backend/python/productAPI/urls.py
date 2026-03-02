from django.urls import path
from .controllers.product_list_controller import ProductListController
from .controllers.product_detail_controller import ProductDetailController

urlpatterns = [
    path("", ProductListController.as_view()),
    path("<str:product_id>/", ProductDetailController.as_view()),
]
