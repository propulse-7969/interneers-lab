from rest_framework import serializers

class CategoryCountReportSerializer(serializers.Serializer):
    category = serializers.CharField()
    category_id = serializers.CharField()
    product_count=serializers.IntegerField()
    
class LowQuantityProductSerializer(serializers.Serializer):
    product_name = serializers.CharField()
    product_id=serializers.CharField()
    product_quantity = serializers.IntegerField()