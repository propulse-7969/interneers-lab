import os
import sys
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_app.settings")
django.setup()

from productAPI.models import Product

def run():
    
    default_brand = "Unknown"
    
    products = Product.objects(brand = None)
    
    count = 0
    
    for prod in products:
        prod.brand = default_brand
        prod.save()
        count+=1
    
    if count == 0:
        print(f"Migration already performed earlier!")
    else:
        print(f"{count} products updates sucessfully!")

if __name__ == "__main__":
    run()