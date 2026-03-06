from rest_framework_mongoengine import serializers
from productAPI.models import ProductCategory

class ProductCategorySerializer(serializers.DocumentSerializer):
    class Meta:
        model=ProductCategory
        fields = "__all__"