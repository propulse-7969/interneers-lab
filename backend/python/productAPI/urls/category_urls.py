from django.urls import path
from productAPI.controllers import ProductCategoryListController, ProductCategoryDetailController, CategoryProductController

urlpatterns = [
    path("categories/", ProductCategoryListController.as_view()),
    path("categories/<str:category_id>/",ProductCategoryDetailController.as_view()),
    path("categories/<str:category_id>/products/",CategoryProductController.as_view()),
]
