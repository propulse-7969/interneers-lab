from ..models import Product


class ProductRepository:
    
    @staticmethod
    def get_all():
        return Product.objects()
    
    @staticmethod
    def get_by_id(product_id):
        return Product.objects(id=product_id).first()
    
    @staticmethod
    def create(validated_data):
        product = Product(**validated_data)
        product.save()
        return product
    
    @staticmethod
    def update(product, validated_data):
        for key,value in validated_data.items():
            setattr(product,key,value)
        product.save()
        return product
    
    @staticmethod
    def delete(product):
        product.delete()