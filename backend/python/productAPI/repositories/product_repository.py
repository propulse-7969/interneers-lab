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
    
    @staticmethod
    def bulk_insert(products_data):
        products = [Product(**data) for data in products_data]
        Product.objects.insert(products)
        return True
        
    @staticmethod
    def get_filtered(filters: dict):
        queryset=Product.objects()
        
        categories = filters.get("categories")
        if categories:
            queryset=queryset.filter(category__in=categories)
        
        min_price = filters.get("min_price")
        if min_price is not None:
            queryset=queryset.filter(price__gte=min_price)
            
        max_price = filters.get("max_price")
        if max_price is not None:
            queryset=queryset.filter(price__lte=max_price)
        
        brand = filters.get("brand")
        if brand:
            queryset = queryset.filter(brand__icontains=brand)
            
        name=filters.get("name")
        if name:
            queryset = queryset.filter(name__icontains=name)
        
        return queryset
        