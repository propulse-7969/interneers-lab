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
                "product_count": count
            })

        return result