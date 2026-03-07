from productAPI.repositories import ProductRepository, ProductCategoryRepository
from django.core.paginator import Paginator

class ProductService:
    
    @staticmethod
    def list_products(page_number=None, sortby="desc"):
        products=ProductRepository.get_all()
        
        if sortby == "asc":
            products=products.order_by("updated_at")
        else:
            products=products.order_by("-updated_at")
        
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
    
        
    @staticmethod
    def assign_category(product_id, category_id):
        product = ProductRepository.get_by_id(product_id)
        category = ProductCategoryRepository.get_by_id(category_id)
        
        if product is None or category is None:
            return False
        
        return ProductRepository.assign_category(product, category)
        
        
        
    @staticmethod
    def unassign_category(product_id, category_id):
        product = ProductRepository.get_by_id(product_id)
        
        if product is None:
            return False
        
        return ProductRepository.unassign_category(product)
        
        
        
        