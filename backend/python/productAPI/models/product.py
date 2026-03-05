#from django.db import models

import mongoengine as me
from datetime import datetime
from zoneinfo import ZoneInfo
from .product_category import ProductCategory

IST = ZoneInfo("Asia/Kolkata")

# Create your models here.
class Product(me.Document):
    name=me.StringField(max_length=150,required=True)
    description=me.StringField()
    category=me.ReferenceField(ProductCategory)
    price=me.IntField(min_value=0)
    brand=me.StringField(max_length=100)
    quantity=me.IntField()
    created_at=me.DateTimeField(default=datetime.now(IST))
    updated_at=me.DateTimeField(default=datetime.now(IST))
    
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        now=datetime.now(IST)
        
        if not self.created_at:
            self.created_at = now
        
        self.updated_at = now
        
        return super().save(*args, **kwargs)
    
        