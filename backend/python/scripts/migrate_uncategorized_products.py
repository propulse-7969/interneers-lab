import os
import sys
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_app.settings")
django.setup()

from productAPI.models import Product, ProductCategory

def run():
    
    uncategorized = ProductCategory.objects(title="Uncategorized").first()
    
    if not uncategorized:
        uncategorized = ProductCategory(
            title="Uncategorized",
            description="Products without an assigned category"
        )
        uncategorized.save()
        print("[Migration] Created 'Uncategorized' category")
    else:
        print("[Migration] Found existing 'Uncategorized' category")
    
    products_without_category = Product.objects(category=None)
    count = products_without_category.count()
    
    if count == 0:
        print("[Migration] No uncategorized products found, nothing to do!")
        return
    
    print(f"[Migration] Found {count} products without a category, migrating...")
    
    for product in products_without_category:
        product.category = uncategorized
        product.save()
    
    print(f"[Migration] Done! {count} products assigned to 'Uncategorized'")


if __name__ == "__main__":
    run()