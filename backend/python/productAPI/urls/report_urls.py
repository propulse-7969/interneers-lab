from django.urls import path
from productAPI.controllers.report_controller import CategoryCountReportController, ProductsBelowThresholdController

urlpatterns = [
    path(
        "report/categories/",
        CategoryCountReportController.as_view()
    ),
    path(
        "report/products/",
        ProductsBelowThresholdController.as_view()
    )
    
]