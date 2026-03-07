from django.urls import path
from productAPI.controllers import ProductCategoryListController, ProductCategoryDetailController, CategoryWiseProductListController, CategoryWiseProductDetailController

urlpatterns = [
    path("categories/", ProductCategoryListController.as_view()),
    path("categories/<str:category_id>/",ProductCategoryDetailController.as_view()),
    path("categories/<str:category_id>/products/",CategoryWiseProductListController.as_view()),
    path("categories/<str:category_id>/products/<str:product_id>/", CategoryWiseProductDetailController.as_view())
]
