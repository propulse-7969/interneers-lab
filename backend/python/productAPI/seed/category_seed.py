from productAPI.models import ProductCategory

DEFAULT_CATEGORIES = [
    {"title": "Food", "description": "Edible products and groceries"},
    {"title": "Kitchen Essentials", "description": "Cookware, utensils and kitchen tools"},
    {"title": "Electronics", "description": "Gadgets, devices and accessories"},
    {"title": "Personal Care", "description": "Health and hygiene products"},
    {"title": "Uncategorized", "description": "Products without an assigned category"}
]

def seed_categories():
    for category in DEFAULT_CATEGORIES:
        
        check = ProductCategory.objects(title=category['title']).first()
        
        if not check:
            newcat=ProductCategory(**category)
            newcat.save()
            print(f"[Seed] Created category: {category['title']}")
        else:
            print(f"[Seed] Skipping as Category already exists!: {category['title']}")
            