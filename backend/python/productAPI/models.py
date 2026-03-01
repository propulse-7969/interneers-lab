#from django.db import models

import mongoengine as me

# Create your models here.
class Product(me.Document):
    name=me.StringField(max_length=150,required=True)
    description=me.StringField()
    category=me.StringField(max_length=100)
    price=me.IntField(min_value=0)
    brand=me.StringField(max_length=100)
    quantity=me.IntField()
    
    
    def __str__(self):
        return self.name