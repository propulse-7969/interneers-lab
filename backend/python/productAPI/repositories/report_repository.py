from productAPI.models.product import Product
from productAPI.models.product_category import ProductCategory

class ReportRepository:
    
    @staticmethod
    def get_category_count():

        result = []

        for category in ProductCategory.objects():

            count = Product.objects(
                category=category
            ).count()

            result.append({
                "category": category.title,
                "category_id":category.id,
                "product_count": count
            })

        return result
    
    
    def get_low_quantity_products(threshold):
        
        products = Product.objects(quantity__lt = threshold)
        
        result = []
        
        for product in products:
            
            result.append({
                "product_id": str(
                    product.id
                ),
                "product_name": product.name,
                "product_quantity": product.quantity
            })
        
        return result
        
        
        