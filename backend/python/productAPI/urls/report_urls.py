from django.urls import path
from productAPI.controllers.report_controller import (
    CategoryCountReportController
)

urlpatterns = [
    path(
        "report/categories/",
        CategoryCountReportController.as_view()
    )
]