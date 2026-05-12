from rest_framework import serializers

class CategoryCountReportSerializer(serializers.Serializer):
    category = serializers.CharField()
    product_count=serializers.IntegerField()
    