from ..repositories.product_repository import ProductRepository
from django.core.paginator import Paginator

class ProductService:
    
    @staticmethod
    def list_products(page_number=None):
        products=ProductRepository.get_all()
        
        if page_number:
            paginator = Paginator(products,2)
            page=paginator.get_page(page_number)
            return page

        return products
    
    @staticmethod
    def create_product(validated_data):
        return ProductRepository.create(validated_data)
    
    @staticmethod
    def update_product(product_id, validated_data):
        product = ProductRepository.get_by_id(product_id)
        
        if not product:
            return None
        
        return ProductRepository.update(product, validated_data)
    
    
    @staticmethod
    def delete_product(product_id):
        product = ProductRepository.get_by_id(product_id)
        
        if not product:
            return None
        
        ProductRepository.delete(product)
        
        return True
    
        
    