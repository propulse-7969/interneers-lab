from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("productAPI.urls.product_urls")),
    path('api/', include("productAPI.urls.category_urls")),
    path('api/', include("productAPI.urls.report_urls")),
]
