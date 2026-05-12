from productAPI.repositories import ProductRepository, ProductCategoryRepository
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
import csv
from io import StringIO
from productAPI.constants import DEFAULT_PRODUCT_PAGE_SIZE
from productAPI.serializers import ProductSerializer


class ProductService:
    
    @staticmethod
    def list_products(filters=None):
        
        if filters:
            category_names=filters.get("categories")
            if category_names:
                resolved_categories = []
                for title in category_names:
                    category = ProductCategoryRepository.get_by_title(title)
                    if category:
                        resolved_categories.append(category)
                filters["categories"]=resolved_categories
            
            products=ProductRepository.get_filtered(filters)
        else:
            products=ProductRepository.get_all()

        f = filters or {}
        sortby = f.get("sortby", "desc")
        page_number = f.get("page", 1)

        if sortby == "asc":
            products=products.order_by("updated_at")
        else:
            products=products.order_by("-updated_at")

        if page_number:
            paginator = Paginator(products,DEFAULT_PRODUCT_PAGE_SIZE)
            try:
                return paginator.page(page_number)
            except PageNotAnInteger:
                return paginator.page(1)
            except EmptyPage:
                return []

        return products
    
    @staticmethod
    def list_single_product(product_id):
        product = ProductRepository.get_by_id(product_id)
        
        if not product:
            return None
        
        return product
        
    
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
        
        if product.category is None or str(product.category.id) != category_id:
            return False
        
        return ProductRepository.unassign_category(product)
        
        
        
    @staticmethod
    def bulk_create_products(file):

        file_decode = file.read().decode("utf-8-sig")
        io_string = StringIO(file_decode)

        reader = csv.DictReader(io_string)

        if not reader.fieldnames:
            raise ValueError("CSV is empty")

        rows = list(reader)

        for row in rows:

            if not row.get("category"):
                row["category"] = None

            if row.get("price"):
                row["price"] = int(row["price"])

            if row.get("quantity"):
                row["quantity"] = int(row["quantity"])

        serializer = ProductSerializer(
            data=rows,
            many=True
        )

        serializer.is_valid(raise_exception=True)

        result = ProductRepository.bulk_insert(
            serializer.validated_data
        )

        if result is not False:
            return {
                "message": "Bulk Insert Successful!",
                "count": len(serializer.validated_data)
            }

        return False