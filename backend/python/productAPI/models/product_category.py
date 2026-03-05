import mongoengine as me


class ProductCategory(me.Document):
    
    title = me.StringField(max_length=100, required=True)
    description = me.StringField()
    author = me.StringField(max_length=100)