from rest_framework_mongoengine import serializers
from productAPI.models import Product


class ProductSerializer(serializers.DocumentSerializer):
    class Meta:
        model=Product
        fields = "__all__"