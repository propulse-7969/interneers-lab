from productAPI.models import ProductCategory


class ProductCategoryRepository:
    
    @staticmethod
    def get_all():
        return ProductCategory.objects()
    
    @staticmethod
    def get_by_id(category_id):
        return ProductCategory.objects(id=category_id).first()
    
    @staticmethod
    def get_by_title(category_title):
        return ProductCategory.objects(title__iexact=category_title).first()
        
    @staticmethod
    def create(validated_data):
        category = ProductCategory(**validated_data)
        category.save()
        return category
    
    @staticmethod
    def update(category, validated_data):
        for key, value in validated_data.items():
            setattr(category,key,value)
        category.save()
        return category
    
    @staticmethod
    def delete(category):
        category.delete()
        