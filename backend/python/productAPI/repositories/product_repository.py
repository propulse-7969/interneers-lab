from productAPI.models import Product


class ProductRepository:
    
    @staticmethod
    def get_all():
        return Product.objects()
    
    @staticmethod
    def get_by_id(product_id):
        return Product.objects(id=product_id).first()
    
    @staticmethod
    def get_products_by_category(category_id):
        return Product.objects(category=category_id)
    
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
        
    @staticmethod
    def assign_category(product, category):
        product.category = category
        product.save()
        return True
    
    @staticmethod
    def unassign_category(product):
        setattr(product,"category",None)
        product.save()
        return True